# NZ Renewable Energy Suitability Explorer

A static Leaflet WebGIS dashboard for renewable energy suitability and candidate site exploration in New Zealand. The final presentation version is local-data-only and uses a simplified 11-layer sidebar.

The map includes a custom three-segment 1 cm cartographic scale bar, a top-right static map legend, local Leaflet files, and local GeoJSON/CSV-free ranking data. GeoServer, WFS, WMS, `/geoserver/` proxying, Node, npm, React, Google Maps, ESRI, and Mapbox are not required.

## What is included

- `index.html` - dashboard layout using local Leaflet files
- `styles.css` - dashboard, sidebar, map legend, map, scale bar, and details panel styling
- `app.js` - Leaflet map setup, local GeoJSON loading, filters, search, dashboard cards, ranking labels, and details panel
- `server.py` - local static web server on port 8000
- `lib/leaflet/leaflet.css` and `lib/leaflet/leaflet.js` - local Leaflet files for VM demos
- `data/nz_context.geojson` - local New Zealand regional context layer
- `data/site_selection_candidates.geojson` - final integrated Solar/Wind Top 10 ranking result
- `data/transmission_lines.geojson` - infrastructure/grid evidence layer
- `data/gir_locations.geojson` - PostGIS-exported GIR evidence points
- `data/protected_areas.geojson` - protected area and constraint evidence polygons
- `data/roads.geojson` - road access/reference evidence lines
- `data/solar_suitability.geojson` - solar suitability evidence polygons
- `data/weather_resource_summary.geojson` - weather/resource evidence points
- `data/wind_suitability.geojson` - wind suitability evidence polygons
- `data/renewable_energy_mentions.geojson` - GIR article data used internally for dashboard summary counts
- `data/sample_projects.geojson` and `data/sample_suitability.geojson` - old backup/sample files, not active frontend layers

## Run locally

1. Open CMD or PowerShell.
2. `cd` into the project folder.
3. Run:

```powershell
py server.py
```

4. Open this address in a browser:

```text
http://localhost:8000
```

Keep the terminal window open while using the app. Press `Ctrl+C` to stop the server.

`server.py` only serves static local files and adds `Cache-Control: no-store` for local development.

## Final 11-layer UI

Shown by default:

- Local NZ context
- OpenStreetMap online basemap

Available but unchecked by default:

- Solar Top 10 candidates
- Wind Top 10 candidates
- Transmission lines
- PostGIS GIR locations
- Protected areas
- Roads
- PostGIS solar suitability
- Weather resource summary
- PostGIS wind suitability

The 11 sidebar layers are grouped conceptually as:

- 2 context/base layers
- 2 ranking candidate layers
- 7 supporting evidence layers

Removed from the final visible layer list for presentation clarity:

- GIR heatmap
- Final top solar sites
- Final top wind sites
- GIR renewable energy existing points as a visible map layer
- Most suitable wind farm areas
- Most suitable solar farm areas

## Ranking candidates

`Solar Top 10 candidates` and `Wind Top 10 candidates` both come from one local GeoJSON file:

```text
data/site_selection_candidates.geojson
```

The frontend reads Point features, normalises `energy_type` to Solar or Wind, sorts by `rank`, and keeps the Top 10 records for each energy type. The ranking panel, detached labels, leader lines, and candidate details panel all use this final GeoJSON source.

## Supporting evidence layers

The ranking result is explained by seven optional local evidence layers:

- `data/gir_locations.geojson` - GIR evidence points
- `data/protected_areas.geojson` - protected area/constraint evidence
- `data/roads.geojson` - road access/reference evidence
- `data/solar_suitability.geojson` - solar suitability evidence
- `data/weather_resource_summary.geojson` - weather/resource evidence
- `data/wind_suitability.geojson` - wind suitability evidence
- `data/transmission_lines.geojson` - infrastructure/grid evidence

These evidence layers are unchecked by default. Missing optional evidence files will show warnings or Partial/Missing status without stopping the ranking candidates from loading.

## Legend and controls

The top-right map legend is static and grouped into:

- Ranking Candidates
- Evidence Layers

Layer visibility is controlled only from the sidebar checkboxes. Local NZ context remains a map layer and sidebar checkbox, but it is not shown in the top-right legend.

The map also includes a custom metric 1 cm segmented scale bar. Roads are styled as bright blue lines, and transmission lines are styled as solid purple/magenta local GeoJSON lines.

## Data status panel

The Data status panel tracks the final simplified structure:

- `Local context: Loaded`
- `Ranking candidates: Loaded from local GeoJSON`
- `Evidence layers: Loaded` or `Partial`
## Filters and interactions

The frontend currently uses Energy type and Region filters. These filters affect ranking candidates and dashboard summaries where applicable.

The Top candidate rankings panel supports:

- All
- Solar
- Wind

Solar and Wind Top 10 candidates use detached rank labels and leader lines when their layer checkboxes are enabled. Clicking a rank label, map point, or ranking row opens a draggable candidate details panel that is positioned away from the top-right map legend.

## Browser console checks

Open the browser console after loading `http://localhost:8000`.

Expected messages include:

- `context feature count`
- `transmission line feature count`
- `Loading final site_selection_candidates GeoJSON ranking dataset`
- `site_selection_candidates loaded`
- `PostGIS exported layer load status`

## Notes for beginners

This project uses plain HTML, CSS, JavaScript, local Leaflet files, and Python's standard library web server. There is no React, bundler, Node/npm build step, live database connection, or GeoServer dependency in the frontend.





