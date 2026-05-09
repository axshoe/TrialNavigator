# TrialNavigator v2

**Rare Disease Clinical Trial Awareness and Eligibility Matching Platform**

A [Xiu Lab](https://thexiulab.org) project by Angie Xiu.  
Open source: [github.com/axshoe/trialnavigator](https://github.com/axshoe/trialnavigator)

---

## What it does

TrialNavigator monitors ClinicalTrials.gov across 30+ rare disease conditions, translates eligibility criteria into plain language, maps trial sites by distance from the patient's location using Haversine distance implemented from scratch, and provides variant-aware eligibility matching for genetic conditions. A weekly GitHub Actions cron job keeps trial data current automatically.

The tool is fully disease-agnostic and embeddable. Any patient organization can show a filtered view on their own website with a single line of HTML.

## Embed on your website

Replace `cacna1a` with any disease ID from the registry below:

```html
<iframe
  src="https://trialnavigator.vercel.app?embed=1&disease=cacna1a"
  width="100%"
  height="700"
  frameborder="0"
></iframe>
```

## Disease IDs

| ID | Disease |
|----|---------|
| `cacna1a` | CACNA1A-Related Disorders (FHM1, EA2, SCA6) |
| `angelman` | Angelman Syndrome |
| `ctnnb1` | CTNNB1 Syndrome |
| `cask` | CASK Gene Disorders |
| `foxg1` | FOXG1 Syndrome |
| `stxbp1` | STXBP1-Related Disorders |
| `kcnq2` | KCNQ2 Epilepsy |
| `cdkl5` | CDKL5 Deficiency Disorder |
| `kif1a` | KIF1A-Associated Neurological Disorder |
| `dravet` | Dravet Syndrome |
| `mowat_wilson` | Mowat-Wilson Syndrome |
| `gaba_a` | GABA-A Receptor Disorders |
| `glut1` | GLUT1 Deficiency Syndrome |
| `lgmd` | Limb Girdle Muscular Dystrophy |
| `syngap1` | SYNGAP1-Related Disorders |
| `dup15q` | Dup15q Syndrome |
| `grin` | GRIN-Related Neurodevelopmental Disorders |
| `mef2c` | MEF2C Haploinsufficiency Syndrome |
| `kcnh1` | KCNH1-Related Disorders |
| `inad` | Infantile Neuroaxonal Dystrophy |
| `setbp1` | SETBP1 Haploinsufficiency Disorder |
| `koolen` | Koolen-de Vries Syndrome |
| `slc13a5` | SLC13A5 Epilepsy |
| `ahc` | Alternating Hemiplegia of Childhood |
| `nars1` | NARS1-Related Disorder |
| `frrs1l` | FRRS1L Disorder |

## Adding a new disease

1. Add an entry to `src/api/diseases.js` with the disease `id`, `label`, `queries`, and optional `org`/`orgUrl`/`featured`.
2. Add the same `id` and its queries to `backend/updater.py` `DISEASE_QUERIES`.
3. The disease will appear in the UI and be picked up by the next weekly updater run.

## Tech stack

- React (Create React App), deployed on Vercel (free tier)
- Python backend with SQLite, running via GitHub Actions weekly cron
- Leaflet.js for maps (CDN, no API key)
- Haversine distance from scratch in `src/utils/geo.js`
- US Census Geocoder for zip code resolution (free)
- ClinicalTrials.gov REST API v2 (no authentication)

## Setup

See [SETUP.md](./SETUP.md).

## License

MIT
