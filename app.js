/*
  NZ Renewable Energy Suitability Explorer
  ------------------------------------------------------------
  This file is intentionally plain JavaScript for beginner-friendly editing.
  Final Member 1 suitability/candidate data and final GIR data are loaded from local files.
*/

// Data interface contract for Member 1 and Member 2.
// Member 1 final suitability areas and ranked candidate sites are now available.
// GIR renewable energy existing points remain loaded from the final GIR GeoJSON data.
const DATA_ENDPOINTS = {
  context: "data/nz_context.geojson",
  girMentions: "data/renewable_energy_mentions.geojson",
  siteSelectionCandidates: "data/site_selection_candidates.geojson",
  transmissionLines: "data/transmission_lines.geojson",
  postgisGirLocations: "data/gir_locations.geojson",
  protectedAreas: "data/protected_areas.geojson",
  roads: "data/roads.geojson",
  postgisSolarSuitability: "data/solar_suitability.geojson",
  weatherResourceSummary: "data/weather_resource_summary.geojson",
  postgisWindSuitability: "data/wind_suitability.geojson"
};

// Candidate ranking layers use the final integrated local GeoJSON ranking result.
// Simple hard-coded location search dictionary for New Zealand places used by the demo and GIR data.
const NZ_LOCATIONS = {
  auckland: { label: "Auckland", lat: -36.8509, lng: 174.7645, zoom: 10 },
  northland: { label: "Northland", lat: -35.3708, lng: 173.7460, zoom: 8 },
  kaitaia: { label: "Kaitaia", lat: -35.1149, lng: 173.2627, zoom: 11 },
  whangarei: { label: "Whangarei", lat: -35.7251, lng: 174.3237, zoom: 11 },
  waiuku: { label: "Waiuku", lat: -37.2484, lng: 174.7349, zoom: 11 },
  papakura: { label: "Papakura", lat: -37.0657, lng: 174.9439, zoom: 11 },
  karaka: { label: "Karaka", lat: -37.1018, lng: 174.9105, zoom: 12 },
  waikato: { label: "Waikato", lat: -37.7870, lng: 175.2793, zoom: 8 },
  hamilton: { label: "Hamilton", lat: -37.7870, lng: 175.2793, zoom: 11 },
  cambridge: { label: "Cambridge", lat: -37.8894, lng: 175.4703, zoom: 11 },
  taupo: { label: "Taupo", lat: -38.6857, lng: 176.0702, zoom: 11 },
  wairakei: { label: "Wairakei", lat: -38.6286, lng: 176.1015, zoom: 12 },
  taranaki: { label: "Taranaki", lat: -39.0556, lng: 174.0752, zoom: 8 },
  "new plymouth": { label: "New Plymouth", lat: -39.0556, lng: 174.0752, zoom: 11 },
  "port taranaki": { label: "Port Taranaki", lat: -39.0552, lng: 174.0335, zoom: 12 },
  wellington: { label: "Wellington", lat: -41.2865, lng: 174.7762, zoom: 11 },
  wairarapa: { label: "Wairarapa", lat: -41.0000, lng: 175.6500, zoom: 9 },
  "lower hutt": { label: "Lower Hutt", lat: -41.2120, lng: 174.9081, zoom: 11 },
  "upper hutt": { label: "Upper Hutt", lat: -41.1241, lng: 175.0708, zoom: 11 },
  porirua: { label: "Porirua", lat: -41.1355, lng: 174.8404, zoom: 11 },
  "manawatu-whanganui": { label: "Manawatu-Whanganui", lat: -39.9300, lng: 175.0500, zoom: 8 },
  "palmerston north": { label: "Palmerston North", lat: -40.3523, lng: 175.6082, zoom: 11 },
  foxton: { label: "Foxton", lat: -40.4729, lng: 175.2864, zoom: 12 },
  whanganui: { label: "Whanganui", lat: -39.9301, lng: 175.0479, zoom: 11 },
  taumarunui: { label: "Taumarunui", lat: -38.8833, lng: 175.2667, zoom: 11 },
  ashhurst: { label: "Ashhurst", lat: -40.2941, lng: 175.7546, zoom: 12 },
  bunnythorpe: { label: "Bunnythorpe", lat: -40.2838, lng: 175.6304, zoom: 12 },
  gisborne: { label: "Gisborne", lat: -38.6623, lng: 178.0176, zoom: 10 },
  canterbury: { label: "Canterbury", lat: -43.5321, lng: 172.6362, zoom: 8 },
  christchurch: { label: "Christchurch", lat: -43.5321, lng: 172.6362, zoom: 10 },
  rangiora: { label: "Rangiora", lat: -43.3034, lng: 172.5957, zoom: 11 },
  waimakariri: { label: "Waimakariri", lat: -43.3000, lng: 172.6000, zoom: 10 },
  ashburton: { label: "Ashburton", lat: -43.9056, lng: 171.7459, zoom: 11 },
  waipara: { label: "Waipara", lat: -43.0644, lng: 172.7623, zoom: 12 },
  otago: { label: "Otago", lat: -45.0312, lng: 168.6626, zoom: 8 },
  dunedin: { label: "Dunedin", lat: -45.8788, lng: 170.5028, zoom: 11 },
  queenstown: { label: "Queenstown", lat: -45.0312, lng: 168.6626, zoom: 11 },
  southland: { label: "Southland", lat: -46.4132, lng: 168.3538, zoom: 8 },
  invercargill: { label: "Invercargill", lat: -46.4132, lng: 168.3538, zoom: 11 },
  "stewart island": { label: "Stewart Island / Rakiura", lat: -46.8997, lng: 168.1200, zoom: 10 },
  rakiura: { label: "Rakiura", lat: -46.8997, lng: 168.1200, zoom: 10 },
  "white hill": { label: "White Hill", lat: -45.7150, lng: 168.4200, zoom: 11 }
};

const GIR_REGION_TERMS = [
  { region: "Auckland", terms: ["Auckland", "Waiuku", "Karaka Harbourside", "Karaka", "Papakura"] },
  { region: "Northland", terms: ["Northland", "Far North", "Kaitaia", "Whangarei", "Ruakaka"] },
  { region: "Waikato", terms: ["Waikato", "Hamilton", "Cambridge", "Taupo", "Wairakei"] },
  { region: "Taranaki", terms: ["Taranaki", "New Plymouth", "Port Taranaki"] },
  { region: "Wellington", terms: ["Wellington", "Lower Hutt", "Upper Hutt", "Porirua", "Wairarapa"] },
  { region: "Manawat\u016B-Whanganui", terms: ["Manawatu-Whanganui", "Manawatu", "Palmerston North", "Foxton", "Whanganui", "Whanganui River", "Taumarunui", "Ngapuwaiwaha Marae", "Ashhurst", "Bunnythorpe"] },
  { region: "Canterbury", terms: ["Canterbury", "Christchurch", "Rangiora", "Waimakariri", "Swannanoa", "Ashburton", "Waipara"] },
  { region: "Otago", terms: ["Otago", "Dunedin", "Queenstown"] },
  { region: "Southland", terms: ["Southland", "Stewart Island", "Rakiura", "White Hill", "Invercargill"] }
];

const energyColors = {
  Solar: "#f3b23c",
  Wind: "#2f7fbf"
};
let allGirMentions = [];
let allSolarCandidates = [];
let allWindCandidates = [];
let currentRankingType = "All";
let candidateMarkerLookup = { Solar: new Map(), Wind: new Map() };
let selectedCandidateKey = "";
let nzContextLayer;
let projectLayer;
let solarCandidateLayer;
let windCandidateLayer;
let detachedRankingLayer;
let transmissionLineFeatureCount = 0;
let postgisExportStatus = { loaded: 0, total: 6, failed: [] };
const overlayLayers = {};
const layerCheckboxes = document.querySelectorAll(".layer-toggle");
const energyFilter = document.getElementById("energyFilter");
const regionFilter = document.getElementById("regionFilter");
const searchInput = document.getElementById("locationSearch");
const searchButton = document.getElementById("searchButton");
const searchMessage = document.getElementById("searchMessage");
const localContextStatus = document.getElementById("localContextStatus");
const rankingCandidatesStatus = document.getElementById("rankingCandidatesStatus");
const evidenceLayersStatus = document.getElementById("evidenceLayersStatus");
const rankingTabs = document.querySelectorAll(".ranking-tab");
const rankingList = document.getElementById("rankingList");
const rankingNote = document.getElementById("rankingNote");
const candidateDetailsPanel = document.getElementById("candidateDetailsPanel");
const candidateDetailsTitle = document.getElementById("candidateDetailsTitle");
const candidateDetailsContent = document.getElementById("candidateDetailsContent");
const candidateDetailsClose = document.getElementById("candidateDetailsClose");

// Fixed mainland view avoids Regional Council features near 180 degrees
// stretching the initial map extent too far.
const NZ_VIEW_BOUNDS = L.latLngBounds(
  L.latLng(-47.5, 166.0),
  L.latLng(-34.0, 179.5)
);

// Start with a stable national-scale view for New Zealand.
const map = L.map("map", {
  minZoom: 4,
  zoomControl: true
});

map.setView([-41.2, 172.8], 5);

addSegmentedScaleControl();

map.createPane("rankingLeaderPane");
map.getPane("rankingLeaderPane").style.zIndex = 420;
map.getPane("rankingLeaderPane").style.pointerEvents = "none";
map.createPane("rankingLabelPane");
map.getPane("rankingLabelPane").style.zIndex = 440;
map.createPane("candidatePointPane");
map.getPane("candidatePointPane").style.zIndex = 445;

