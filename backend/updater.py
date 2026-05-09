"""
backend/updater.py
Weekly trial data updater for TrialNavigator.
Fetches trials for all diseases in the registry, detects changes, writes JSON cache.
Run via GitHub Actions cron: .github/workflows/update.yml

Usage:
    python backend/updater.py
    python backend/updater.py --disease cacna1a   # single disease
"""

import json
import sqlite3
import requests
import time
import os
import argparse
from datetime import datetime

DB_PATH     = os.environ.get("DB_PATH",     "trials.db")
OUTPUT_PATH = os.environ.get("OUTPUT_PATH", "public/trials_cache.json")
DIGEST_PATH = os.environ.get("DIGEST_PATH", "public/update_digest.json")

BASE_URL = "https://clinicaltrials.gov/api/v2/studies"

# Mirror of src/api/diseases.js DISEASE_REGISTRY queries.
# Keep in sync when adding diseases to the frontend registry.
DISEASE_QUERIES = {
    "cacna1a":     ["CACNA1A", "familial hemiplegic migraine", "episodic ataxia type 2", "spinocerebellar ataxia type 6", "FHM1"],
    "angelman":    ["Angelman syndrome", "UBE3A"],
    "ctnnb1":      ["CTNNB1 syndrome"],
    "cask":        ["CASK gene disorder"],
    "foxg1":       ["FOXG1 syndrome"],
    "stxbp1":      ["STXBP1"],
    "kcnq2":       ["KCNQ2 epilepsy"],
    "cdkl5":       ["CDKL5 deficiency"],
    "kif1a":       ["KIF1A disorder", "KAND"],
    "dravet":      ["Dravet syndrome", "SCN1A epilepsy"],
    "mowat_wilson":["Mowat-Wilson syndrome"],
    "gaba_a":      ["GABA-A receptor disorder", "GABRA1", "GABRB3"],
    "glut1":       ["GLUT1 deficiency"],
    "lgmd":        ["limb girdle muscular dystrophy"],
    "syngap1":     ["SYNGAP1"],
    "dup15q":      ["Dup15q syndrome"],
    "grin":        ["GRIN disorder", "GRIN2B"],
    "mef2c":       ["MEF2C haploinsufficiency"],
    "kcnh1":       ["KCNH1 disorder"],
    "inad":        ["infantile neuroaxonal dystrophy", "PLA2G6"],
    "setbp1":      ["SETBP1 haploinsufficiency"],
    "koolen":      ["Koolen-de Vries syndrome", "KANSL1"],
    "slc13a5":     ["SLC13A5 epilepsy"],
    "ahc":         ["alternating hemiplegia of childhood", "ATP1A3"],
    "nars1":       ["NARS1 disorder"],
    "frrs1l":      ["FRRS1L disorder"],
}


def init_db(conn):
    conn.execute("""
        CREATE TABLE IF NOT EXISTS trials (
            nct_id      TEXT PRIMARY KEY,
            disease     TEXT,
            title       TEXT,
            status      TEXT,
            updated_at  TEXT,
            data_json   TEXT
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS changes (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            nct_id      TEXT,
            disease     TEXT,
            change_type TEXT,
            old_value   TEXT,
            new_value   TEXT,
            detected_at TEXT
        )
    """)
    conn.commit()


def fetch_for_query(query):
    params = {
        "query.cond": query,
        "query.term": query,
        "pageSize": 100,
        "format": "json",
    }
    try:
        resp = requests.get(BASE_URL, params=params, timeout=30)
        resp.raise_for_status()
        return resp.json().get("studies", [])
    except requests.RequestException as e:
        print(f"  Query failed for '{query}': {e}")
        return []


def fetch_all_for_disease(disease_id, queries):
    seen = {}
    for q in queries:
        for study in fetch_for_query(q):
            nct_id = study.get("protocolSection", {}).get("identificationModule", {}).get("nctId")
            if nct_id and nct_id not in seen:
                seen[nct_id] = study
        time.sleep(0.4)
    return list(seen.values()), disease_id


