import React, { useState, useEffect } from "react";
import { getDisease, getAllDiseases } from "../api/diseases";
import { fetchTrialsForDisease } from "../api/clinicaltrials";

// Priority order for sorting: active trials first, completed/withdrawn last.
const STATUS_ORDER = {
  NOT_YET_RECRUITING:     0,
  RECRUITING:             1,
  ACTIVE_NOT_RECRUITING:  2,
  COMPLETED:              3,
  SUSPENDED:              4,
  TERMINATED:             5,
  WITHDRAWN:              6,
  UNKNOWN:                7,
};

// Human labels for families — no regulatory jargon.
const STATUS_LABEL = {
  RECRUITING:             "Enrolling now",
  NOT_YET_RECRUITING:     "Opening soon",
  ACTIVE_NOT_RECRUITING:  "Active — not enrolling",
  COMPLETED:              "Completed",
  TERMINATED:             "Terminated",
  WITHDRAWN:              "Withdrawn",
  SUSPENDED:              "Suspended",
};

const STATUS_EXPLAIN = {
  RECRUITING:             "This trial is accepting new participants.",
  NOT_YET_RECRUITING:     "This trial has not yet started enrolling but plans to open soon.",
  ACTIVE_NOT_RECRUITING:  "This trial is running but is no longer accepting new participants.",
  COMPLETED:              "This trial has finished. Results may be available on ClinicalTrials.gov.",
  TERMINATED:             "This trial ended early and is no longer active.",
  WITHDRAWN:              "This trial was withdrawn before enrolling any participants.",
};

function statusPill(s) {
  if (s === "RECRUITING")            return "pill-recruiting";
  if (s === "NOT_YET_RECRUITING")    return "pill-upcoming";
  if (s === "ACTIVE_NOT_RECRUITING") return "pill-active";
  return "pill-neutral";
}

function isDimmed(s) {
  return ["COMPLETED", "TERMINATED", "WITHDRAWN", "SUSPENDED"].includes(s);
}