// Online basemaps are optional and depend on network tile loading.
// OpenStreetMap is optional; all project data layers are local files.
const osmBaseLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  keepBuffer: 4,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});


overlayLayers.osmBase = osmBaseLayer;

const basemapNote = document.createElement("p");
basemapNote.className = "inline-note basemap-note";
basemapNote.textContent = "OpenStreetMap and Local NZ context are shown by default. Solar and Wind Top 10 candidates are loaded from site_selection_candidates.geojson. Transmission, GIR, protected area, road, weather, solar suitability, and wind suitability layers are supporting local evidence layers.";
const layerPanel = document.querySelector('[aria-label="Layer controls"]');
if (layerPanel) {
  layerPanel.insertBefore(basemapNote, layerPanel.querySelector(".toggle-row"));
}

map.whenReady(() => {
  map.invalidateSize();
});

map.on("zoomend moveend", () => {
  renderDetachedRankingLabels("map zoom/pan");
});

// Load local GeoJSON. Serve this app with py server.py so browser fetch can read these files reliably.
// Final ranking candidates, suitability areas, evidence layers, and final GIR points are local files now.
Promise.all([
  loadGeojson(DATA_ENDPOINTS.context, true, "context"),
  loadGeojson(DATA_ENDPOINTS.girMentions, false, "GIR mentions"),
  loadGeojson(DATA_ENDPOINTS.transmissionLines, false, "transmission lines"),
  loadSiteSelectionCandidates(),
  loadPostgisExportedGeojsons()
])
  .then(([contextGeojson, girMentionsGeojson, transmissionGeojson, candidateData, postgisGeojsons]) => {
    console.log(`context feature count: ${(contextGeojson.features || []).length}`);
    console.log(`transmission line feature count: ${(transmissionGeojson.features || []).length}`);
    console.log("PostGIS exported layer load status", postgisExportStatus);
    allGirMentions = girMentionsGeojson.features || [];
    allWindCandidates = candidateData.windCandidates;
    allSolarCandidates = candidateData.solarCandidates;
    transmissionLineFeatureCount = (transmissionGeojson.features || []).length;

    logCandidateSummary();

    nzContextLayer = L.geoJSON(contextGeojson, {
      style: styleNzContext,
      onEachFeature: bindNzContextTooltip
    });
    overlayLayers.transmissionLines = L.geoJSON(transmissionGeojson, {
      style: styleTransmissionLine,
      onEachFeature: bindTransmissionLinePopup
    });
    solarCandidateLayer = L.layerGroup();
    windCandidateLayer = L.layerGroup();
    detachedRankingLayer = L.layerGroup();

    overlayLayers.context = nzContextLayer;
    overlayLayers.solarCandidates = solarCandidateLayer;
    overlayLayers.windCandidates = windCandidateLayer;
    createPostgisExportedLayers(postgisGeojsons);

    nzContextLayer.addTo(map);
    osmBaseLayer.addTo(map);
    detachedRankingLayer.addTo(map);

    updateEnergyFilterOptions();
    renderFilteredLayers();
    fitMapToNzContextBounds();
    setupLayerToggles();
    syncLayerVisibilityFromCheckboxes();
    addMapLegendControl();
    updateDataStatus();
    updateActiveLayerCard();
    console.log("initial active layers", getActiveLayerNames());
    logInitialLayerCheckboxState();
  })
  .catch((error) => {
    console.error("Could not load local GeoJSON files:", error);
    searchMessage.textContent = "Sample data could not be loaded. Start a local web server and refresh.";
  });

energyFilter.addEventListener("change", renderFilteredLayers);
regionFilter.addEventListener("change", renderFilteredLayers);
rankingTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    currentRankingType = tab.dataset.rankingType || "All";
    updateRankingTabs();
    renderRankingPanel();
    renderDetachedRankingLabels("tab switch");
    logRankingModeChange();
  });
});

if (candidateDetailsClose) {
  candidateDetailsClose.addEventListener("click", closeCandidateDetails);
}
setupDraggableCandidateDetails();
searchButton.addEventListener("click", (event) => {
  event.preventDefault();
  searchLocation();
});
searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    searchLocation();
  }
});

function updateEnergyFilterOptions() {
  const selectedValue = energyFilter.value || "All";
  const categories = new Set();

  allGirMentions.forEach((feature) => {
    categories.add(getGirEnergyType(feature.properties || {}));
  });

  allSolarCandidates.forEach((candidate) => categories.add(candidate.energy_type));
  allWindCandidates.forEach((candidate) => categories.add(candidate.energy_type));

  const orderedCategories = orderEnergyCategories(Array.from(categories));
  energyFilter.innerHTML = "";
  energyFilter.appendChild(new Option("All", "All"));
  orderedCategories.forEach((category) => {
    energyFilter.appendChild(new Option(category, category));
  });

  energyFilter.value = selectedValue === "All" || categories.has(selectedValue) ? selectedValue : "All";
  console.log("generated Energy type options", ["All", ...orderedCategories]);
}

function orderEnergyCategories(categories) {
  const preferred = ["Solar", "Wind", "Mixed", "Renewable"];
  const normalizedPreferred = new Set(preferred);
  const ordered = preferred.filter((category) => categories.includes(category));
  const otherCategories = categories
    .filter((category) => !normalizedPreferred.has(category))
    .sort((a, b) => a.localeCompare(b));

  return [...ordered, ...otherCategories];
}