def extract_fields(study):
    ps = study.get("protocolSection", {})
    return {
        "nct_id": ps.get("identificationModule", {}).get("nctId", ""),
        "title":  ps.get("identificationModule", {}).get("briefTitle", ""),
        "status": ps.get("statusModule", {}).get("overallStatus", ""),
    }


def store_and_diff(conn, studies, disease_id):
    changes = []
    now = datetime.utcnow().isoformat()

    for study in studies:
        f = extract_fields(study)
        nct_id = f["nct_id"]
        if not nct_id:
            continue

        row = conn.execute("SELECT status FROM trials WHERE nct_id = ?", (nct_id,)).fetchone()

        if row is None:
            changes.append({"nct_id": nct_id, "disease": disease_id, "change_type": "new_trial", "old": None, "new": f["status"], "at": now})
        elif row[0] != f["status"]:
            changes.append({"nct_id": nct_id, "disease": disease_id, "change_type": "status_change", "old": row[0], "new": f["status"], "at": now})

        conn.execute("""
            INSERT INTO trials (nct_id, disease, title, status, updated_at, data_json)
            VALUES (?, ?, ?, ?, ?, ?)
            ON CONFLICT(nct_id) DO UPDATE SET
                disease    = excluded.disease,
                title      = excluded.title,
                status     = excluded.status,
                updated_at = excluded.updated_at,
                data_json  = excluded.data_json
        """, (nct_id, disease_id, f["title"], f["status"], now, json.dumps(study)))

    for c in changes:
        conn.execute(
            "INSERT INTO changes (nct_id, disease, change_type, old_value, new_value, detected_at) VALUES (?, ?, ?, ?, ?, ?)",
            (c["nct_id"], c["disease"], c["change_type"], c["old"], c["new"], c["at"])
        )

    conn.commit()
    return changes


def write_cache(conn):
    rows = conn.execute("SELECT disease, nct_id, title, status, data_json FROM trials").fetchall()
    by_disease = {}
    for disease, nct_id, title, status, data_json in rows:
        if disease not in by_disease:
            by_disease[disease] = []
        try:
            raw = json.loads(data_json)
            ps = raw.get("protocolSection", {})
            by_disease[disease].append({
                "nctId":       nct_id,
                "briefTitle":  ps.get("identificationModule", {}).get("briefTitle", title),
                "status":      status,
                "phase":       (ps.get("designModule", {}).get("phases") or [""])[0],
                "conditions":  ps.get("conditionsModule", {}).get("conditions", []),
                "minAge":      ps.get("eligibilityModule", {}).get("minimumAge", ""),
                "briefSummary": ps.get("descriptionModule", {}).get("briefSummary", "")[:300],
                "locationCount": len(ps.get("contactsLocationsModule", {}).get("locations", [])),
            })
        except Exception:
            pass

    os.makedirs(os.path.dirname(OUTPUT_PATH) or ".", exist_ok=True)
    with open(OUTPUT_PATH, "w") as f:
        json.dump({"updated": datetime.utcnow().isoformat(), "diseases": by_disease}, f, indent=2)
    print(f"  Cache written: {OUTPUT_PATH}")


def write_digest(all_changes):
    os.makedirs(os.path.dirname(DIGEST_PATH) or ".", exist_ok=True)
    with open(DIGEST_PATH, "w") as f:
        json.dump({"generated": datetime.utcnow().isoformat(), "changes": all_changes}, f, indent=2)
    print(f"  Digest written: {DIGEST_PATH} ({len(all_changes)} change(s))")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--disease", help="Run for a single disease ID only")
    args = parser.parse_args()

    conn = sqlite3.connect(DB_PATH)
    init_db(conn)

    to_run = {args.disease: DISEASE_QUERIES[args.disease]} if args.disease and args.disease in DISEASE_QUERIES else DISEASE_QUERIES

    all_changes = []
    for disease_id, queries in to_run.items():
        print(f"Processing: {disease_id}")
        studies, _ = fetch_all_for_disease(disease_id, queries)
        print(f"  {len(studies)} studies found")
        changes = store_and_diff(conn, studies, disease_id)
        all_changes.extend(changes)

    write_cache(conn)
    write_digest(all_changes)
    conn.close()
    print(f"Done. {len(all_changes)} total change(s) this run.")


if __name__ == "__main__":
    main()
