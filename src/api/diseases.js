// src/api/diseases.js
// Curated disease registry for TrialNavigator.
// Each entry defines search terms for ClinicalTrials.gov, display metadata,
// and optional advocacy organization links.
// Add new diseases by appending entries. Keys are internal IDs.

export const DISEASE_REGISTRY = {
  // CACNA1A Foundation network
  "cacna1a": {
    label: "CACNA1A-Related Disorders",
    shortLabel: "CACNA1A",
    queries: ["CACNA1A", "familial hemiplegic migraine", "episodic ataxia type 2", "spinocerebellar ataxia type 6", "FHM1"],
    description: "Disorders caused by variants in the CACNA1A gene, including familial hemiplegic migraine type 1 (FHM1), episodic ataxia type 2 (EA2), and spinocerebellar ataxia type 6 (SCA6).",
    org: "CACNA1A Foundation",
    orgUrl: "https://cacna1a.org",
    area: "Neurology",
    featured: "NCT07221292",
    featuredLabel: "Phase III levacetylleucine trial (IntraBio) — enrolling September 2026",
  },

  // Buffalo Initiative pipeline conditions
  "angelman": {
    label: "Angelman Syndrome",
    shortLabel: "Angelman",
    queries: ["Angelman syndrome", "UBE3A"],
    description: "A rare neurogenetic disorder caused by loss of function of the maternal copy of UBE3A, resulting in intellectual disability, seizures, and movement difficulties.",
    org: "Foundation for Angelman Syndrome Therapeutics (FAST)",
    orgUrl: "https://cureangelman.org",
    area: "Neurology",
  },
  "ctnnb1": {
    label: "CTNNB1 Syndrome",
    shortLabel: "CTNNB1",
    queries: ["CTNNB1 syndrome", "CTNNB1"],
    description: "A rare neurodevelopmental disorder caused by variants in the CTNNB1 gene, characterized by intellectual disability, motor difficulties, and visual impairment.",
    org: "CTNNB1 Connect & Cure",
    orgUrl: "https://ctnnb1.org",
    area: "Neurology",
  },
  "cask": {
    label: "CASK Gene Disorders",
    shortLabel: "CASK",
    queries: ["CASK gene disorder", "CASK mutation"],
    description: "Rare neurodevelopmental disorders caused by variants in the CASK gene, presenting with intellectual disability, microcephaly, and cerebellar hypoplasia.",
    org: "Cure CASK",
    orgUrl: "https://curecask.org",
    area: "Neurology",
  },
  "foxg1": {
    label: "FOXG1 Syndrome",
    shortLabel: "FOXG1",
    queries: ["FOXG1 syndrome", "FOXG1"],
    description: "A severe neurodevelopmental disorder caused by variants in the FOXG1 gene, with features overlapping Rett syndrome including intellectual disability and stereotypic movements.",
    org: "FOXG1 Research Foundation",
    orgUrl: "https://foxg1research.org",
    area: "Neurology",
  },
  "stxbp1": {
    label: "STXBP1-Related Disorders",
    shortLabel: "STXBP1",
    queries: ["STXBP1", "Ohtahara syndrome STXBP1"],
    description: "Disorders caused by variants in STXBP1, typically presenting as early-onset epileptic encephalopathy with developmental delay.",
    org: "STXBP1 Foundation",
    orgUrl: "https://stxbp1foundation.org",
    area: "Neurology",
  },
  "kcnq2": {
    label: "KCNQ2 Epilepsy",
    shortLabel: "KCNQ2",
    queries: ["KCNQ2 epilepsy", "KCNQ2"],
    description: "A rare epileptic encephalopathy caused by variants in KCNQ2 encoding the Kv7.2 potassium channel subunit.",
    org: "KCNQ2 Cure Alliance",
    orgUrl: "https://kcnq2.org",
    area: "Neurology",
  },
  "cdkl5": {
    label: "CDKL5 Deficiency Disorder",
    shortLabel: "CDKL5",
    queries: ["CDKL5 deficiency", "CDKL5"],
    description: "A rare X-linked neurodevelopmental disorder caused by variants in CDKL5, resulting in early-onset seizures and severe intellectual disability.",
    org: "Loulou Foundation",
    orgUrl: "https://louloufoundation.org",
    area: "Neurology",
  },
  "kif1a": {
    label: "KIF1A-Associated Neurological Disorder",
    shortLabel: "KIF1A",
    queries: ["KIF1A disorder", "KIF1A associated neurological disorder", "KAND"],
    description: "A rare progressive neurological disorder caused by variants in KIF1A, affecting axonal transport and presenting with ataxia, spasticity, and intellectual disability.",
    org: "KIF1A.ORG",
    orgUrl: "https://kif1a.org",
    area: "Neurology",
  },
  "dravet": {
    label: "Dravet Syndrome",
    shortLabel: "Dravet",
    queries: ["Dravet syndrome", "SCN1A epilepsy"],
    description: "A severe, lifelong form of epilepsy beginning in the first year of life, caused predominantly by variants in SCN1A.",
    org: "Dravet Syndrome Foundation",
    orgUrl: "https://dravetfoundation.org",
    area: "Neurology",
  },
  "mowat_wilson": {
    label: "Mowat-Wilson Syndrome",
    shortLabel: "Mowat-Wilson",
    queries: ["Mowat-Wilson syndrome", "ZEB2 deletion"],
    description: "A rare genetic condition caused by ZEB2 gene variants, characterized by intellectual disability, distinctive facial features, and Hirschsprung disease in some cases.",
    org: "OURSFoundation",
    orgUrl: "https://oursnetwork.org",
    area: "Neurology",
  },
  "gaba_a": {
    label: "GABA-A Receptor Disorders",
    shortLabel: "GABA-A",
    queries: ["GABA-A receptor disorder", "GABRA1", "GABRB3", "GABRG2"],
    description: "Genetic epilepsies caused by variants in GABA-A receptor subunit genes including GABRA1, GABRB3, and GABRG2.",
    org: "CURE GABA-A Variants",
    orgUrl: "https://curegabaa.org",
    area: "Neurology",
  },
  "glut1": {
    label: "GLUT1 Deficiency Syndrome",
    shortLabel: "GLUT1",
    queries: ["GLUT1 deficiency", "glucose transporter type 1 deficiency"],
    description: "A metabolic disorder caused by variants in SLC2A1, impairing glucose transport across the blood-brain barrier, resulting in epilepsy, movement disorders, and cognitive impairment.",
    org: "GLUT1 Deficiency Foundation",
    orgUrl: "https://g1dfoundation.org",
    area: "Metabolic",
  },
  "lgmd": {
    label: "Limb Girdle Muscular Dystrophy",
    shortLabel: "LGMD",
    queries: ["limb girdle muscular dystrophy", "LGMD"],
    description: "A group of inherited muscle diseases affecting the hip and shoulder muscles, with multiple genetic subtypes including LGMDR1 and LGMDR5.",
    org: "Coalition to Cure Calpain 3",
    orgUrl: "https://curecalpain3.org",
    area: "Neuromuscular",
  },
  "syngap1": {
    label: "SYNGAP1-Related Disorders",
    shortLabel: "SYNGAP1",
    queries: ["SYNGAP1", "SYNGAP1 related intellectual disability"],
    description: "A rare neurodevelopmental disorder caused by variants in SYNGAP1, a key regulator of synaptic plasticity, presenting with intellectual disability, autism, and epilepsy.",
    org: "CURE SYNGAP1",
    orgUrl: "https://curesyngap1.org",
    area: "Neurology",
  },
  "dup15q": {
    label: "Dup15q Syndrome",
    shortLabel: "Dup15q",
    queries: ["Dup15q syndrome", "chromosome 15q duplication"],
    description: "A chromosome disorder caused by duplications of the 15q11.2-q13.1 region, presenting with intellectual disability, autism, and epilepsy.",
    org: "Dup15q Alliance",
    orgUrl: "https://dup15q.org",
    area: "Neurology",
  },
  "grin": {
    label: "GRIN-Related Neurodevelopmental Disorders",
    shortLabel: "GRIN",
    queries: ["GRIN disorder", "GRIN2A", "GRIN2B", "NMDA receptor disorder"],
    description: "Rare neurodevelopmental disorders caused by variants in GRIN genes encoding NMDA receptor subunits, presenting with epilepsy, intellectual disability, and autism.",
    org: "CureGRIN Foundation",
    orgUrl: "https://curegrin.org",
    area: "Neurology",
  },
  "mef2c": {
    label: "MEF2C Haploinsufficiency Syndrome",
    shortLabel: "MEF2C",
    queries: ["MEF2C haploinsufficiency", "MEF2C syndrome"],
    description: "A rare neurodevelopmental disorder caused by MEF2C haploinsufficiency, presenting with severe intellectual disability, absence of speech, and stereotypic movements.",
    org: "MEF2C Family Foundation",
    orgUrl: "https://mef2cfamilyfoundation.org",
    area: "Neurology",
  },
  "kcnh1": {
    label: "KCNH1-Related Disorders",
    shortLabel: "KCNH1",
    queries: ["KCNH1 disorder", "Temple-Baraitser syndrome", "Zimmermann-Laband syndrome"],
    description: "Rare disorders caused by gain-of-function variants in KCNH1, associated with Temple-Baraitser and Zimmermann-Laband syndromes featuring intellectual disability and epilepsy.",
    org: "Cure KCNH1 Foundation",
    orgUrl: "https://curekcnh1.org",
    area: "Neurology",
  },
  "inad": {
    label: "Infantile Neuroaxonal Dystrophy",
    shortLabel: "INAD",
    queries: ["infantile neuroaxonal dystrophy", "INAD", "PLA2G6"],
    description: "A rare progressive neurological disorder caused by PLA2G6 gene variants, presenting in infancy with motor regression and cerebellar atrophy.",
    org: "INADcure Foundation",
    orgUrl: "https://inadcure.org",
    area: "Neurology",
  },
  "setbp1": {
    label: "SETBP1 Haploinsufficiency Disorder",
    shortLabel: "SETBP1",
    queries: ["SETBP1 haploinsufficiency", "SETBP1 disorder"],
    description: "A rare neurodevelopmental disorder caused by haploinsufficiency of SETBP1, presenting with intellectual disability, speech delay, and behavioral features.",
    org: "SETBP1 Society",
    orgUrl: "https://setbp1.org",
    area: "Neurology",
  },
  "koolen": {
    label: "Koolen-de Vries Syndrome",
    shortLabel: "Koolen-de Vries",
    queries: ["Koolen-de Vries syndrome", "KANSL1"],
    description: "A rare neurodevelopmental syndrome caused by KANSL1 variants or 17q21.31 microdeletion, characterized by intellectual disability, friendly behavior, and cardiac anomalies.",
    org: "KDVS Foundation",
    orgUrl: "https://kdvsfoundation.org",
    area: "Neurology",
  },
  "foxg1_rett": {
    label: "FOXG1 Syndrome / Congenital Rett Variant",
    shortLabel: "FOXG1/Rett",
    queries: ["FOXG1 syndrome", "congenital Rett variant", "FOXG1"],
    description: "A severe neurodevelopmental disorder with features of congenital Rett syndrome caused by FOXG1 variants.",
    org: "FOXG1 Research Foundation",
    orgUrl: "https://foxg1research.org",
    area: "Neurology",
  },
  "slc13a5": {
    label: "SLC13A5 Epilepsy",
    shortLabel: "SLC13A5",
    queries: ["SLC13A5 epilepsy", "citrate transporter deficiency"],
    description: "A rare metabolic epilepsy caused by variants in SLC13A5, impairing citrate transport, resulting in neonatal seizures and developmental delay.",
    org: "TESS Research Foundation",
    orgUrl: "https://tessfoundation.org",
    area: "Metabolic",
  },

  // Broader rare neurological conditions
  "ahc": {
    label: "Alternating Hemiplegia of Childhood",
    shortLabel: "AHC",
    queries: ["alternating hemiplegia of childhood", "ATP1A3"],
    description: "A rare neurological disorder caused by ATP1A3 gene variants, causing recurrent episodes of hemiplegia, abnormal eye movements, and progressive neurological dysfunction.",
    org: "RARE Hope",
    orgUrl: "https://rarehope.com",
    area: "Neurology",
  },
  "nars1": {
    label: "NARS1-Related Disorder",
    shortLabel: "NARS1",
    queries: ["NARS1 disorder", "NARS1"],
    description: "A rare neurodevelopmental disorder caused by biallelic variants in NARS1, the gene encoding asparaginyl-tRNA synthetase.",
    org: "The Rory Belle Foundation",
    orgUrl: "",
    area: "Neurology",
  },
  "frrs1l": {
    label: "FRRS1L Disorder",
    shortLabel: "FRRS1L",
    queries: ["FRRS1L disorder", "FRRS1L"],
    description: "A rare neurodevelopmental disorder caused by biallelic variants in FRRS1L, a regulator of AMPA receptor trafficking.",
    org: "Finding Hope for Frizzle",
    orgUrl: "",
    area: "Neurology",
  },
};

// Returns all diseases as a sorted array
export function getAllDiseases() {
  return Object.entries(DISEASE_REGISTRY)
    .map(([id, data]) => ({ id, ...data }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

// Returns diseases filtered by therapeutic area
export function getDiseasesByArea(area) {
  return getAllDiseases().filter(d => d.area === area);
}

// Returns a single disease config by ID
export function getDisease(id) {
  const data = DISEASE_REGISTRY[id];
  if (!data) return null;
  return { id, ...data };
}