function renderFilteredLayers() {
  const selectedEnergy = energyFilter.value;
  const selectedRegion = regionFilter ? regionFilter.value : "All";

  const visibleMentions = allGirMentions.filter((feature) => {
    const props = feature.properties || {};
    const mentionRegion = getGirRegion(props);
    const mentionEnergy = getGirEnergyType(props);
    const matchesEnergy = selectedEnergy === "All" || matchesGirEnergy(selectedEnergy, mentionEnergy);
    const matchesRegion = selectedRegion === "All" || mentionRegion === selectedRegion;
    return matchesEnergy && matchesRegion;
  });

  const visibleSolarCandidates = filterCandidates(allSolarCandidates, selectedEnergy, selectedRegion);
  const visibleWindCandidates = filterCandidates(allWindCandidates, selectedEnergy, selectedRegion);

  console.log("filter state", {
    selectedEnergy,
    selectedRegion,
    visibleMentions: visibleMentions.length,
    visibleSolarCandidates: visibleSolarCandidates.length,
    visibleWindCandidates: visibleWindCandidates.length
  });

  renderCandidateLayer(solarCandidateLayer, visibleSolarCandidates, "Solar");
  renderCandidateLayer(windCandidateLayer, visibleWindCandidates, "Wind");
  renderRankingPanel(visibleSolarCandidates, visibleWindCandidates);
  renderDetachedRankingLabels("filters");

  const girDisplay = prepareGirDisplayFeatures(visibleMentions);

  console.log("total visible GIR features", visibleMentions.length);
  console.log("unique GIR coordinate count", girDisplay.uniqueCoordinateCount);
  console.log("repeated coordinate group count", girDisplay.repeatedCoordinateGroupCount);

  bringDataLayersToFront();
  updateDashboardCards(visibleMentions, girDisplay);
}
function prepareGirDisplayFeatures(features) {
  const groups = new Map();

  features.forEach((feature) => {
    if (!feature.geometry || feature.geometry.type !== "Point") return;

    const [lng, lat] = feature.geometry.coordinates || [];
    if (!Number.isFinite(lng) || !Number.isFinite(lat)) return;

    const key = `${lng},${lat}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(feature);
  });

  const repeatedGroups = Array.from(groups.values()).filter((group) => group.length > 1);
  const displayFeatures = features.map((feature) => {
    if (!feature.geometry || feature.geometry.type !== "Point") return feature;

    const [lng, lat] = feature.geometry.coordinates || [];
    const key = `${lng},${lat}`;
    const group = groups.get(key) || [];

    if (group.length <= 1) return feature;

    const index = group.indexOf(feature);
    const angle = (Math.PI * 2 * index) / group.length;
    const offsetRadius = Math.min(0.01, 0.004 + group.length * 0.00035);
    const lngScale = Math.max(Math.cos((lat * Math.PI) / 180), 0.25);
    const displayLat = lat + Math.sin(angle) * offsetRadius;
    const displayLng = lng + (Math.cos(angle) * offsetRadius) / lngScale;

    return {
      ...feature,
      properties: {
        ...(feature.properties || {}),
        _girOverlapCount: group.length
      },
      geometry: {
        ...feature.geometry,
        coordinates: [displayLng, displayLat]
      }
    };
  });

  return {
    features: displayFeatures,
    uniqueCoordinateCount: groups.size,
    repeatedCoordinateGroupCount: repeatedGroups.length
  };
}

function fitMapToNzContextBounds() {
  // Fit once to fixed NZ mainland bounds instead of full Regional Council bounds.
  map.fitBounds(NZ_VIEW_BOUNDS, {
    padding: [40, 40],
    maxZoom: 6
  });

  bringDataLayersToFront();
}

function bringDataLayersToFront() {
  if (nzContextLayer) nzContextLayer.bringToBack();

  if (overlayLayers.protectedAreas && map.hasLayer(overlayLayers.protectedAreas)) overlayLayers.protectedAreas.bringToFront();
  if (overlayLayers.postgisWindSuitability && map.hasLayer(overlayLayers.postgisWindSuitability)) overlayLayers.postgisWindSuitability.bringToFront();
  if (overlayLayers.postgisSolarSuitability && map.hasLayer(overlayLayers.postgisSolarSuitability)) overlayLayers.postgisSolarSuitability.bringToFront();
  if (overlayLayers.roads && map.hasLayer(overlayLayers.roads)) overlayLayers.roads.bringToFront();
  bringLayerGroupToFront(solarCandidateLayer);
  bringLayerGroupToFront(windCandidateLayer);

  if (overlayLayers.weatherResourceSummary && map.hasLayer(overlayLayers.weatherResourceSummary)) overlayLayers.weatherResourceSummary.bringToFront();
  if (overlayLayers.postgisGirLocations && map.hasLayer(overlayLayers.postgisGirLocations)) overlayLayers.postgisGirLocations.bringToFront();
}

function bringLayerGroupToFront(layerGroup) {
  if (!layerGroup || !map.hasLayer(layerGroup)) return;

  layerGroup.eachLayer((layer) => {
    if (layer.bringToFront) layer.bringToFront();
  });
}
function loadGeojson(url, required, layerName) {
  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`${url} returned HTTP ${response.status}`);
      }
      return response.json();
    })
    .catch((error) => {
      console.error(`Failed to load ${layerName} GeoJSON from ${url}:`, error);

      if (required) {
        throw error;
      }

      return { type: "FeatureCollection", features: [] };
    });
}


function loadPostgisExportedGeojsons() {
  const optionalLayers = [
    { key: "postgisGirLocations", endpoint: "postgisGirLocations", label: "PostGIS GIR locations" },
    { key: "protectedAreas", endpoint: "protectedAreas", label: "Protected areas" },
    { key: "roads", endpoint: "roads", label: "Roads" },
    { key: "postgisSolarSuitability", endpoint: "postgisSolarSuitability", label: "PostGIS solar suitability" },
    { key: "weatherResourceSummary", endpoint: "weatherResourceSummary", label: "Weather resource summary" },
    { key: "postgisWindSuitability", endpoint: "postgisWindSuitability", label: "PostGIS wind suitability" }
  ];

  return Promise.all(optionalLayers.map((entry) => {
    const url = DATA_ENDPOINTS[entry.endpoint];
    return fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error(`${url} returned HTTP ${response.status}`);
        return response.json();
      })
      .then((geojson) => {
        const featureCount = (geojson.features || []).length;
        console.log(`${entry.label} feature count: ${featureCount}`);
        return { ...entry, geojson, loaded: true, featureCount };
      })
      .catch((error) => {
        console.warn(`Optional PostGIS export failed: ${entry.label} from ${url}`, error);
        return {
          ...entry,
          geojson: { type: "FeatureCollection", features: [] },
          loaded: false,
          featureCount: 0
        };
      });
  })).then((results) => {
    postgisExportStatus = {
      loaded: results.filter((entry) => entry.loaded).length,
      total: results.length,
      failed: results.filter((entry) => !entry.loaded).map((entry) => entry.label)
    };

    return results.reduce((geojsons, entry) => {
      geojsons[entry.key] = entry.geojson;
      return geojsons;
    }, {});
  });
}

function createPostgisExportedLayers(geojsons = {}) {
  overlayLayers.postgisGirLocations = L.geoJSON(geojsons.postgisGirLocations, {
    pointToLayer: createPostgisGirLocationMarker,
    onEachFeature: bindPostgisGirLocationPopup
  });
  overlayLayers.protectedAreas = L.geoJSON(geojsons.protectedAreas, {
    style: styleProtectedArea,
    onEachFeature: bindProtectedAreaPopup
  });
  overlayLayers.roads = L.geoJSON(geojsons.roads, {
    style: styleRoad,
    onEachFeature: bindRoadPopup
  });
  overlayLayers.postgisSolarSuitability = L.geoJSON(geojsons.postgisSolarSuitability, {
    style: stylePostgisSolarSuitability,
    onEachFeature: bindPostgisSolarSuitabilityPopup
  });
  overlayLayers.weatherResourceSummary = L.geoJSON(geojsons.weatherResourceSummary, {
    pointToLayer: createWeatherResourceMarker,
    onEachFeature: bindWeatherResourcePopup
  });
  overlayLayers.postgisWindSuitability = L.geoJSON(geojsons.postgisWindSuitability, {
    style: stylePostgisWindSuitability,
    onEachFeature: bindPostgisWindSuitabilityPopup
  });
}
function loadSiteSelectionCandidates() {
  console.log("Loading final site_selection_candidates GeoJSON ranking dataset");
  return loadGeojson(DATA_ENDPOINTS.siteSelectionCandidates, true, "site selection candidates")
    .then((geojson) => {
      const features = geojson.features || [];
      const candidates = features
        .map(normalizeSiteSelectionCandidateFeature)
        .filter((candidate) => candidate && Number.isFinite(candidate.latitude) && Number.isFinite(candidate.longitude));

      const solarCandidates = finalizeCandidateList(candidates.filter((candidate) => candidate.energy_type === "Solar"));
      const windCandidates = finalizeCandidateList(candidates.filter((candidate) => candidate.energy_type === "Wind"));

      if (!solarCandidates.length || !windCandidates.length) {
        throw new Error("site_selection_candidates.geojson must include Solar and Wind Point features");
      }

      console.log("site_selection_candidates feature count", features.length);
      console.log("site_selection solar top 10 count", solarCandidates.length);
      console.log("site_selection wind top 10 count", windCandidates.length);

      return {
        solarCandidates,
        windCandidates,
        source: "site_selection_candidates.geojson"
      };
    });
}

function normalizeSiteSelectionCandidateFeature(feature) {
  if (!feature || !feature.geometry || feature.geometry.type !== "Point") return null;

  const coordinates = feature.geometry.coordinates || [];
  const props = feature.properties || {};
  const candidate = normalizeCandidateRecord({
    ...props,
    longitude: coordinates[0],
    latitude: coordinates[1]
  }, props.energy_type, "Site selection candidate");

  candidate.energy_type = titleCaseEnergy(candidate.energy_type);
  candidate.final_score = firstAvailableValue(candidate.final_score, candidate.solar_suitability, candidate.wind_suitability);
  candidate.candidate_name = firstAvailableValue(
    candidate.candidate_name,
    candidate.site_name,
    candidate.name,
    `${candidate.energy_type || "Candidate"} site rank ${candidate.rank || "?"}`
  );

  return candidate;
}
function firstAvailableValue(...values) {
  return values.find((value) => value !== undefined && value !== null && value !== "") ?? "";
}

function finalizeCandidateList(candidates) {
  return candidates
    .slice()
    .sort(sortCandidateRecords)
    .slice(0, 10)
    .map((candidate, index) => ({
      ...candidate,
      rank: Number.isFinite(Number(candidate.rank)) ? candidate.rank : index + 1
    }));
}

function sortCandidateRecords(a, b) {
  const aRank = Number(a.rank);
  const bRank = Number(b.rank);
  const aHasRank = Number.isFinite(aRank);
  const bHasRank = Number.isFinite(bRank);

  if (aHasRank && bHasRank) return aRank - bRank;
  if (aHasRank) return -1;
  if (bHasRank) return 1;

  return (Number(b.final_score) || 0) - (Number(a.final_score) || 0);
}

function normalizeCandidateRecord(record, fallbackEnergyType, namePrefix = "Candidate site") {
  const numericFields = [
    "latitude",
    "longitude",
    "final_score",
    "rank",
    "weather_resource_score",
    "grid_connection_score",
    "gir_evidence_score",
    "interpolation_confidence",
    "distance_to_transmission_km",
    "mean_wind_speed_100m_ms",
    "p90_wind_speed_100m_ms",
    "total_shortwave_radiation_kwh_m2",
    "total_sunshine_hours",
    "nearest_weather_distance_km",
    "gir_mentions_nearby",
    "solar_suitability",
    "wind_suitability",
    "wind_speed_raw",
    "solar_irr_raw",
    "slope_raw",
    "grid_dist_km",
    "protected_dist_km",
    "pop_density"
  ];

  const candidate = { ...record };
  candidate.longitude = firstAvailableValue(candidate.longitude, candidate.lon, candidate.lng, candidate.long, candidate.x);
  candidate.latitude = firstAvailableValue(candidate.latitude, candidate.lat, candidate.y);
  candidate.energy_type = titleCaseEnergy(candidate.energy_type || fallbackEnergyType);
  candidate.final_score = firstAvailableValue(candidate.final_score, candidate.solar_suitability, candidate.wind_suitability);
  candidate.candidate_name = firstAvailableValue(
    candidate.candidate_name,
    candidate.site_name,
    candidate.name,
    `${namePrefix} rank ${candidate.rank || "?"}`
  );

  numericFields.forEach((field) => {
    candidate[field] = toNumber(candidate[field]);
  });

  return candidate;
}

function titleCaseEnergy(value) {
  const normalized = String(value || "").trim().toLowerCase();
  if (normalized.includes("solar")) return "Solar";
  if (normalized.includes("wind")) return "Wind";
  return normalized.replace(/^./, (letter) => letter.toUpperCase());
}

function toNumber(value) {
  if (value === undefined || value === null || value === "") return null;
  const numberValue = Number(String(value).replace(/,/g, ""));
  return Number.isFinite(numberValue) ? numberValue : null;
}

function logCandidateSummary() {
  const topWind = allWindCandidates[0];
  const topSolar = allSolarCandidates[0];

  console.log("wind candidate count", allWindCandidates.length);
  console.log("solar candidate count", allSolarCandidates.length);
  console.log("top wind candidate name and score", topWind ? `${topWind.candidate_name}: ${topWind.final_score}` : "Not available");
  console.log("top solar candidate name and score", topSolar ? `${topSolar.candidate_name}: ${topSolar.final_score}` : "Not available");
}
function createProjectMarker(feature, latlng) {
  const energyType = feature.properties.energy_type;
  const markerClass = energyType === "Wind" ? "wind-marker" : "solar-marker";
  const markerLetter = energyType === "Wind" ? "W" : "S";

  return L.marker(latlng, {
    icon: L.divIcon({
      className: "",
      html: `<span class="project-marker ${markerClass}">${markerLetter}</span>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16]
    })
  });
}

