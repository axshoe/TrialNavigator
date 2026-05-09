// src/utils/eligibility.js
// Traffic-light eligibility classification.
// GREEN = likely eligible, YELLOW = possibly/contact coordinator, RED = criterion not met, UNKNOWN = insufficient info.

export const STATUS = { GREEN: "green", YELLOW: "yellow", RED: "red", UNKNOWN: "unknown" };

// Variant-to-phenotype lookup for CACNA1A (expandable for other genes).
// Source: published FHM1/EA2 variant literature + ClinVar classifications.
const VARIANT_MAP = {
  R192Q: { phenotype: "FHM1", type: "GoF" },
  S218L: { phenotype: "FHM1", type: "GoF" },
  R583Q: { phenotype: "FHM1", type: "GoF" },
  T666M: { phenotype: "FHM1", type: "GoF" },
  T665M: { phenotype: "FHM1", type: "GoF" },
  V714A: { phenotype: "FHM1", type: "GoF" },
  K1336E: { phenotype: "FHM1", type: "GoF" },
  R1347Q: { phenotype: "FHM1", type: "GoF" },
  R1668W: { phenotype: "FHM1", type: "GoF" },
  G293R: { phenotype: "EA2", type: "LoF" },
  F1490K: { phenotype: "EA2", type: "LoF" },
};

function normalizeVariant(v) {
  return v.trim().replace(/\s/g, "").toUpperCase();
}

export function assessAge(userAge, minAge, maxAge) {
  if (!userAge) return STATUS.UNKNOWN;
  const age = parseInt(userAge, 10);
  const min = minAge ? parseInt(minAge, 10) : 0;
  const max = maxAge ? parseInt(maxAge, 10) : 999;
  return age >= min && age <= max ? STATUS.GREEN : STATUS.RED;
}

export function assessVariant(userVariant, trialConditions) {
  if (!userVariant) return STATUS.UNKNOWN;
  const key = Object.keys(VARIANT_MAP).find(k => k.toUpperCase() === normalizeVariant(userVariant));
  if (!key) return STATUS.UNKNOWN;
  const info = VARIANT_MAP[key];
  const condStr = trialConditions.join(" ").toLowerCase();
  if (info.phenotype === "FHM1" && (condStr.includes("hemiplegic") || condStr.includes("cacna1a"))) return STATUS.GREEN;
  if (info.phenotype === "EA2" && (condStr.includes("ataxia") || condStr.includes("cacna1a"))) return STATUS.GREEN;
  if (condStr.includes("cacna1a")) return STATUS.YELLOW;
  return STATUS.UNKNOWN;
}

export function assessOverall(profile, trial) {
  const reasons = [];
  const statuses = [];

  const ageS = assessAge(profile.age, trial.minAge, trial.maxAge);
  statuses.push(ageS);
  if (ageS === STATUS.RED) reasons.push(`Age ${profile.age} is outside the trial's range (${trial.minAge || "any"}–${trial.maxAge || "any"})`);

  if (profile.confirmedDiagnosis === false) {
    statuses.push(STATUS.RED);
    reasons.push("Most trials require a confirmed genetic diagnosis");
  }

  if (profile.variant) {
    const varS = assessVariant(profile.variant, trial.conditions);
    statuses.push(varS);
    if (varS === STATUS.GREEN) reasons.push(`Variant ${profile.variant} is consistent with this trial's listed conditions`);
    else if (varS === STATUS.YELLOW) reasons.push(`Variant ${profile.variant}: contact the coordinator to confirm eligibility`);
  }

  if (statuses.includes(STATUS.RED)) return { status: STATUS.RED, reasons };
  if (statuses.includes(STATUS.YELLOW) || statuses.includes(STATUS.UNKNOWN)) return { status: STATUS.YELLOW, reasons };
  return { status: STATUS.GREEN, reasons };
}

export function statusMeta(s) {
  switch (s) {
    case STATUS.GREEN:   return { label: "Likely eligible",       color: "#1a7f4b", bg: "#edfaf2" };
    case STATUS.YELLOW:  return { label: "Possibly eligible",     color: "#8a5f00", bg: "#fff8e6" };
    case STATUS.RED:     return { label: "Likely not eligible",   color: "#9e1f1f", bg: "#fff0f0" };
    default:             return { label: "Contact coordinator",   color: "#4a5568", bg: "#f7f8f9" };
  }
}
