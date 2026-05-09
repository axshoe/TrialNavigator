import React, { useState } from "react";
import Home from "./pages/Home";
import DiseaseList from "./pages/DiseaseList";
import TrialList from "./pages/TrialList";
import TrialDetail from "./pages/TrialDetail";
import EligibilityChecker from "./pages/EligibilityChecker";
import "./index.css";

// TrialNavigator supports an embed mode for patient organizations.
// Add ?embed=1&disease=cacna1a to the URL to render a frameable widget
// with no nav or footer, filtered to the specified disease.
function getUrlParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    embed: params.get("embed") === "1",
    disease: params.get("disease") || null,
  };
}

export default function App() {
  const { embed, disease: embedDisease } = getUrlParams();

  const [page, setPage]             = useState(embedDisease ? "trials" : "home");
  const [selectedDisease, setDisease] = useState(embedDisease || null);
  const [selectedTrial, setTrial]   = useState(null);

  function go(dest, opts = {}) {
    if (opts.disease !== undefined) setDisease(opts.disease);
    if (opts.trial   !== undefined) setTrial(opts.trial);
    setPage(dest);
    window.scrollTo(0, 0);
  }

  return (
    <div className={`app${embed ? " widget-mode" : ""}`}>
      {!embed && (
        <nav className="nav">
          <div className="nav-inner">
            <div className="nav-brand" onClick={() => go("home")} style={{ flexShrink: 0 }}>
              Trial<span>Navigator</span>
            </div>
            <div className="nav-links">
              <button className={`nav-btn${page === "home" ? " active" : ""}`}     onClick={() => go("home")}>Home</button>
              <button className={`nav-btn${page === "diseases" ? " active" : ""}`} onClick={() => go("diseases")}>Diseases</button>
              <button className={`nav-btn${page === "check" ? " active" : ""}`}    onClick={() => go("check")}>Check Eligibility</button>
            </div>
          </div>
        </nav>
      )}

      <main>
        {page === "home"     && <Home go={go} />}
        {page === "diseases" && <DiseaseList go={go} />}
        {page === "trials"   && <TrialList disease={selectedDisease} go={go} />}
        {page === "detail"   && <TrialDetail nctId={selectedTrial} disease={selectedDisease} go={go} />}
        {page === "check"    && <EligibilityChecker disease={selectedDisease} go={go} />}
      </main>

      {!embed && (
        <footer className="footer">
          <p>
            TrialNavigator ·{" "}
            <a href="https://github.com/axshoe/trialnavigator" target="_blank" rel="noreferrer">github.com/axshoe/trialnavigator</a>
          </p>
          <p>
            Data from{" "}
            <a href="https://clinicaltrials.gov" target="_blank" rel="noreferrer">ClinicalTrials.gov</a>.
            For informational use only. Contact trial coordinators to confirm eligibility.
          </p>
        </footer>
      )}
    </div>
  );
}
