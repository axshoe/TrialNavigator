// src/utils/geo.js
// Haversine great-circle distance implemented from scratch.
// Geocoding via OpenStreetMap Nominatim (no API key, no CORS issues).

const R_MILES = 3958.8;

function toRad(deg) { return deg * Math.PI / 180; }

export function haversineDistance(lat1, lon1, lat2, lon2) {
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R_MILES * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function driveLabel(miles) {
  if (miles < 10) return "< 15 min";
  if (miles < 50) return `~${Math.round(miles / 0.75)} min`;
  if (miles < 500) return `~${(miles / 60).toFixed(1)} hr`;
  return `${Math.round(miles).toLocaleString()} mi`;
}

export function sortByDistance(sites, userLat, userLng) {
  return sites
      .map(s => ({
        ...s,
        distanceMiles:
            s.lat && s.lng
                ? haversineDistance(userLat, userLng, s.lat, s.lng)
                : Infinity,
      }))
      .sort((a, b) => a.distanceMiles - b.distanceMiles);
}

// Geocode a US zip code using OpenStreetMap Nominatim.
// Works from the browser (no CORS restriction, no API key needed).
// Nominatim usage policy: max 1 req/sec, include a descriptive User-Agent.
export async function geocodeZip(zip) {
  const cleaned = zip.trim().replace(/\D/g, "").slice(0, 5);
  if (cleaned.length < 5) return null;

  try {
    const url =
        `https://nominatim.openstreetmap.org/search?postalcode=${cleaned}&country=US&format=json&limit=1`;
    const res = await fetch(url, {
      headers: { "User-Agent": "TrialNavigator/2.0 (thexiulab.org)" },
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data || data.length === 0) return null;
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  } catch {
    return null;
  }
}