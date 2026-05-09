// src/api/diseases.js
// Disease registry. Queries cast wide nets: gene names, drug names, umbrella terms.
// Many ultra-rare diseases have no interventional trials yet — that is the real landscape.
// trialNote is shown to users when results are sparse, explaining why.

export const DISEASE_REGISTRY = {

  "cacna1a": {
    label: "CACNA1A-Related Disorders",
    shortLabel: "CACNA1A",
    queries: ["CACNA1A","familial hemiplegic migraine","episodic ataxia type 2",
      "spinocerebellar ataxia type 6","FHM1","Cav2.1"],
    description: "Disorders caused by CACNA1A gene variants including FHM1, EA2, and SCA6.",
    org: "CACNA1A Foundation", orgUrl: "https://cacna1a.org", area: "Neurology",
    featured: "NCT07221292",
    featuredLabel: "Phase III levacetylleucine (IntraBio) — enrolling September 2026",
    trialNote: null,
  },

  "angelman": {
    label: "Angelman Syndrome",
    shortLabel: "Angelman",
    queries: ["Angelman syndrome","UBE3A","GTX-102","MVX-220",
      "topoisomerase inhibitor Angelman","antisense UBE3A"],
    description: "A rare neurogenetic disorder caused by loss of maternal UBE3A, presenting with intellectual disability, seizures, and absent speech.",
    org: "Foundation for Angelman Syndrome Therapeutics (FAST)",
    orgUrl: "https://cureangelman.org", area: "Neurology", trialNote: null,
  },

  "stxbp1": {
    label: "STXBP1-Related Disorders",
    shortLabel: "STXBP1",
    queries: ["STXBP1","bexicaserin","LP352","NCT06719141",
      "developmental epileptic encephalopathy STXBP1","Ohtahara syndrome"],
    description: "Disorders caused by STXBP1 variants presenting as early-onset epileptic encephalopathy. Bexicaserin is in Phase III (NCT06719141).",
    org: "STXBP1 Foundation", orgUrl: "https://stxbp1disorders.org",
    area: "Neurology", trialNote: null,
  },

  "kif1a": {
    label: "KIF1A-Associated Neurological Disorder",
    shortLabel: "KIF1A / KAND",
    queries: ["KIF1A","KAND","KIF1A associated neurological disorder",
      "kinesin motor protein neurology","KOALA KIF1A"],
    description: "A rare progressive neurological disorder caused by KIF1A variants, affecting axonal transport. No interventional treatment trials exist yet as of 2025.",
    org: "KIF1A.ORG", orgUrl: "https://kif1a.org", area: "Neurology",
    trialNote: "No interventional treatment trials exist yet for KAND as of 2025. The KOALA and ASCEND studies are natural history studies — critical preparation steps for future treatment trials. Results below include observational studies.",
  },

  "foxg1": {
    label: "FOXG1 Syndrome",
    shortLabel: "FOXG1",
    queries: ["FOXG1 syndrome","FOXG1","FRF-001","NCT07293546","congenital Rett variant"],
    description: "A severe neurodevelopmental disorder caused by FOXG1 variants. FRF-001 gene therapy entered Phase I in 2026.",
    org: "FOXG1 Research Foundation", orgUrl: "https://foxg1research.org",
    area: "Neurology", trialNote: null,
  },

  "ctnnb1": {
    label: "CTNNB1 Syndrome",
    shortLabel: "CTNNB1",
    queries: ["CTNNB1 syndrome","CTNNB1","beta-catenin intellectual disability",
      "GSK3 inhibitor CTNNB1"],
    description: "A rare neurodevelopmental disorder caused by CTNNB1 variants.",
    org: "CTNNB1 Connect & Cure", orgUrl: "https://ctnnb1.org", area: "Neurology",
    trialNote: "No interventional trials are currently active for CTNNB1 syndrome. Results may include umbrella studies.",
  },

  "cask": {
    label: "CASK Gene Disorders",
    shortLabel: "CASK",
    queries: ["CASK gene disorder","CASK mutation","MICPCH syndrome",
      "microcephaly pontine cerebellar hypoplasia CASK"],
    description: "Rare neurodevelopmental disorders caused by CASK variants, presenting with intellectual disability and cerebellar hypoplasia.",
    org: "Cure CASK", orgUrl: "https://curecask.org", area: "Neurology",
    trialNote: "CASK disorders have very limited specific trial activity. Results may include umbrella studies accepting rare genetic neurodevelopmental disorders.",
  },

  "kcnq2": {
    label: "KCNQ2 Epilepsy",
    shortLabel: "KCNQ2",
    queries: ["KCNQ2 epilepsy","KCNQ2","KCNQ2 encephalopathy",
      "ezogabine KCNQ2","retigabine neonatal epilepsy",
      "potassium channel activator neonatal seizures"],
    description: "A rare epileptic encephalopathy caused by KCNQ2 variants, typically presenting in the neonatal period.",
    org: "KCNQ2 Cure Alliance", orgUrl: "https://kcnq2.org",
    area: "Neurology", trialNote: null,
  },

  "cdkl5": {
    label: "CDKL5 Deficiency Disorder",
    shortLabel: "CDKL5",
    queries: ["CDKL5 deficiency","CDKL5","CDD","ganaxolone CDKL5",
      "CDKL5 gene therapy"],
    description: "A rare X-linked neurodevelopmental disorder caused by CDKL5 variants.",
    org: "Loulou Foundation", orgUrl: "https://louloufoundation.org",
    area: "Neurology", trialNote: null,
  },

  "dravet": {
    label: "Dravet Syndrome",
    shortLabel: "Dravet",
    queries: ["Dravet syndrome","SCN1A epilepsy","fenfluramine Dravet",
      "cannabidiol Dravet","sodium channel epilepsy SCN1A"],
    description: "A severe, lifelong epilepsy predominantly caused by SCN1A gene variants.",
    org: "Dravet Syndrome Foundation", orgUrl: "https://dravetfoundation.org",
    area: "Neurology", trialNote: null,
  },

  "dup15q": {
    label: "Dup15q Syndrome",
    shortLabel: "Dup15q",
    queries: ["Dup15q syndrome","chromosome 15q duplication","isodicentric chromosome 15",
      "idic15","15q11-q13 duplication","UBE3A duplication"],
    description: "A chromosome disorder caused by duplications of the 15q11.2-q13.1 region.",
    org: "Dup15q Alliance", orgUrl: "https://dup15q.org", area: "Neurology",
    trialNote: "Dup15q has limited specific trial activity. Most completed studies reflect observational work.",
  },

  "gaba_a": {
    label: "GABA-A Receptor Disorders",
    shortLabel: "GABA-A",
    queries: ["GABA-A receptor disorder","GABRA1","GABRB3","GABRG2",
      "allopregnanolone GABA-A","brexanolone GABA epilepsy",
      "developmental epileptic encephalopathy GABA"],
    description: "Genetic epilepsies caused by GABA-A receptor subunit gene variants.",
    org: "CURE GABA-A Variants", orgUrl: "https://curegabaa.org",
    area: "Neurology",
    trialNote: "Most allopregnanolone trials are completed. New DEE umbrella trials may include GABA-A patients.",
  },

  "glut1": {
    label: "GLUT1 Deficiency Syndrome",
    shortLabel: "GLUT1",
    queries: ["GLUT1 deficiency","glucose transporter type 1 deficiency",
      "SLC2A1 deficiency","De Vivo disease","fucose GLUT1",
      "diazoxide GLUT1"],
    description: "A metabolic disorder caused by SLC2A1 variants, impairing glucose transport to the brain.",
    org: "GLUT1 Deficiency Foundation", orgUrl: "https://g1dfoundation.org",
    area: "Metabolic",
    trialNote: "The 3 currently active studies represent the realistic current trial landscape for GLUT1 DS.",
  },

  "lgmd": {
    label: "Limb Girdle Muscular Dystrophy",
    shortLabel: "LGMD",
    queries: ["limb girdle muscular dystrophy","LGMD R1","LGMD R5",
      "calpain 3 gene therapy","CAPN3","SGCG gene therapy"],
    description: "A group of inherited muscle diseases affecting hip and shoulder muscles.",
    org: "Coalition to Cure Calpain 3", orgUrl: "https://curecalpain3.org",
    area: "Neuromuscular", trialNote: null,
  },

  "syngap1": {
    label: "SYNGAP1-Related Disorders",
    shortLabel: "SYNGAP1",
    queries: ["SYNGAP1","SynGAP intellectual disability","SYNGAP1 epilepsy",
      "mental retardation autosomal dominant SYNGAP"],
    description: "A rare neurodevelopmental disorder caused by SYNGAP1 variants.",
    org: "CURE SYNGAP1", orgUrl: "https://curesyngap1.org",
    area: "Neurology",
    trialNote: "SYNGAP1 trial activity is growing but still limited. Natural history studies are actively enrolling.",
  },

  "mef2c": {
    label: "MEF2C Haploinsufficiency Syndrome",
    shortLabel: "MEF2C",
    queries: ["MEF2C haploinsufficiency","MEF2C syndrome",
      "5q14.3 deletion syndrome","MEF2C intellectual disability"],
    description: "A rare neurodevelopmental disorder caused by MEF2C haploinsufficiency.",
    org: "MEF2C Family Foundation", orgUrl: "https://mef2cfamilyfoundation.org",
    area: "Neurology", trialNote: null,
  },

  "kcnh1": {
    label: "KCNH1-Related Disorders",
    shortLabel: "KCNH1",
    queries: ["KCNH1","Temple-Baraitser syndrome","Zimmermann-Laband syndrome",
      "EAG1 channelopathy potassium channel epilepsy"],
    description: "Rare disorders caused by KCNH1 gain-of-function variants including Temple-Baraitser and Zimmermann-Laband syndromes.",
    org: "Cure KCNH1 Foundation", orgUrl: "https://curekcnh1.org",
    area: "Neurology",
    trialNote: "No interventional trials exist for KCNH1-related disorders as of 2025. The patient community is in early natural history and drug discovery stages.",
  },

  "inad": {
    label: "Infantile Neuroaxonal Dystrophy",
    shortLabel: "INAD / PLA2G6",
    queries: ["infantile neuroaxonal dystrophy","INAD","PLA2G6",
      "neurodegeneration brain iron accumulation PLA2G6","PLAN"],
    description: "A rare progressive neurological disorder caused by PLA2G6 variants, presenting in infancy.",
    org: "INADcure Foundation", orgUrl: "https://inadcure.org",
    area: "Neurology", trialNote: null,
  },

  "setbp1": {
    label: "SETBP1 Haploinsufficiency Disorder",
    shortLabel: "SETBP1",
    queries: ["SETBP1 haploinsufficiency","SETBP1 disorder",
      "SETBP1 intellectual disability"],
    description: "A rare neurodevelopmental disorder caused by SETBP1 haploinsufficiency.",
    org: "SETBP1 Society", orgUrl: "https://setbp1.org",
    area: "Neurology",
    trialNote: "SETBP1 disorder trial activity is very limited. Results include natural history and umbrella studies.",
  },

  "koolen": {
    label: "Koolen-de Vries Syndrome",
    shortLabel: "Koolen-de Vries",
    queries: ["Koolen-de Vries syndrome","KANSL1","17q21.31 microdeletion",
      "KANSL1 haploinsufficiency"],
    description: "A rare neurodevelopmental syndrome caused by KANSL1 variants or 17q21.31 microdeletion.",
    org: "KDVS Foundation", orgUrl: "https://kdvsfoundation.org",
    area: "Neurology",
    trialNote: "Few condition-specific trials exist. Results include umbrella studies.",
  },

  "slc13a5": {
    label: "SLC13A5 Epilepsy",
    shortLabel: "SLC13A5",
    queries: ["SLC13A5 epilepsy","citrate transporter deficiency",
      "SLC13A5 neonatal epilepsy","TESS SLC13A5 citrate"],
    description: "A rare metabolic epilepsy caused by SLC13A5 variants affecting citrate transport.",
    org: "TESS Research Foundation", orgUrl: "https://tessfoundation.org",
    area: "Metabolic", trialNote: null,
  },

  "mowat_wilson": {
    label: "Mowat-Wilson Syndrome",
    shortLabel: "Mowat-Wilson",
    queries: ["Mowat-Wilson syndrome","ZEB2 deletion","ZEB2 neurodevelopmental"],
    description: "A rare genetic condition caused by ZEB2 variants with intellectual disability and Hirschsprung disease.",
    org: "OURSFoundation", orgUrl: "https://oursnetwork.org",
    area: "Neurology",
    trialNote: "Mowat-Wilson trial activity is very limited. The opening-soon study is the current primary option.",
  },

  "nars1": {
    label: "NARS1-Related Disorder",
    shortLabel: "NARS1",
    queries: ["NARS1 disorder","NARS1 asparagine","asparaginyl-tRNA synthetase",
      "asparagine supplementation encephalopathy"],
    description: "A rare neurodevelopmental disorder caused by biallelic NARS1 variants. An asparagine supplementation trial (Phase III) is in the Buffalo Initiative network.",
    org: "The Rory Belle Foundation", orgUrl: "", area: "Neurology",
    trialNote: "The asparagine rescue Phase III trial is progressing through the Buffalo Initiative network. Check results for current status.",
  },

  "frrs1l": {
    label: "FRRS1L Disorder",
    shortLabel: "FRRS1L",
    queries: ["FRRS1L disorder","FRRS1L","AMPA receptor neurodevelopmental",
      "ferric chelate reductase neurological"],
    description: "A rare neurodevelopmental disorder caused by biallelic FRRS1L variants affecting AMPA receptor trafficking. Fewer than 50 patients reported worldwide.",
    org: "Finding Hope for Frizzle", orgUrl: "", area: "Neurology",
    trialNote: "No trials currently exist for FRRS1L disorder. This is an extremely rare condition in very early research stages.",
  },

  "ahc": {
    label: "Alternating Hemiplegia of Childhood",
    shortLabel: "AHC",
    queries: ["alternating hemiplegia of childhood","ATP1A3","AHC ATP1A3",
      "flunarizine alternating hemiplegia","prime editing ATP1A3"],
    description: "A rare neurological disorder caused by ATP1A3 variants, causing recurrent episodes of hemiplegia.",
    org: "RARE Hope", orgUrl: "https://rarehope.com",
    area: "Neurology", trialNote: null,
  },

  "grin": {
    label: "GRIN-Related Neurodevelopmental Disorders",
    shortLabel: "GRIN",
    queries: ["GRIN disorder","GRIN2A epilepsy","GRIN2B encephalopathy",
      "radiprodil GRIN","NCT07224581","NMDA receptor neurodevelopmental"],
    description: "Rare neurodevelopmental disorders caused by GRIN gene variants. Radiprodil is in Phase III.",
    org: "CureGRIN Foundation", orgUrl: "https://curegrin.org",
    area: "Neurology", trialNote: null,
  },
};

export function getAllDiseases() {
  return Object.entries(DISEASE_REGISTRY)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => a.label.localeCompare(b.label));
}

export function getDiseasesByArea(area) {
  return getAllDiseases().filter(d => d.area === area);
}

export function getDisease(id) {
  const data = DISEASE_REGISTRY[id];
  if (!data) return null;
  return { id, ...data };
}