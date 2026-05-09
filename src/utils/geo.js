// src/utils/geo.js
// Haversine great-circle distance implemented from scratch.
// No Maps API required.

const R_MILES = 3958.8;

function toRad(deg) { return deg * Math.PI / 180; }

// Returns distance in miles between two lat/lng points.
export function haversineDistance(lat1, lon1, lat2, lon2) {
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R_MILES * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Rough driving-time label from straight-line distance.
export function driveLabel(miles) {
  if (miles < 10) return "< 15 min";
  if (miles < 50) return `~${Math.round(miles / 0.75)} min`;
  if (miles < 500) return `~${(miles / 60).toFixed(1)} hr`;
  return `${Math.round(miles).toLocaleString()} mi`;
}

// Sort a site array by distance from a user coordinate.
// Sites without coordinates are placed last.
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

// US Census Geocoder for zip -> lat/lng. Returns null on failure.
export async function geocodeZip(zip) {
  try {
    const url = `https://geocoding.geo.census.gov/geocoder/locations/address?zip=${zip}&benchmark=2020&format=json`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const c = data?.result?.addressMatches?.[0]?.coordinates;
    if (c) return { lat: parseFloat(c.y), lng: parseFloat(c.x) };
  } catch { /* intentional */ }
  return null;
}
