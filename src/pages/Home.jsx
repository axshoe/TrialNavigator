import React, { useState } from "react";
import { getAllDiseases } from "../api/diseases";

export default function Home({ go }) {
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const diseases = getAllDiseases();

  const filtered = query.length > 1
    ? diseases.filter(d =>
        d.label.toLowerCase().includes(query.toLowerCase()) ||
        d.org?.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8)
    : [];

  function selectDisease(d) {
    setQuery("");
    setShowDropdown(false);
    go("trials", { disease: d.id });
  }

  return (
    <>
      <div className="hero">
        <div className="hero-inner">
          <div className="hero-eyebrow">Open source · no account needed</div>
          <h1>Find clinical trials for rare diseases</h1>
          <p className="hero-lead">
            TrialNavigator monitors ClinicalTrials.gov across {diseases.length}+ rare disease conditions.
            Actively enrolling trials appear first. Eligibility criteria are written in plain language,
            not regulatory jargon. Trial sites are mapped by distance from your location.
          </p>

          <div className="hero-search-wrap">
            <input
              className="hero-search"
              placeholder="Search by disease name, gene, or organization..."
              value={query}
              onChange={e => { setQuery(e.target.value); setShowDropdown(true); }}
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 160)}
              aria-label="Search diseases"
            />
            {showDropdown && filtered.length > 0 && (
              <div className="disease-dropdown" role="listbox">
                {filtered.map(d => (
                  <div
                    key={d.id}
                    className="disease-option"
                    role="option"
                    onMouseDown={() => selectDisease(d)}
                  >
                    <span className="disease-option-label">{d.label}</span>
                    {d.org && <span className="disease-option-org">{d.org}</span>}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="hero-btns">
            <button className="btn btn-primary" onClick={() => go("diseases")}>Browse all diseases</button>
            <button className="btn btn-ghost" onClick={() => go("trials", { disease: "cacna1a" })}>CACNA1A trials</button>
            <button className="btn btn-muted" onClick={() => go("check")}>Check eligibility</button>
          </div>
        </div>
      </div>

      <div className="page">

        <div className="section-label">Featured trial</div>
        <div className="featured-banner">
          <div style={{ fontSize: "0.75rem", letterSpacing: "0.07em", textTransform: "uppercase", opacity: 0.8, marginBottom: "0.5rem" }}>
            Phase III · Opening September 2026 · NCT07221292
          </div>
          <h2>N-Acetyl-L-Leucine for CACNA1A Disorders (FHM1, EA2)</h2>
          <p>
            A multinational, randomized, placebo-controlled crossover trial for patients age 4 and older
            with a confirmed CACNA1A disorder including familial hemiplegic migraine type 1.
            All participants receive the active drug during one of the two 12-week periods.
            Compatible with current medications. Administered as an oral sachet dissolved in water.
          </p>
          <div className="featured-facts">
            <div><div className="featured-fact-label">Who may qualify</div><div className="featured-fact-val">Age 4+, confirmed CACNA1A diagnosis</div></div>
            <div><div className="featured-fact-label">Enrollment opens</div><div className="featured-fact-val">September 1, 2026</div></div>
            <div><div className="featured-fact-label">Trial contact</div><div className="featured-fact-val"><a href="mailto:ccfields@intrabio.com">ccfields@intrabio.com</a></div></div>
          </div>
          <button
            className="btn"
            style={{ background: "#fff", color: "var(--accent)", borderColor: "#fff" }}
            onClick={() => go("detail", { trial: "NCT07221292", disease: "cacna1a" })}
          >
            View full trial details
          </button>
        </div>

        <div className="section-label" style={{ marginTop: "2.5rem" }}>How it works</div>
        <div className="how-grid" style={{ marginBottom: "2.5rem" }}>
          {[
            ["01", "Sorted by urgency", "Opening soon and actively enrolling trials appear at the top. Completed and terminated trials sit at the bottom, greyed out, so you focus on what's actually available to you now."],
            ["02", "Plain-language eligibility", "Eligibility criteria are translated from regulatory language into plain terms. A traffic-light shows at a glance whether a trial looks like a fit: green, yellow, or red."],
            ["03", "Sites near you", "Enter your zip code to see trial sites sorted by driving distance. A map shows all sites. Contact emails are shown directly where available."],
            ["04", "Variant-aware for genetic conditions", "For conditions like CACNA1A, enter your specific variant (e.g., R192Q) to receive a phenotype-matched eligibility assessment across active trials."],
          ].map(([num, title, text]) => (
            <div key={num} className="how-cell">
              <div className="how-cell-num">{num}</div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>

        <div className="section-label">For patient organizations</div>
        <div style={{ background: "var(--surface)", border: "1px solid var(--rule)", borderRadius: "var(--radius-lg)", padding: "1.5rem 1.75rem", boxShadow: "var(--shadow-sm)" }}>
          <p style={{ fontFamily: "var(--body)", fontSize: "0.9375rem", color: "var(--ink-2)", marginBottom: "1rem", lineHeight: 1.7 }}>
            Any patient advocacy organization can embed a filtered, disease-specific view on their website with one line of HTML.
            The tool updates automatically every week with no maintenance required.
          </p>
          <div className="code-block">
            {`<iframe src="https://trialnavigator.vercel.app?embed=1&disease=cacna1a" width="100%" height="700" frameborder="0"></iframe>`}
          </div>
          <p style={{ fontFamily: "var(--body)", fontSize: "0.8125rem", color: "var(--ink-3)", marginTop: "0.75rem" }}>
            Replace <code style={{ fontFamily: "var(--mono)", fontSize: "0.8rem" }}>cacna1a</code> with any disease ID.
            Full list in the <a href="https://github.com/axshoe/trialnavigator" target="_blank" rel="noreferrer">GitHub README</a>.
          </p>
        </div>

      </div>
    </>
  );
}
