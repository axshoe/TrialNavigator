import React, { useState } from "react";
import { fetchTrialsForDisease } from "../api/clinicaltrials";
import { getDisease, getAllDiseases } from "../api/diseases";
import { assessOverall, statusMeta } from "../utils/eligibility";

const STEPS = ["disease", "age", "diagnosis", "variant", "results"];

export default function EligibilityChecker({ disease, go }) {
  const [step, setStep]     = useState(disease ? 1 : 0);
  const [diseaseId, setDId] = useState(disease || "");
  const [profile, setProfile] = useState({ age: "", confirmedDiagnosis: null, variant: "" });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const diseaseConfig = diseaseId ? getDisease(diseaseId) : null;
  const allDiseases = getAllDiseases();

  function update(k, v) { setProfile(p => ({ ...p, [k]: v })); }

  async function runAssessment() {
    setLoading(true);
    try {
      const queries = diseaseConfig?.queries ?? ["rare disease"];
      const trials = await fetchTrialsForDisease(queries);
      const assessed = trials
        .filter(t => ["RECRUITING", "NOT_YET_RECRUITING"].includes(t.status))
        .map(t => ({ trial: t, ...assessOverall(profile, t) }))
        .sort((a, b) => {
          const order = { green: 0, yellow: 1, unknown: 2, red: 3 };
          return (order[a.status] ?? 2) - (order[b.status] ?? 2);
        });
      setResults(assessed);
    } finally {
      setLoading(false);
    }
  }

  const next = () => {
    if (step === STEPS.length - 2) runAssessment();
    setStep(s => s + 1);
  };
  const back = () => setStep(s => s - 1);

  const dots = STEPS.map((_, i) => (
    <div key={i} className={`step-dot${i === step ? " current" : i < step ? " done" : ""}`} />
  ));

  return (
    <div className="page">
      <h1 className="page-title">Eligibility Checker</h1>
      <p className="page-sub">
        Answer a few questions to receive a personalized eligibility assessment across active trials.
        This is informational only — contact trial coordinators to confirm eligibility.
      </p>

      <div className="step-bar">{dots}</div>

      <div className="wizard">

        {step === 0 && (
          <>
            <h2>Which disease?</h2>
            <p>Select the condition you are looking for trials on.</p>
            <select
              className="wizard-input"
              value={diseaseId}
              onChange={e => setDId(e.target.value)}
            >
              <option value="">Select a disease...</option>
              {allDiseases.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}
            </select>
            <div className="wizard-nav">
              <button className="btn btn-primary" onClick={next} disabled={!diseaseId}>Next</button>
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <h2>How old is the patient?</h2>
            <p>Age is used to check the trial's minimum and maximum age requirements.</p>
            <input
              className="wizard-input"
              type="number"
              min="0"
              max="120"
              placeholder="Age in years"
              value={profile.age}
              onChange={e => update("age", e.target.value)}
            />
            <div className="wizard-nav">
              <button className="btn btn-muted" onClick={back}>Back</button>
              <button className="btn btn-primary" onClick={next} disabled={!profile.age}>Next</button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2>Confirmed diagnosis?</h2>
            <p>Has the patient received a confirmed genetic diagnosis from a physician?</p>
            <div className="choice-group">
              {[["Yes", true], ["No", false], ["In progress", null]].map(([label, val]) => (
                <button
                  key={label}
                  className={`choice-btn${profile.confirmedDiagnosis === val ? " selected" : ""}`}
                  onClick={() => update("confirmedDiagnosis", val)}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="wizard-nav">
              <button className="btn btn-muted" onClick={back}>Back</button>
              <button className="btn btn-primary" onClick={next}>Next</button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h2>Known variant? (optional)</h2>
            <p>
              If you know the specific genetic variant, enter it here for more precise matching.
              {diseaseConfig?.id === "cacna1a" && " Common FHM1 variants: R192Q, S218L, T666M."}
            </p>
            <input
              className="wizard-input"
              placeholder="e.g., R192Q (leave blank if unknown)"
              value={profile.variant}
              onChange={e => update("variant", e.target.value)}
            />
            <div className="wizard-nav">
              <button className="btn btn-muted" onClick={back}>Back</button>
              <button className="btn btn-primary" onClick={next}>{loading ? "Assessing..." : "See results"}</button>
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <h2>Your eligibility assessment</h2>
            {loading && <div className="loading">Loading trials and running assessment...</div>}
            {!loading && results.length === 0 && (
              <p style={{ color: "var(--ink-2)", marginBottom: "1rem" }}>
                No currently recruiting trials found for this condition. Check back as new trials open.
              </p>
            )}
            {!loading && results.map(({ trial, status, reasons }) => {
              const meta = statusMeta(status);
              return (
                <div key={trial.nctId} className="result-card">
                  <div className="result-card-header">
                    <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--ink-3)" }}>{trial.nctId}</span>
                    <div
                      className="tl-wrap"
                      style={{ background: meta.bg, borderLeftColor: meta.color, color: meta.color }}
                    >
                      {meta.label}
                    </div>
                  </div>
                  <div className="result-card-title">{trial.briefTitle}</div>
                  {reasons.length > 0 && (
                    <ul className="result-reasons">{reasons.map((r, i) => <li key={i}>{r}</li>)}</ul>
                  )}
                  <button
                    className="btn-link"
                    style={{ marginTop: 8 }}
                    onClick={() => go("detail", { trial: trial.nctId, disease: diseaseId })}
                  >
                    View full trial details →
                  </button>
                </div>
              );
            })}
            <div className="disclaimer">
              This assessment is based on publicly available eligibility criteria and is not medical advice.
              Contact each trial's coordinator to confirm eligibility before making any decisions.
            </div>
            <button className="btn btn-muted" style={{ marginTop: "1rem" }} onClick={() => { setStep(0); setResults([]); }}>
              Start over
            </button>
          </>
        )}

      </div>
    </div>
  );
}
