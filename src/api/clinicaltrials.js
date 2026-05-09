// src/api/clinicaltrials.js
// ClinicalTrials.gov REST API v2 client.
// https://clinicaltrials.gov/data-api/api
// No authentication required. No rate limits for reasonable use.

const BASE = "https://clinicaltrials.gov/api/v2";

// Fetch all trials for a given set of search terms, deduplicating by NCT ID.
export async function fetchTrialsForDisease(queries, pageSize = 100) {
  const seen = new Map();

  for (const term of queries) {
    const url =
      `${BASE}/studies?query.cond=${encodeURIComponent(term)}&query.term=${encodeURIComponent(term)}&pageSize=${pageSize}&format=json`;
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const data = await res.json();
      for (const study of data.studies || []) {
        const id = study?.protocolSection?.identificationModule?.nctId;
        if (id && !seen.has(id)) seen.set(id, normalizeStudy(study));
      }
    } catch {
      // network failure on individual query: skip and continue
    }
  }

  return Array.from(seen.values());
}

// Fetch one study by NCT ID.
export async function fetchStudyById(nctId) {
  const res = await fetch(`${BASE}/studies/${nctId}?format=json`);
  if (!res.ok) throw new Error(`${nctId}: ${res.status}`);
  return normalizeStudy(await res.json());
}

// Normalize raw API shape into a flat, predictable object.
function normalizeStudy(raw) {
  const ps = raw?.protocolSection ?? {};
  const id = ps.identificationModule ?? {};
  const st = ps.statusModule ?? {};
  const el = ps.eligibilityModule ?? {};
  const locs = ps.contactsLocationsModule?.locations ?? [];
  const desc = ps.descriptionModule ?? {};
  const cond = ps.conditionsModule ?? {};
  const intv = ps.interventionsModule?.interventions ?? [];
  const design = ps.designModule ?? {};

  return {
    nctId: id.nctId ?? "",
    title: id.officialTitle || id.briefTitle || "",
    briefTitle: id.briefTitle || "",
    status: st.overallStatus ?? "",
    startDate: st.startDateStruct?.date ?? "",
    completionDate: st.completionDateStruct?.date ?? "",
    phase: (design.phases ?? [])[0] ?? "",
    eligibilityCriteria: el.eligibilityCriteria ?? "",
    minAge: el.minimumAge ?? "",
    maxAge: el.maximumAge ?? "",
    sex: el.sex ?? "",
    briefSummary: desc.briefSummary ?? "",
    conditions: cond.conditions ?? [],
    interventions: intv.map(i => ({ type: i.type, name: i.name })),
    locations: locs.map(l => ({
      facility: l.facility ?? "",
      city: l.city ?? "",
      state: l.state ?? "",
      country: l.country ?? "",
      zip: l.zip ?? "",
      lat: l.geoPoint?.lat ?? null,
      lng: l.geoPoint?.lon ?? null,
      contacts: l.contacts ?? [],
    })),
  };
}

// Split eligibility criteria text into inclusion/exclusion arrays.
export function parseEligibilityCriteria(text) {
  if (!text) return { inclusion: [], exclusion: [] };

  const incMatch = text.match(/inclusion criteria[:\s]*([\s\S]*?)(?=exclusion criteria|$)/i);
  const excMatch = text.match(/exclusion criteria[:\s]*([\s\S]*?)$/i);

  const parseList = (str) =>
    (str ?? "")
      .split(/\n/)
      .map(l => l.replace(/^[\s\-*•\d.]+/, "").trim())
      .filter(l => l.length > 8);

  return {
    inclusion: parseList(incMatch?.[1]),
    exclusion: parseList(excMatch?.[1]),
  };
}