function filterCandidates(candidates, selectedEnergy, selectedRegion) {
  return candidates.filter((candidate) => {
    const matchesEnergy = selectedEnergy === "All" || candidate.energy_type === selectedEnergy;
    const candidateRegionText = candidate.region || "";
    const mappedCandidateRegion = mapTextToRegion(candidateRegionText);
    const matchesRegion = selectedRegion === "All" || candidate.region === selectedRegion || mappedCandidateRegion === selectedRegion || normalizeLookupText(candidateRegionText).includes(normalizeLookupText(selectedRegion));
    return matchesEnergy && matchesRegion;
  });
}

function renderCandidateLayer(layerGroup, candidates, energyType) {
  if (!layerGroup) return;

  candidateMarkerLookup[energyType] = new Map();
  layerGroup.clearLayers();

  candidates.forEach((candidate) => {
    const marker = createCandidateMarker(candidate, energyType);
    marker.bindTooltip(`${candidate.rank || "?"} ${candidate.candidate_name || "Candidate"} - ${energyType}`,  {
      direction: "top",
      opacity: 0.92
    });
    marker.on("click", () => selectCandidate(candidate, { pan: true }));
    marker.addTo(layerGroup);
    candidateMarkerLookup[energyType].set(getCandidateKey(candidate), marker);
  });

  updateCandidateMarkerStyles();
}

function createCandidateMarker(candidate, energyType) {
  return L.marker([candidate.latitude, candidate.longitude], {
    pane: "candidatePointPane",
    icon: createCandidateIcon(candidate, energyType, getCandidateKey(candidate) === selectedCandidateKey)
  });
}

