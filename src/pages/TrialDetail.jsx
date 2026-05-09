import React, { useState, useEffect, useRef } from "react";
import { fetchStudyById, parseEligibilityCriteria } from "../api/clinicaltrials";
import { getDisease } from "../api/diseases";
import { geocodeZip, sortByDistance, haversineDistance, driveLabel } from "../utils/geo";

export default function TrialDetail({ nctId, disease, go }) {
  const [trial, setTrial]       = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [zip, setZip]           = useState("");
  const [userLoc, setUserLoc]   = useState(null);
  const [sites, setSites]       = useState([]);
  const [showAll, setShowAll]   = useState(false);
  const mapRef = useRef(null);
  const mapObj = useRef(null);

  const diseaseConfig = disease ? getDisease(disease) : null;

  useEffect(() => {
    if (!nctId) return;
    async function load() {
      try {
        const data = await fetchStudyById(nctId);
        setTrial(data);
        setSites(data.locations);
      } catch {
        setError(`Could not load trial ${nctId}.`);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [nctId]);

  // Initialize Leaflet map after trial loads
  useEffect(() => {
    if (!trial || !mapRef.current) return;

    // Wait for Leaflet CDN to load
    let attempts = 0;
    const init = setInterval(() => {
      attempts++;
      if (typeof window.L !== "undefined") {
        clearInterval(init);
        buildMap();
      }
      if (attempts > 20) clearInterval(init);
    }, 150);

    function buildMap() {
      const L = window.L;
      if (!mapObj.current) {
        mapObj.current = L.map(mapRef.current, { center: [39.5, -98.35], zoom: 3 });
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
        }).addTo(mapObj.current);
      }
      refreshMarkers();
    }

    return () => clearInterval(init);
  }, [trial]);

  // Re-render markers when user location changes
  useEffect(() => {
    if (!mapObj.current || !trial) return;
    refreshMarkers();
  }, [userLoc]);

  function refreshMarkers() {
    if (!mapObj.current || typeof window.L === "undefined") return;
    const L = window.L;
    const map = mapObj.current;

    map.eachLayer(l => {
      if (l instanceof L.Marker || l instanceof L.Circle) map.removeLayer(l);
    });

    const locationsToUse = userLoc
        ? sortByDistance(trial.locations, userLoc.lat, userLoc.lng)
        : trial.locations;

    const validSites = locationsToUse.filter(s => s.lat && s.lng);

    validSites.forEach(s => {
      L.marker([s.lat, s.lng])
          .addTo(map)
          .bindPopup(`<b>${s.facility}</b><br/>${s.city}${s.state ? ", " + s.state : ""}, ${s.country}`);
    });

    if (userLoc) {
      L.circle([userLoc.lat, userLoc.lng], {
        color: "#00687d", fillColor: "#00687d", fillOpacity: 0.15, radius: 50000,
      }).addTo(map);
      setSites(locationsToUse);
    }

    if (validSites.length > 0) {
      const group = L.featureGroup(validSites.map(s => L.marker([s.lat, s.lng])));
      try { map.fitBounds(group.getBounds().pad(0.3)); } catch {}
    }
  }

  async function handleZipSearch() {
    if (!zip.trim()) return;
    const loc = await geocodeZip(zip);
    if (!loc) { alert("Could not find that zip code. Try a 5-digit US zip."); return; }
    setUserLoc(loc);
  }

  if (loading) return <div className="page"><div className="loading">Loading trial details...</div></div>;
  if (error)   return <div className="page"><button className="btn-back" onClick={() => go("trials", { disease })}>← Back</button><div className="error-msg" style={{ marginTop: "1rem" }}>{error}</div></div>;
  if (!trial)  return null;

  const { inclusion, exclusion } = parseEligibilityCriteria(trial.eligibilityCriteria);
  const showInclusion = showAll ? inclusion : inclusion.slice(0, 5);
  const showExclusion = showAll ? exclusion : exclusion.slice(0, 5);

  return (
      <div className="page">
        <button className="btn-back" onClick={() => go("trials", { disease })}>
          ← {diseaseConfig ? diseaseConfig.label : "Trials"}
        </button>

        <div style={{ marginTop: "1rem", marginBottom: "2rem" }}>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "8px" }}>
            <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--ink-3)" }}>{trial.nctId}</span>
            {trial.phase && <span className="pill pill-phase">{trial.phase}</span>}
            {trial.status && (
                <span className={`pill ${
                    trial.status === "RECRUITING" ? "pill-recruiting" :
                        trial.status === "NOT_YET_RECRUITING" ? "pill-upcoming" :
                            "pill-neutral"
                }`}>
              {trial.status.replace(/_/g, " ")}
            </span>
            )}
          </div>
          <h1 style={{ fontSize: "1.4rem", fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.3, marginBottom: "0.5rem" }}>
            {trial.title}
          </h1>
          {trial.conditions.length > 0 && (
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {trial.conditions.map((c, i) => (
                    <span key={i} style={{ fontSize: 12, background: "var(--rule-light)", color: "var(--ink-2)", padding: "2px 8px", borderRadius: 3 }}>{c}</span>
                ))}
              </div>
          )}
        </div>

        <div className="detail-section">
          <h2>Summary</h2>
          <p style={{ fontSize: 13.5, lineHeight: 1.7 }}>{trial.briefSummary}</p>
        </div>

        <div className="detail-section">
          <h2>Eligibility at a glance</h2>
          <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
            {trial.minAge && <div><div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--ink-3)", marginBottom: 3 }}>Minimum age</div><div style={{ fontWeight: 500 }}>{trial.minAge}</div></div>}
            {trial.maxAge && <div><div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--ink-3)", marginBottom: 3 }}>Maximum age</div><div style={{ fontWeight: 500 }}>{trial.maxAge}</div></div>}
            {trial.sex && <div><div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--ink-3)", marginBottom: 3 }}>Sex</div><div style={{ fontWeight: 500 }}>{trial.sex}</div></div>}
          </div>

          {inclusion.length > 0 && (
              <>
                <h3>Inclusion criteria</h3>
                <ul className="criteria-list">
                  {showInclusion.map((c, i) => <li key={i}>{c}</li>)}
                </ul>
              </>
          )}
          {exclusion.length > 0 && (
              <>
                <h3>Exclusion criteria</h3>
                <ul className="criteria-list">
                  {showExclusion.map((c, i) => <li key={i}>{c}</li>)}
                </ul>
              </>
          )}
          {(inclusion.length > 5 || exclusion.length > 5) && (
              <button className="btn-link" style={{ marginTop: "0.75rem" }} onClick={() => setShowAll(v => !v)}>
                {showAll ? "Show fewer criteria" : `Show all ${inclusion.length + exclusion.length} criteria`}
              </button>
          )}

          <div className="callout" style={{ marginTop: "1rem" }}>
            Unsure whether you qualify? Contact the trial coordinator directly rather than self-screening out.
            {trial.locations?.[0]?.contacts?.[0]?.email && (
                <> Coordinator: <a href={`mailto:${trial.locations[0].contacts[0].email}`}>{trial.locations[0].contacts[0].email}</a></>
            )}
          </div>
        </div>

        <div className="detail-section">
          <h2>Trial sites</h2>
          <div className="zip-row">
            <input
                className="zip-input"
                placeholder="Enter zip code to sort by distance"
                value={zip}
                onChange={e => setZip(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleZipSearch()}
            />
            <button className="btn btn-ghost" onClick={handleZipSearch}>Find nearest</button>
          </div>
          <div id="leaflet-map" ref={mapRef} />
          <div className="site-list">
            {sites.slice(0, 12).map((s, i) => (
                <div key={i} className="site-item">
                  <span className="site-name">{s.facility || "Site"}</span>
                  <span style={{ color: "var(--ink-3)", fontSize: 12 }}>{s.city}{s.state ? ", " + s.state : ""}{s.country ? ", " + s.country : ""}</span>
                  {userLoc && s.lat && s.lng && (
                      <span className="site-dist">{driveLabel(haversineDistance(userLoc.lat, userLoc.lng, s.lat, s.lng))}</span>
                  )}
                  {s.contacts?.[0]?.email && (
                      <a href={`mailto:${s.contacts[0].email}`} style={{ fontSize: 12 }}>{s.contacts[0].email}</a>
                  )}
                </div>
            ))}
            {sites.length === 0 && <div style={{ fontSize: 13, color: "var(--ink-3)" }}>No site coordinates available. Check the trial record on ClinicalTrials.gov.</div>}
          </div>
        </div>
      </div>
  );
}