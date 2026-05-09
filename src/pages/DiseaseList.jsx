import React, { useState } from "react";
import { getAllDiseases, getDiseasesByArea } from "../api/diseases";

const AREAS = ["All", "Neurology", "Metabolic", "Neuromuscular", "Ophthalmology", "Immunology"];

export default function DiseaseList({ go }) {
  const [area, setArea] = useState("All");
  const [query, setQuery] = useState("");

  const all = getAllDiseases();
  const filtered = all.filter(d => {
    const matchArea = area === "All" || d.area === area;
    const q = query.toLowerCase();
    const matchQ = !q || d.label.toLowerCase().includes(q) || d.org?.toLowerCase().includes(q);
    return matchArea && matchQ;
  });

  return (
    <div className="page">
      <h1 className="page-title">Disease Library</h1>
      <p className="page-sub">
        {all.length} conditions monitored across rare neurological, metabolic, and neuromuscular diseases.
        Select a disease to view active and upcoming trials.
      </p>

      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1.5rem", alignItems: "center" }}>
        <input
          className="search-input"
          placeholder="Search diseases or organizations..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <div className="area-tabs">
          {AREAS.map(a => (
            <button key={a} className={`area-tab${area === a ? " active" : ""}`} onClick={() => setArea(a)}>
              {a}
            </button>
          ))}
        </div>
      </div>

      <div className="disease-grid">
        {filtered.map(d => (
          <div key={d.id} className="disease-card" onClick={() => go("trials", { disease: d.id })}>
            <div className="disease-card-label">{d.label}</div>
            {d.org && <div className="disease-card-org">{d.org}</div>}
            <div className="disease-card-area">{d.area}</div>
          </div>
        ))}
        {filtered.length === 0 && <div className="empty" style={{ gridColumn: "1 / -1" }}>No diseases match your search.</div>}
      </div>
    </div>
  );
}