export default function TrialList({ disease, go }) {
  const [trials, setTrials]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [statusFilter, setStatus] = useState("All");
  const [query, setQuery]       = useState("");
  const [diseaseId, setDiseaseId] = useState(disease || "");

  const diseaseConfig = diseaseId ? getDisease(diseaseId) : null;

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      setTrials([]);
      try {
        const queries = diseaseConfig
          ? diseaseConfig.queries
          : ["rare disease"]; // fallback if no disease selected
        const data = await fetchTrialsForDisease(queries);
        // Sort: opening soon → enrolling → active → completed/withdrawn
        const sorted = [...data].sort((a, b) => {
          const featured = diseaseConfig?.featured;
          if (a.nctId === featured) return -1;
          if (b.nctId === featured) return 1;
          return (STATUS_ORDER[a.status] ?? 7) - (STATUS_ORDER[b.status] ?? 7);
        });
        setTrials(sorted);
      } catch {
        setError("Failed to load trials. Please check your connection and try again.");
      } finally {
        setLoading(false);
      }
    }
    if (diseaseId || disease) load();
    else setLoading(false);
  }, [diseaseId]);

  const STATUS_OPTIONS = ["All", "RECRUITING", "NOT_YET_RECRUITING", "ACTIVE_NOT_RECRUITING", "COMPLETED"];

  const filtered = trials.filter(t => {
    const sMatch = statusFilter === "All" || t.status === statusFilter;
    const q = query.toLowerCase();
    const qMatch = !q || t.briefTitle.toLowerCase().includes(q) || t.nctId.toLowerCase().includes(q);
    return sMatch && qMatch;
  });

  return (
    <div className="page">
      <button className="btn-back" onClick={() => go("diseases")}>← All diseases</button>

      {diseaseConfig && (
        <>
          <h1 className="page-title" style={{ marginTop: "0.75rem" }}>{diseaseConfig.label}</h1>
          <p className="page-sub">
            {diseaseConfig.description}
            {diseaseConfig.org && (
              <> · <a href={diseaseConfig.orgUrl} target="_blank" rel="noreferrer">{diseaseConfig.org}</a></>
            )}
          </p>
        </>
      )}

      {!diseaseId && (
        <div style={{ marginBottom: "1.5rem" }}>
          <p style={{ fontSize: 13.5, color: "var(--ink-2)", marginBottom: "1rem" }}>
            Select a disease to view its trials, or{" "}
            <button className="btn-link" onClick={() => go("diseases")}>browse all diseases</button>.
          </p>
        </div>
      )}

      {diseaseConfig?.featured && trials.find(t => t.nctId === diseaseConfig.featured) && (() => {
        const t = trials.find(tr => tr.nctId === diseaseConfig.featured);
        return (
          <div className="featured-banner" style={{ marginBottom: "2rem" }}>
            <div style={{ fontSize: 11, letterSpacing: "0.07em", textTransform: "uppercase", opacity: 0.7, marginBottom: 8 }}>
              Featured · {diseaseConfig.featuredLabel}
            </div>
            <h2>{t.briefTitle}</h2>
            <p style={{ marginTop: 8 }}>{t.briefSummary?.slice(0, 200)}{t.briefSummary?.length > 200 ? "..." : ""}</p>
            <button className="btn btn-primary" style={{ marginTop: "1rem", background: "#fff", color: "var(--accent)" }}
              onClick={() => go("detail", { trial: t.nctId, disease: diseaseId })}>
              View full details
            </button>
          </div>
        );
      })()}

      <div className="trial-filters">
        <input
          className="search-input"
          placeholder="Search trials..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <select className="filter-select" value={statusFilter} onChange={e => setStatus(e.target.value)}>
          {STATUS_OPTIONS.map(s => (
            <option key={s} value={s}>{s === "All" ? "All statuses" : STATUS_LABEL[s] || s}</option>
          ))}
        </select>
        <span className="result-count">{loading ? "Loading..." : `${filtered.length} trial${filtered.length !== 1 ? "s" : ""}`}</span>
      </div>

      {error && <div className="error-msg">{error}</div>}
      {loading && <div className="loading">Loading trials from ClinicalTrials.gov...</div>}

      {!loading && !error && (
        <>
          <div className="status-legend">
            <span style={{ fontWeight: 600, color: "var(--ink-2)", fontSize: "0.8rem" }}>Status guide:</span>
            <span className="legend-item"><span className="legend-dot" style={{ background: "var(--green)" }}/> Enrolling now — accepting new participants</span>
            <span className="legend-item"><span className="legend-dot" style={{ background: "var(--amber)" }}/> Opening soon — not yet enrolling</span>
            <span className="legend-item"><span className="legend-dot" style={{ background: "var(--accent)" }}/> Active — trial running, enrollment closed</span>
            <span className="legend-item"><span className="legend-dot" style={{ background: "var(--ink-3)" }}/> Completed or terminated</span>
          </div>

          <div className="trial-list">
            {filtered.length === 0 && <div className="empty">No trials match the current filters.</div>}
            {filtered.map(t => (
              <div
                key={t.nctId}
                className={`trial-row${diseaseConfig?.featured === t.nctId ? " featured" : ""}${isDimmed(t.status) ? " dimmed" : ""}`}
                onClick={() => go("detail", { trial: t.nctId, disease: diseaseId })}
              >
                <div className="trial-row-left">
                  <div className="trial-row-title">{t.briefTitle || t.title}</div>
                  <div className="trial-row-meta">
                    <span className="nct">{t.nctId}</span>
                    {t.phase && <span>{t.phase}</span>}
                    <span>{t.locations?.length || 0} site{t.locations?.length !== 1 ? "s" : ""}</span>
                    {t.minAge && <span>Age {t.minAge}+</span>}
                    {STATUS_EXPLAIN[t.status] && (
                      <span style={{ color: "var(--ink-3)" }}>{STATUS_EXPLAIN[t.status]}</span>
                    )}
                  </div>
                </div>
                <div className="trial-row-right">
                  <span className={`pill ${statusPill(t.status)}`}>
                    {STATUS_LABEL[t.status] || t.status?.replace(/_/g, " ")}
                  </span>
                  <a
                    href={`https://clinicaltrials.gov/study/${t.nctId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="ctgov-link"
                    onClick={e => e.stopPropagation()}
                  >
                    ClinicalTrials.gov ↗
                  </a>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