function createCandidateIcon(candidate, energyType, isSelected) {
  const numericRank = Number(candidate.rank);
  const isTopThree = Number.isFinite(numericRank) && numericRank <= 3;
  const markerClass = energyType === "Wind" ? "candidate-point wind-candidate-point" : "candidate-point solar-candidate-point";
  const size = isSelected ? 18 : isTopThree ? 15 : 12;

  return L.divIcon({
    className: "",
    html: `<span class="${markerClass} ${isTopThree ? "top-candidate-point" : ""} ${isSelected ? "selected-candidate-point" : ""}"></span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2]
  });
}
function buildCandidateDetails(candidate, energyType) {
  const resourceRows = energyType === "Wind"
    ? `
      ${candidateDetailRow("Mean wind 100m", formatCandidateNumberWithUnit(candidate.mean_wind_speed_100m_ms, 2, "m/s"))}
      ${candidateDetailRow("P90 wind 100m", formatCandidateNumberWithUnit(candidate.p90_wind_speed_100m_ms, 2, "m/s"))}
    `
    : `
      ${candidateDetailRow("Shortwave radiation", formatCandidateNumberWithUnit(candidate.total_shortwave_radiation_kwh_m2, 1, "kWh/m2"))}
      ${candidateDetailRow("Sunshine hours", formatCandidateNumber(candidate.total_sunshine_hours, 1))}
    `;

  return `
    <div class="candidate-details-grid">
      ${candidateDetailRow("Rank", formatCandidateValue(candidate.rank))}
      ${candidateDetailRow("Energy type", escapeHtml(candidate.energy_type || energyType))}
      ${candidateDetailRow("Region", formatCandidateValue(candidate.region))}
      ${candidateDetailRow("Final score", formatCandidateNumber(candidate.final_score, 2))}
      ${candidateDetailRow("Solar suitability", formatCandidateNumber(candidate.solar_suitability, 2))}
      ${candidateDetailRow("Wind suitability", formatCandidateNumber(candidate.wind_suitability, 2))}
      ${candidateDetailRow("Wind speed raw", formatCandidateNumber(candidate.wind_speed_raw, 2))}
      ${candidateDetailRow("Solar irradiance raw", formatCandidateNumber(candidate.solar_irr_raw, 2))}
      ${candidateDetailRow("Slope raw", formatCandidateNumber(candidate.slope_raw, 2))}
      ${candidateDetailRow("Grid distance", formatCandidateNumberWithUnit(candidate.grid_dist_km ?? candidate.distance_to_transmission_km, 2, "km"))}
      ${candidateDetailRow("Protected distance", formatCandidateNumberWithUnit(candidate.protected_dist_km, 2, "km"))}
      ${candidateDetailRow("Population density", formatCandidateNumber(candidate.pop_density, 2))}
      ${candidateDetailRow("Weather resource score", formatCandidateNumber(candidate.weather_resource_score, 2))}
      ${candidateDetailRow("Grid connection score", formatCandidateNumber(candidate.grid_connection_score, 2))}
      ${candidateDetailRow("GIR evidence score", formatCandidateNumber(candidate.gir_evidence_score, 2))}
      ${resourceRows}
      ${candidateDetailRow("GIR mentions nearby", formatCandidateNumber(candidate.gir_mentions_nearby, 0))}
      ${candidateDetailRow("Score formula", formatCandidateValue(candidate.score_formula), true)}
    </div>
  `;
}

function candidateDetailRow(label, value, wide = false) {
  return `
    <div class="candidate-detail-row ${wide ? "candidate-detail-wide" : ""}">
      <span>${escapeHtml(label)}</span>
      <strong>${value || "Not available"}</strong>
    </div>
  `;
}
function formatCandidateNumber(value, digits) {
  if (!Number.isFinite(value)) return "Not available";
  return value.toLocaleString(undefined, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  });
}


function formatCandidateNumberWithUnit(value, digits, unit) {
  if (!Number.isFinite(value)) return "Not available";
  return `${formatCandidateNumber(value, digits)} ${unit}`;
}
function formatCandidateValue(value) {
  if (value === undefined || value === null || value === "") return "Not available";
  return escapeHtml(value);
}

function getCandidateKey(candidate) {
  return `${candidate.energy_type}-${candidate.rank}-${candidate.candidate_name}`;
}


function renderDetachedRankingLabels(reason = "manual") {
  if (!detachedRankingLayer || !map) return;

  detachedRankingLayer.clearLayers();

  const selectedEnergy = energyFilter.value;
  const selectedRegion = regionFilter ? regionFilter.value : "All";
  const groups = getDetachedRankingGroups(selectedEnergy, selectedRegion);
  const entries = buildDetachedRankingEntries(groups);
  const placedRects = [];
  const labelCounts = { solar: 0, wind: 0 };

  entries.forEach((entry, index) => {
    const candidate = entry.candidate;
    const labelSize = getDetachedLabelSize(candidate);
    const labelPoint = placeDetachedLabelOnRing(entry, index, entries.length, labelSize, placedRects, groups.length);
    const labelLatLng = map.containerPointToLatLng(labelPoint);
    const leaderStyle = getDetachedLeaderStyle(entry, candidate);
    const isSelected = getCandidateKey(candidate) === selectedCandidateKey;

    if (entry.groupKey === "solar") labelCounts.solar += 1;
    if (entry.groupKey === "wind") labelCounts.wind += 1;
    if (entry.groupKey === "finalWind") labelCounts.finalWind += 1;

    L.polyline([[candidate.latitude, candidate.longitude], labelLatLng], {
      pane: "rankingLeaderPane",
      ...leaderStyle,
      interactive: false
    }).addTo(detachedRankingLayer);

    const labelMarker = L.marker(labelLatLng, {
      pane: "rankingLabelPane",
      icon: createDetachedRankingIcon(candidate, entry, isSelected)
    });

    labelMarker.on("click", () => selectDetachedRankingEntry(entry));
    labelMarker.on("mouseover", () => highlightCandidatePair(candidate, true));
    labelMarker.on("mouseout", () => highlightCandidatePair(candidate, false));
    labelMarker.addTo(detachedRankingLayer);
  });

  console.log("detached ranking label layout recalculated", {
    reason,
    rankingMode: currentRankingType,
    solarLabels: labelCounts.solar,
    windLabels: labelCounts.wind,
    totalDetachedLabels: entries.length
  });
}
function buildDetachedRankingEntries(groups) {
  const entries = [];

  groups.forEach((group) => {
    group.candidates.forEach((candidate, index) => {
      entries.push({
        candidate,
        energyType: group.energyType,
        sourceType: group.sourceType,
        groupKey: group.groupKey,
        groupIndex: index,
        groupCount: group.candidates.length
      });
    });
  });

  return entries;
}

function getDetachedRankingGroups(selectedEnergy, selectedRegion) {
  const groups = [];
  const allowSolar = selectedEnergy === "All" || selectedEnergy === "Solar";
  const allowWind = selectedEnergy === "All" || selectedEnergy === "Wind";

  if (allowWind && windCandidateLayer && map.hasLayer(windCandidateLayer)) {
    groups.push({
      groupKey: "wind",
      sourceType: "ranking",
      energyType: "Wind",
      candidates: filterCandidates(allWindCandidates, selectedEnergy, selectedRegion).slice(0, 10)
    });
  }

  if (allowSolar && solarCandidateLayer && map.hasLayer(solarCandidateLayer)) {
    groups.push({
      groupKey: "solar",
      sourceType: "ranking",
      energyType: "Solar",
      candidates: filterCandidates(allSolarCandidates, selectedEnergy, selectedRegion).slice(0, 10)
    });
  }

  return groups.filter((group) => group.candidates.length);
}

function getDetachedLabelSize(candidate) {
  const numericRank = Number(candidate.rank);
  const isTopThree = Number.isFinite(numericRank) && numericRank <= 3;
  return {
    width: isTopThree ? 48 : 40,
    height: isTopThree ? 36 : 30
  };
}

function placeDetachedLabelOnRing(entry, index, totalCount, labelSize, placedRects, groupTotal) {
  const layout = getNzRingLayout(labelSize);
  const baseAngle = getRingAngle(entry, index, totalCount, groupTotal);
  const angleOffsets = [0, -8, 8, -16, 16, -24, 24, -32, 32];
  const radiusScales = [1, 1.12, 0.9, 1.24, 0.78, 1.36];

  for (const radiusScale of radiusScales) {
    for (const angleOffset of angleOffsets) {
      const point = pointOnNzRing(layout, baseAngle + angleOffset, radiusScale, labelSize);
      const rect = getLabelRect(point, labelSize);
      if (!placedRects.some((placed) => rectanglesOverlap(rect, placed))) {
        placedRects.push(rect);
        return point;
      }
    }
  }

  const fallback = pointOnNzRing(layout, baseAngle + index * 11, 0.9, labelSize);
  placedRects.push(getLabelRect(fallback, labelSize));
  return fallback;
}

function getNzRingLayout(labelSize) {
  const mapSize = map.getSize();
  const northEast = map.latLngToContainerPoint(NZ_VIEW_BOUNDS.getNorthEast());
  const southWest = map.latLngToContainerPoint(NZ_VIEW_BOUNDS.getSouthWest());
  const west = Math.min(northEast.x, southWest.x);
  const east = Math.max(northEast.x, southWest.x);
  const north = Math.min(northEast.y, southWest.y);
  const south = Math.max(northEast.y, southWest.y);
  const labelMargin = Math.max(54, labelSize.width + 12);
  const center = L.point((west + east) / 2, (north + south) / 2);
  const clampedCenter = L.point(
    Math.max(mapSize.x * 0.28, Math.min(mapSize.x * 0.72, center.x)),
    Math.max(mapSize.y * 0.26, Math.min(mapSize.y * 0.74, center.y))
  );
  const nzWidth = Math.max(180, east - west);
  const nzHeight = Math.max(220, south - north);
  const maxRadiusX = Math.max(120, Math.min(clampedCenter.x - labelMargin, mapSize.x - clampedCenter.x - labelMargin));
  const maxRadiusY = Math.max(120, Math.min(clampedCenter.y - labelMargin, mapSize.y - clampedCenter.y - labelMargin));

  return {
    center: clampedCenter,
    radiusX: Math.min(maxRadiusX, Math.max(180, nzWidth * 0.54)),
    radiusY: Math.min(maxRadiusY, Math.max(150, nzHeight * 0.46)),
    mapSize
  };
}

function getRingAngle(entry, index, totalCount, groupTotal) {
  const t = entry.groupCount <= 1 ? 0.5 : entry.groupIndex / (entry.groupCount - 1);


  if (entry.groupKey === "solar") {
    return 12 + t * 72;
  }


  return 116 + t * 72;
}
function pointOnNzRing(layout, angleDegrees, radiusScale, labelSize) {
  const radians = (angleDegrees * Math.PI) / 180;
  const rawPoint = L.point(
    layout.center.x + Math.cos(radians) * layout.radiusX * radiusScale,
    layout.center.y + Math.sin(radians) * layout.radiusY * radiusScale
  );
  return clampLabelPoint(rawPoint, labelSize, layout.mapSize);
}

function clampLabelPoint(point, labelSize, mapSize) {
  const halfWidth = labelSize.width / 2;
  const halfHeight = labelSize.height / 2;
  const margin = 18;
  return L.point(
    Math.max(halfWidth + margin, Math.min(mapSize.x - halfWidth - margin, point.x)),
    Math.max(halfHeight + margin, Math.min(mapSize.y - halfHeight - margin, point.y))
  );
}

function getLabelRect(point, labelSize) {
  return {
    left: point.x - labelSize.width / 2,
    right: point.x + labelSize.width / 2,
    top: point.y - labelSize.height / 2,
    bottom: point.y + labelSize.height / 2
  };
}

function rectanglesOverlap(a, b) {
  const padding = 8;
  return !(
    a.right + padding < b.left ||
    a.left - padding > b.right ||
    a.bottom + padding < b.top ||
    a.top - padding > b.bottom
  );
}
function getDetachedLeaderStyle(entry, candidate) {
  const isTopThree = Number(candidate.rank) <= 3;
  const colors = {
    solar: "#f3b23c",
    wind: "#2f7fbf",
    finalSolar: "#e58a1f",
    finalWind: "#1967a3"
  };

  return {
    color: colors[entry.groupKey] || colors.solar,
    weight: entry.sourceType === "final" ? (isTopThree ? 1.9 : 1.45) : (isTopThree ? 1.8 : 1.3),
    opacity: entry.sourceType === "final" ? 0.78 : 0.68,
    dashArray: entry.sourceType === "final" ? "5 4" : (isTopThree ? "" : "4 4")
  };
}
function createDetachedRankingIcon(candidate, entry, isSelected) {
  const numericRank = Number(candidate.rank);
  const isTopThree = Number.isFinite(numericRank) && numericRank <= 3;
  const labelClassByGroup = {
    solar: "solar-ranking-label",
    wind: "wind-ranking-label",
    finalSolar: "final-solar-ranking-label",
    finalWind: "final-wind-ranking-label"
  };
  const markerClass = `detached-ranking-label ${labelClassByGroup[entry.groupKey] || "solar-ranking-label"}`;
  const size = getDetachedLabelSize(candidate);

  return L.divIcon({
    className: "",
    html: `<button type="button" class="${markerClass} ${isTopThree ? "top-detached-ranking" : ""} ${isSelected ? "selected-detached-ranking" : ""}" aria-label="Open rank ${escapeHtml(candidate.rank)} ${escapeHtml(candidate.candidate_name || "candidate")}">${escapeHtml(candidate.rank || "?")}</button>`,
    iconSize: [size.width, size.height],
    iconAnchor: [size.width / 2, size.height / 2]
  });
}
function selectDetachedRankingEntry(entry) {
  selectCandidate(entry.candidate, { pan: false });
}
function highlightCandidatePair(candidate, highlight) {
  const energyType = candidate.energy_type === "Wind" ? "Wind" : "Solar";
  const marker = candidateMarkerLookup[energyType]?.get(getCandidateKey(candidate));
  const element = marker?.getElement();
  if (element) element.classList.toggle("candidate-hover", highlight);
}
function updateRankingTabs() {
  rankingTabs.forEach((tab) => {
    const isActive = tab.dataset.rankingType === currentRankingType;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-pressed", String(isActive));
  });
}

function renderRankingPanel(visibleSolarCandidates, visibleWindCandidates) {
  if (!rankingList || !rankingNote) return;

  const selectedEnergy = energyFilter.value;
  const selectedRegion = regionFilter ? regionFilter.value : "All";
  const solarRows = visibleSolarCandidates || filterCandidates(allSolarCandidates, selectedEnergy, selectedRegion);
  const windRows = visibleWindCandidates || filterCandidates(allWindCandidates, selectedEnergy, selectedRegion);

  rankingList.innerHTML = "";

  if (!isCandidateEnergyVisible(currentRankingType, selectedEnergy)) {
    rankingNote.textContent = "No ranked candidates are available for this energy type.";
    return;
  }

  if (currentRankingType === "All") {
    renderAllRankingSummary(solarRows, windRows, selectedEnergy);
    return;
  }

  const rows = currentRankingType === "Solar" ? solarRows : windRows;

  if (!rows.length) {
    rankingNote.textContent = "No ranked candidates match the current filters or the ranking GeoJSON is not loaded.";
    return;
  }

  rankingNote.textContent = "Click a row to zoom to that candidate.";
  rows.forEach((candidate) => {
    const row = document.createElement("button");
    row.type = "button";
    const numericRank = Number(candidate.rank);
    row.className = `ranking-row ${Number.isFinite(numericRank) && numericRank <= 3 ? "top-ranking-row" : ""}`;
    row.innerHTML = `
      <span class="ranking-rank">${escapeHtml(candidate.rank)}</span>
      <span class="ranking-name">${escapeHtml(candidate.candidate_name || "Candidate")}</span>
      <span class="ranking-region">${escapeHtml(candidate.region || "Not available")}</span>
      <span class="ranking-score">${formatCandidateNumber(candidate.final_score, 2)}</span>
    `;
    row.addEventListener("click", () => focusCandidate(candidate));
    rankingList.appendChild(row);
  });
}

function renderAllRankingSummary(solarRows, windRows, selectedEnergy) {
  const solarVisible = (selectedEnergy === "All" || selectedEnergy === "Solar") && solarCandidateLayer && map.hasLayer(solarCandidateLayer);
  const windVisible = (selectedEnergy === "All" || selectedEnergy === "Wind") && windCandidateLayer && map.hasLayer(windCandidateLayer);
  const solarCount = solarVisible ? solarRows.length : 0;
  const windCount = windVisible ? windRows.length : 0;
  const totalCount = solarCount + windCount;

  rankingNote.textContent = "All mode shows Solar and Wind Top 10 layers together. Select Solar or Wind for the detailed list.";
  rankingList.innerHTML = `
    <div class="ranking-summary-row"><span>Solar Top 10 visible</span><strong>${solarCount}</strong></div>
    <div class="ranking-summary-row"><span>Wind Top 10 visible</span><strong>${windCount}</strong></div>
    <div class="ranking-summary-row"><span>Total candidates visible</span><strong>${totalCount}</strong></div>
  `;
}

function logRankingModeChange() {
  const selectedEnergy = energyFilter.value;
  const selectedRegion = regionFilter ? regionFilter.value : "All";
  const visibleSolarCandidates = filterCandidates(allSolarCandidates, selectedEnergy, selectedRegion);
  const visibleWindCandidates = filterCandidates(allWindCandidates, selectedEnergy, selectedRegion);

  console.log("ranking mode", currentRankingType);
  console.log("visible solar candidate count", visibleSolarCandidates.length);
  console.log("visible wind candidate count", visibleWindCandidates.length);
}

function isCandidateEnergyVisible(candidateType, selectedEnergy) {
  if (selectedEnergy === "Mixed" || selectedEnergy === "Renewable") return false;
  if (candidateType === "All") return selectedEnergy === "All" || selectedEnergy === "Solar" || selectedEnergy === "Wind";
  return selectedEnergy === "All" || selectedEnergy === candidateType;
}

function focusCandidate(candidate) {
  const energyType = candidate.energy_type === "Wind" ? "Wind" : "Solar";
  const layerKey = energyType === "Wind" ? "windCandidates" : "solarCandidates";
  const layer = overlayLayers[layerKey];
  const checkbox = document.querySelector(`[data-layer-key="${layerKey}"]`);

  if (layer && !map.hasLayer(layer)) {
    layer.addTo(map);
    if (checkbox) checkbox.checked = true;
    updateActiveLayerCard();
    rankingNote.textContent = `${energyType} candidate layer was hidden, so it has been turned on.`;
  }

  map.setView([candidate.latitude, candidate.longitude], 10);
  selectCandidate(candidate, { pan: false });
}

function selectCandidate(candidate, options = {}) {
  const energyType = candidate.energy_type === "Wind" ? "Wind" : "Solar";
  if (currentRankingType !== "All") {
    currentRankingType = energyType;
  }
  updateRankingTabs();
  selectedCandidateKey = getCandidateKey(candidate);
  updateCandidateMarkerStyles();
  renderRankingPanel();
  renderDetachedRankingLabels("candidate selected");
  showCandidateDetails(candidate, energyType);

  if (options.pan) {
    map.panTo([candidate.latitude, candidate.longitude], { animate: true });
  }

  console.log("candidate selected", {
    candidateName: candidate.candidate_name || "Candidate",
    energyType,
    rank: candidate.rank,
    finalScore: candidate.final_score
  });
}

function updateCandidateMarkerStyles() {
  ["Solar", "Wind"].forEach((energyType) => {
    candidateMarkerLookup[energyType].forEach((marker, key) => {
      const candidate = getCandidateByKey(key, energyType);
      if (candidate) {
        marker.setIcon(createCandidateIcon(candidate, energyType, key === selectedCandidateKey));
      }
    });
  });
}

function getCandidateByKey(key, energyType) {
  const candidates = energyType === "Wind" ? allWindCandidates : allSolarCandidates;
  return candidates.find((candidate) => getCandidateKey(candidate) === key);
}

function showCandidateDetails(candidate, energyType) {
  if (!candidateDetailsPanel || !candidateDetailsTitle || !candidateDetailsContent) return;

  candidateDetailsTitle.textContent = `Rank ${candidate.rank || "?"} - ${candidate.candidate_name || "Candidate"}`;
  candidateDetailsContent.innerHTML = buildCandidateDetails(candidate, energyType);
  candidateDetailsPanel.classList.remove("is-hidden");
  if (candidateDetailsPanel.style.left) {
    requestAnimationFrame(() => setCandidateDetailsPosition(parseFloat(candidateDetailsPanel.style.left), parseFloat(candidateDetailsPanel.style.top)));
  }
}

function setupDraggableCandidateDetails() {
  if (!candidateDetailsPanel) return;

  const header = candidateDetailsPanel.querySelector(".candidate-details-header");
  const mapArea = document.querySelector(".map-area");
  if (!header || !mapArea) return;

  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let startLeft = 0;
  let startTop = 0;

  header.addEventListener("pointerdown", (event) => {
    if (event.target.closest("button")) return;
    if (candidateDetailsPanel.classList.contains("is-hidden")) return;

    const panelRect = candidateDetailsPanel.getBoundingClientRect();
    const areaRect = mapArea.getBoundingClientRect();
    isDragging = true;
    startX = event.clientX;
    startY = event.clientY;
    startLeft = panelRect.left - areaRect.left;
    startTop = panelRect.top - areaRect.top;

    candidateDetailsPanel.classList.add("is-dragging");
    candidateDetailsPanel.style.left = `${startLeft}px`;
    candidateDetailsPanel.style.top = `${startTop}px`;
    candidateDetailsPanel.style.right = "auto";
    candidateDetailsPanel.style.bottom = "auto";
    event.preventDefault();
  });

  window.addEventListener("pointermove", (event) => {
    if (!isDragging) return;
    const nextLeft = startLeft + event.clientX - startX;
    const nextTop = startTop + event.clientY - startY;
    setCandidateDetailsPosition(nextLeft, nextTop);
  });

  window.addEventListener("pointerup", () => {
    if (!isDragging) return;
    isDragging = false;
    candidateDetailsPanel.classList.remove("is-dragging");
  });

  window.addEventListener("resize", () => {
    if (candidateDetailsPanel.classList.contains("is-hidden") || !candidateDetailsPanel.style.left) return;
    setCandidateDetailsPosition(parseFloat(candidateDetailsPanel.style.left), parseFloat(candidateDetailsPanel.style.top));
  });
}

function setCandidateDetailsPosition(left, top) {
  if (!candidateDetailsPanel) return;
  const mapArea = document.querySelector(".map-area");
  if (!mapArea) return;

  const margin = 10;
  const areaRect = mapArea.getBoundingClientRect();
  const panelRect = candidateDetailsPanel.getBoundingClientRect();
  const maxLeft = Math.max(margin, areaRect.width - panelRect.width - margin);
  const maxTop = Math.max(margin, areaRect.height - panelRect.height - margin);
  const safeLeft = Math.min(Math.max(left, margin), maxLeft);
  const safeTop = Math.min(Math.max(top, margin), maxTop);

  candidateDetailsPanel.style.left = `${safeLeft}px`;
  candidateDetailsPanel.style.top = `${safeTop}px`;
  candidateDetailsPanel.style.right = "auto";
  candidateDetailsPanel.style.bottom = "auto";
}
function closeCandidateDetails() {
  selectedCandidateKey = "";
  updateCandidateMarkerStyles();
  if (candidateDetailsPanel) {
    candidateDetailsPanel.classList.add("is-hidden");
  }
}
function styleNzContext() {
  return {
    fillColor: "#bfe3bf",
    color: "#2e6f47",
    weight: 1,
    fillOpacity: 0.08
  };
}

function styleWindSuitableArea() {
  return {
    color: "#2f7fbf",
    fillColor: "#2f7fbf",
    weight: 2,
    opacity: 0.9,
    fillOpacity: 0.18
  };
}

function styleSolarSuitableArea() {
  return {
    color: "#f3b23c",
    fillColor: "#f3b23c",
    weight: 2,
    opacity: 0.9,
    fillOpacity: 0.18
  };
}

function styleTransmissionLine() {
  return {
    color: "#b83280",
    weight: 2.1,
    opacity: 0.92,
    lineCap: "round",
    lineJoin: "round"
  };
}

function styleProtectedArea() {
  return {
    color: "#be185d",
    fillColor: "#f43f5e",
    weight: 1.4,
    opacity: 0.85,
    fillOpacity: 0.12
  };
}

function styleRoad() {
  return {
    color: "#3FA9F5",
    weight: 1.7,
    opacity: 0.92,
    lineCap: "round",
    lineJoin: "round"
  };
}

function stylePostgisSolarSuitability() {
  return {
    color: "#f59e0b",
    fillColor: "#fbbf24",
    weight: 1.4,
    opacity: 0.86,
    fillOpacity: 0.14
  };
}

function stylePostgisWindSuitability() {
  return {
    color: "#2563eb",
    fillColor: "#60a5fa",
    weight: 1.4,
    opacity: 0.86,
    fillOpacity: 0.13
  };
}

function createPostgisGirLocationMarker(feature, latlng) {
  return L.circleMarker(latlng, {
    radius: 6,
    color: "#ffffff",
    weight: 1.5,
    fillColor: "#5f8d67",
    fillOpacity: 0.9
  });
}

function createWeatherResourceMarker(feature, latlng) {
  return L.circleMarker(latlng, {
    radius: 6,
    color: "#ffffff",
    weight: 1.5,
    fillColor: "#8b5cf6",
    fillOpacity: 0.9
  });
}

function bindProtectedAreaPopup(feature, layer) {
  bindFieldPopup(layer, "Protected area", feature.properties || {}, ["area_name", "protection_status", "constraint_level", "data_source"]);
}

function bindRoadPopup(feature, layer) {
  bindFieldPopup(layer, "Road", feature.properties || {}, ["road_name", "road_class", "data_source"]);
}

function bindPostgisGirLocationPopup(feature, layer) {
  bindFieldPopup(layer, "PostGIS GIR location", feature.properties || {}, ["place_name", "energy_type", "confidence", "article_title", "source_url"]);
}

function bindWeatherResourcePopup(feature, layer) {
  bindFieldPopup(layer, "Weather resource summary", feature.properties || {}, [
    "place_name",
    "region",
    "wind_resource_score",
    "solar_resource_score",
    "mean_wind_speed_100m_ms",
    "total_sunshine_hours",
    "total_shortwave_radiation_kwh_m2"
  ]);
}

function bindPostgisSolarSuitabilityPopup(feature, layer) {
  bindFieldPopup(layer, "PostGIS solar suitability", feature.properties || {}, [
    "region_name",
    "suitability_score",
    "solar_irradiance_kwh_m2",
    "slope_degree",
    "constraint_level",
    "distance_to_grid_km"
  ]);
}

function bindPostgisWindSuitabilityPopup(feature, layer) {
  bindFieldPopup(layer, "PostGIS wind suitability", feature.properties || {}, [
    "region_name",
    "suitability_score",
    "avg_wind_speed",
    "slope_degree",
    "constraint_level",
    "distance_to_grid_km"
  ]);
}

function bindFieldPopup(layer, title, props, fields) {
  const rows = fields.map((field) => {
    const value = hasValue(props[field]) ? props[field] : "Not available";
    const displayValue = field === "source_url" && hasValue(props[field])
      ? `<a href="${escapeHtml(props[field])}" target="_blank" rel="noopener noreferrer">Open source</a>`
      : escapeHtml(value);
    return `<tr><th>${escapeHtml(field)}</th><td>${displayValue}</td></tr>`;
  }).join("");

  layer.bindPopup(`
    <h3 class="popup-title">${escapeHtml(title)}</h3>
    <table class="popup-table">${rows}</table>
  `);

  const tooltip = props.candidate_name || props.place_name || props.area_name || props.road_name || props.region_name || title;
  layer.bindTooltip(escapeHtml(tooltip), { sticky: true });
}
function bindTransmissionLinePopup(feature, layer) {
  const props = feature.properties || {};
  const lineName = props.line_name || props.name || "Transmission line";
  const voltage = props.voltage_kv ?? props.voltage ?? "Not available";
  const operatorName = props.operator_name || "Not available";
  const dataSource = props.data_source || "Not available";

  layer.bindPopup(`
    <h3 class="popup-title">${escapeHtml(lineName)}</h3>
    <table class="popup-table">
      <tr><th>line_name</th><td>${escapeHtml(lineName)}</td></tr>
      <tr><th>voltage_kv</th><td>${escapeHtml(voltage)}</td></tr>
      <tr><th>operator_name</th><td>${escapeHtml(operatorName)}</td></tr>
      <tr><th>data_source</th><td>${escapeHtml(dataSource)}</td></tr>
    </table>
  `);

  layer.bindTooltip(escapeHtml(lineName), {
    sticky: true
  });
}
function bindSuitabilityAreaPopup(feature, layer, layerType) {
  const props = feature.properties || {};
  const dnValue = props.DN ?? "Not available";

  layer.bindPopup(`
    <h3 class="popup-title">${escapeHtml(layerType)}</h3>
    <table class="popup-table">
      <tr><th>Layer type</th><td>${escapeHtml(layerType)}</td></tr>
      <tr><th>DN</th><td>${escapeHtml(dnValue)}</td></tr>
    </table>
  `);

  layer.bindTooltip(`${escapeHtml(layerType)} - DN ${escapeHtml(dnValue)}`, {
    sticky: true
  });
}

function bindNzContextTooltip(feature, layer) {
  const props = feature.properties || {};
  const label = props.REGC2025_V1_00_NAME || props.REGC2025_V1_00_NAME_ASCII || props.name || "New Zealand region";

  layer.bindTooltip(escapeHtml(label), {
    sticky: true
  });
}

function createGirMentionMarker(feature, latlng) {
  const props = feature.properties || {};
  const energyType = getGirEnergyType(props);
  const color = energyColors[energyType] || "#6b7280";

  return L.circleMarker(latlng, {
    radius: 8,
    color: "#ffffff",
    weight: 2,
    fillColor: color,
    fillOpacity: 0.9
  });
}

function getGirPlace(props) {
  return props.place_name || props.place || props.location || props.region || props.geocoded_address || "";
}

function getGirRegion(props) {
  const text = [props.region, props.place_name, props.place, props.location, props.geocoded_address]
    .filter(Boolean)
    .join(" ");

  return mapTextToRegion(text);
}

function mapTextToRegion(value) {
  const text = normalizeLookupText(value);
  if (!text) return "";

  for (const entry of GIR_REGION_TERMS) {
    const matched = entry.terms.some((term) => text.includes(normalizeLookupText(term)));
    if (matched) return entry.region;
  }

  return "";
}

function normalizeLookupText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\u2010-\u2015]/g, "-")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function getGirEnergyType(props) {
  if (props.energy_type) return props.energy_type;

  const keywords = formatGirKeywords(props.matched_keywords).toLowerCase();
  const hasSolar = keywords.includes("solar");
  const hasWind = keywords.includes("wind");

  if (hasSolar && hasWind) return "Mixed";
  if (hasSolar) return "Solar";
  if (hasWind) return "Wind";
  return "Renewable";
}

function matchesGirEnergy(selectedEnergy, mentionEnergy) {
  return mentionEnergy === selectedEnergy;
}

function formatGirKeywords(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(", ");
  if (value === undefined || value === null) return "";
  return String(value);
}
function bindProjectPopup(feature, layer) {
  const props = feature.properties || {};
  layer.bindPopup(`
    <h3 class="popup-title">${escapeHtml(props.name)}</h3>
    <table class="popup-table">
      <tr><th>Energy type</th><td>${escapeHtml(props.energy_type)}</td></tr>
      <tr><th>Status</th><td>${escapeHtml(props.status)}</td></tr>
      <tr><th>Region</th><td>${escapeHtml(props.region)}</td></tr>
      <tr><th>Suitability</th><td>${escapeHtml(props.suitability_level)}</td></tr>
      <tr><th>Source</th><td>${escapeHtml(props.source)}</td></tr>
    </table>
  `);
}

function bindGirMentionPopup(feature, layer) {
  const props = feature.properties || {};
  const title = props.title || props.name || "Renewable energy mention";
  const place = getGirPlace(props) || "Unknown";
  const source = props.source || "Final GIR GeoJSON data";
  const energyType = getGirEnergyType(props);
  const keywords = formatGirKeywords(props.matched_keywords);
  const urlRow = props.url
    ? `<tr><th>URL</th><td><a href="${escapeHtml(props.url)}" target="_blank" rel="noopener noreferrer">Open source</a></td></tr>`
    : "";
  const keywordsRow = keywords
    ? `<tr><th>Keywords</th><td>${escapeHtml(keywords)}</td></tr>`
    : "";
  const overlapRow = props._girOverlapCount > 1
    ? `<tr><th>Note</th><td>Overlapping GIR mentions at this location: ${escapeHtml(props._girOverlapCount)}</td></tr>`
    : "";

  layer.bindPopup(`
    <h3 class="popup-title">${escapeHtml(title)}</h3>
    <table class="popup-table">
      <tr><th>Place</th><td>${escapeHtml(place)}</td></tr>
      <tr><th>Energy type</th><td>${escapeHtml(energyType)}</td></tr>
      <tr><th>Source</th><td>${escapeHtml(source)}</td></tr>
      ${keywordsRow}
      ${urlRow}
      ${overlapRow}
    </table>
  `);
}

function setupLayerToggles() {
  layerCheckboxes.forEach((checkbox) => {
    const layer = overlayLayers[checkbox.dataset.layerKey];
    if (!layer) {
      checkbox.checked = false;
      checkbox.disabled = true;
      return;
    }

    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        layer.addTo(map);
      } else {
        map.removeLayer(layer);
      }

      if (["solarCandidates", "windCandidates"].includes(checkbox.dataset.layerKey)) {
        console.log(`${checkbox.dataset.layerKey} checkbox changed`, checkbox.checked);
        renderRankingPanel();
        renderDetachedRankingLabels("layer toggle");
      }

      bringDataLayersToFront();
      updateActiveLayerCard();
    });
  });
}

function syncLayerVisibilityFromCheckboxes() {
  layerCheckboxes.forEach((checkbox) => {
    const layer = overlayLayers[checkbox.dataset.layerKey];
    if (!layer) return;

    if (checkbox.checked && !map.hasLayer(layer)) {
      layer.addTo(map);
    }

    if (!checkbox.checked && map.hasLayer(layer)) {
      map.removeLayer(layer);
    }
  });

  bringDataLayersToFront();
}

function logInitialLayerCheckboxState() {
  logLayerState("osmBase", "OSM");
  logLayerState("solarCandidates", "Solar Top 10 candidates");
  logLayerState("windCandidates", "Wind Top 10 candidates");
  logLayerState("transmissionLines", "Transmission lines");
}

function logLayerState(layerKey, label) {
  const checkbox = document.querySelector(`[data-layer-key="${layerKey}"]`);
  const layer = overlayLayers[layerKey];
  console.log(`${label} checkbox checked`, Boolean(checkbox?.checked));
  console.log(`${label} layer on map`, Boolean(layer && map.hasLayer(layer)));
}
function addSegmentedScaleControl() {
  const scaleControl = L.control({ position: "bottomleft" });

  scaleControl.onAdd = () => {
    const div = L.DomUtil.create("div", "segmented-scale-control");
    div.innerHTML = `
      <div class="scale-title" data-scale-title>Scale: 1 cm &asymp; -- km</div>
      <div class="segmented-scale-bar" aria-hidden="true">
        <span class="segmented-scale-segment dark"></span>
        <span class="segmented-scale-segment light"></span>
        <span class="segmented-scale-segment dark"></span>
      </div>
      <div class="segmented-scale-labels">
        <span>0</span>
        <span data-scale-one>--</span>
        <span data-scale-two>--</span>
        <span data-scale-three>-- km</span>
      </div>
    `;
    L.DomEvent.disableClickPropagation(div);
    L.DomEvent.disableScrollPropagation(div);
    scaleControl.container = div;
    return div;
  };

  scaleControl.addTo(map);

  function updateScale() {
    if (!scaleControl.container) return;

    // Measure one CSS centimetre on screen, then convert that map distance to kilometres.
    const mapSize = map.getSize();
    const oneCmPixels = getOneCentimetrePixels(scaleControl.container);
    const y = Math.max(20, mapSize.y - 40);
    const start = map.containerPointToLatLng([20, y]);
    const end = map.containerPointToLatLng([20 + oneCmPixels, y]);
    const oneCmKm = map.distance(start, end) / 1000;
    if (!Number.isFinite(oneCmKm) || oneCmKm <= 0) return;

    const roundedOneCmKm = getRoundedOneCentimetreDistance(oneCmKm);
    const labels = [roundedOneCmKm, roundedOneCmKm * 2, roundedOneCmKm * 3];

    scaleControl.container.querySelector("[data-scale-title]").textContent = `Scale: 1 cm \u2248 ${formatScaleLabel(roundedOneCmKm)} km`;
    scaleControl.container.querySelector("[data-scale-one]").textContent = formatScaleLabel(labels[0]);
    scaleControl.container.querySelector("[data-scale-two]").textContent = formatScaleLabel(labels[1]);
    scaleControl.container.querySelector("[data-scale-three]").textContent = `${formatScaleLabel(labels[2])} km`;
  }

  map.on("zoomend moveend", updateScale);
  map.whenReady(updateScale);
}

function getOneCentimetrePixels(container) {
  const probe = L.DomUtil.create("span", "scale-centimetre-probe", container);
  probe.style.width = "1cm";
  const pixels = probe.getBoundingClientRect().width;
  probe.remove();
  return pixels || 38;
}

function getRoundedOneCentimetreDistance(distanceKm) {
  const candidates = [0.1, 0.2, 0.5, 1, 2, 5, 10, 15, 20, 30, 50, 75, 100, 150, 200, 300, 500];
  return candidates.reduce((best, value) => (value <= distanceKm ? value : best), candidates[0]);
}

function formatScaleLabel(value) {
  if (value >= 10) return String(Math.round(value));
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function addMapLegendControl() {
  const legendControl = L.control({ position: "topright" });

  legendControl.onAdd = () => {
    const div = L.DomUtil.create("div", "map-legend-control");
    div.innerHTML = `
                  <h3>Map legend</h3>
      <div class="map-legend-section">
        <p>Ranking candidates</p>
        <span><i class="legend-dot solar"></i>Solar Top 10 candidates</span>
        <span><i class="legend-dot wind"></i>Wind Top 10 candidates</span>
      </div>
      <div class="map-legend-section">
        <p>Evidence layers</p>
        <span><i class="legend-swatch protected-area"></i>Protected areas</span>
        <span><i class="legend-swatch postgis-solar-area"></i>PostGIS solar suitability</span>
        <span><i class="legend-swatch postgis-wind-area"></i>PostGIS wind suitability</span>
        <span><i class="legend-line roads"></i>Roads</span>
        <span><i class="legend-line transmission"></i>Transmission lines</span>
        <span><i class="legend-dot weather-resource"></i>Weather/resource points</span>
        <span><i class="legend-dot postgis-point"></i>PostGIS GIR locations</span>
      </div>
    `;
    L.DomEvent.disableClickPropagation(div);
    L.DomEvent.disableScrollPropagation(div);
    return div;
  };

  legendControl.addTo(map);
}
function searchLocation() {
  const rawQuery = searchInput.value.trim();
  const query = normalizeLookupText(rawQuery);
  const location = NZ_LOCATIONS[query];

  console.log("search query", rawQuery);

  if (!location) {
    console.log("matched location label", "Not found");
    console.log("lat/lng/zoom used", null);
    searchMessage.textContent = "Location not found. Try Auckland, Wellington, Christchurch, Taupo, etc.";
    return;
  }

  map.invalidateSize();
  map.setView([location.lat, location.lng], location.zoom);
  L.popup()
    .setLatLng([location.lat, location.lng])
    .setContent(`<strong>${escapeHtml(location.label)}</strong>`)
    .openOn(map);

  console.log("matched location label", location.label);
  console.log("lat/lng/zoom used", { lat: location.lat, lng: location.lng, zoom: location.zoom });
  searchMessage.textContent = `Map centered on ${location.label}`;
}

function updateDashboardCards(mentions, girDisplay) {
  const energyCounts = countGirEnergyTypes(mentions);
  const solarCount = energyCounts.Solar || 0;
  const windCount = energyCounts.Wind || 0;
  const mixedCount = energyCounts.Mixed || 0;
  const renewableCount = energyCounts.Renewable || 0;

  document.getElementById("totalProjects").textContent = mentions.length;
  document.getElementById("solarProjects").textContent = solarCount;
  document.getElementById("windProjects").textContent = windCount;
  document.getElementById("highSuitabilityAreas").textContent = mixedCount;
  document.getElementById("girMentions").textContent = girDisplay.uniqueCoordinateCount;

  updateDashboardChart(solarCount, windCount, mixedCount, renewableCount);
}

function countGirEnergyTypes(mentions) {
  return mentions.reduce((counts, feature) => {
    const energyType = getGirEnergyType(feature.properties || {});
    counts[energyType] = (counts[energyType] || 0) + 1;
    return counts;
  }, {});
}

function updateDashboardChart(solarCount, windCount, mixedCount, renewableCount) {
  const maxValue = Math.max(solarCount, windCount, mixedCount, renewableCount, 1);
  updateBar("solarProjectsBar", "solarProjectsBarValue", solarCount, maxValue);
  updateBar("windProjectsBar", "windProjectsBarValue", windCount, maxValue);
  updateBar("girMentionsBar", "girMentionsBarValue", mixedCount, maxValue);
  updateBar("renewableGirBar", "renewableGirBarValue", renewableCount, maxValue);
}

function updateBar(barId, valueId, value, maxValue) {
  const bar = document.getElementById(barId);
  const label = document.getElementById(valueId);
  if (!bar || !label) return;

  bar.style.width = `${(value / maxValue) * 100}%`;
  label.textContent = value;
}

function updateDataStatus() {
  if (localContextStatus) localContextStatus.textContent = nzContextLayer ? "Loaded" : "Waiting";
  if (rankingCandidatesStatus) {
    rankingCandidatesStatus.textContent = allSolarCandidates.length && allWindCandidates.length ? "Loaded from local GeoJSON" : "Waiting";
  }
  if (evidenceLayersStatus) {
    evidenceLayersStatus.textContent = postgisExportStatus.loaded === postgisExportStatus.total && transmissionLineFeatureCount ? "Loaded" : postgisExportStatus.loaded > 0 || transmissionLineFeatureCount ? "Partial" : "Waiting";
  }
}

function hasValue(value) {
  return value !== undefined && value !== null && value !== "";
}

function updateActiveLayerCard() {
  const activeCount = Object.values(overlayLayers).filter((layer) => map.hasLayer(layer)).length;
  document.getElementById("activeLayers").textContent = activeCount;
}

function getActiveLayerNames() {
  return layerDefinitions()
    .filter((entry) => map.hasLayer(entry.layer))
    .map((entry) => entry.label);
}

function layerDefinitions() {
  return [
    { label: "Local NZ context", layer: nzContextLayer },
    { label: "OpenStreetMap online basemap", layer: osmBaseLayer },
    { label: "Solar Top 10 candidates", layer: solarCandidateLayer },
    { label: "Wind Top 10 candidates", layer: windCandidateLayer },
    { label: "Transmission lines", layer: overlayLayers.transmissionLines },
    { label: "PostGIS GIR locations", layer: overlayLayers.postgisGirLocations },
    { label: "Protected areas", layer: overlayLayers.protectedAreas },
    { label: "Roads", layer: overlayLayers.roads },
    { label: "PostGIS solar suitability", layer: overlayLayers.postgisSolarSuitability },
    { label: "Weather resource summary", layer: overlayLayers.weatherResourceSummary },
    { label: "PostGIS wind suitability", layer: overlayLayers.postgisWindSuitability }
  ].filter((entry) => entry.layer);
}

function syncLayerCheckboxes() {
  layerCheckboxes.forEach((checkbox) => {
    const layer = overlayLayers[checkbox.dataset.layerKey];
    if (layer) {
      checkbox.checked = map.hasLayer(layer);
    }
  });
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}















































































































