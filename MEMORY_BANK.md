# Memory Bank — QOS ET Quality Report

**Last Updated**: 2026-01-17  
**Purpose**: Fast, accurate context for continuing development and recovery.

---

## Product intent (what this app is)

QOS ET Quality Report is a Next.js dashboard for **manufacturing quality KPIs** (complaints/notifications, deliveries, PPM) with **AI-assisted analysis** (AI Summary + I AM Q). It is designed for multi-site, monthly reporting with incremental uploads.

---

## Core user workflows

### 1) Upload → KPIs → Dashboard update

- Users upload Excel files on `/upload` per category (complaints, deliveries, plants, etc.)
- After uploads, KPIs are calculated and stored for consumption by all pages
- KPI changes are broadcast via a custom event so charts/pages refresh immediately

### 2) Filter by PLANT + time

- The right-side filter panel supports **multi-select plants** and date filtering.
- Empty plant selection means **“all plants”** (no plant filter applied).

### 3) AI Management Summary (`/ai-summary`)

- Uses filtered KPI data + displayed tile metrics (when available)
- Produces: Summary, Trends, Risks/Anomalies, Opportunities, Recommended Actions
- Backend guarantees **≥ 3 recommended actions** (monitoring actions if performance is stable).

---

## Data sources & storage (authoritative)

### Excel inputs

- **Complaints/Notifications**: Q1/Q2/Q3 (and D*/P* on dedicated pages)
- **Deliveries**: inbound/outbound deliveries (Supplier/Customer)
- **Plants master**: “Webasto ET Plants.xlsx” provides plant metadata (city, abbreviations, country)

### Browser persistence

- **IndexedDB (large datasets)**:
  - DB: `qos-et-datasets`
  - Stores: `complaints`, `deliveries`
  - Reason: avoids `localStorage` quota errors for large uploads
- **localStorage (small state + KPIs)**:
  - `qos-et-kpis`: aggregated monthly KPIs (array of `MonthlySiteKpi`)
  - `qos-et-global-ppm`: global PPM object
  - `qos-et-upload-history`: audit log of uploads
  - `qos-et-upload-summary-{uploadId}` / `qos-et-change-history-{uploadId}`
  - `qos-et-manual-kpis`: manual KPI entries (template)
  - UI state: `qos-et-language`, `qos-et-role`, `qos-et-sidebar-collapsed`, `qos-et-filters-collapsed`

### Cross-component update signal

- Event: `qos-et-kpi-data-updated`
- Dispatched after KPI calculation so Dashboard + other pages refresh automatically.

---

## Key backend endpoints

- `GET /api/plants`: plant master data (used for abbreviations/city/country across UI + AI prompts)
- `POST /api/upload`: parse uploaded files (by type)
- `POST /api/ai/interpret-kpis`: AI insights for AI Summary page (includes validation + minimum actions)

---

## Recent critical implementation decisions (2026-01-17)

- Switched parsed uploads storage from `localStorage` to **IndexedDB** to prevent quota errors.
- Upload UI uses a custom **Step 1: Select data** / **Step 2: Upload** control (native file input hidden).
- PLANT filter now supports **true multi-select** toggling.
- AI backend ensures **recommendedActions length ≥ 3**, including monitoring/governance actions when stable.

---

## Troubleshooting quick hits

- **Upload fails with quota error**: ensure running version includes IndexedDB storage. If needed, clear IndexedDB `qos-et-datasets`.
- **Dashboard doesn’t reflect uploads**: verify KPIs exist in `localStorage` (`qos-et-kpis`) and the `qos-et-kpi-data-updated` event is dispatched after recalculation.
- **Mailto button does nothing**: Windows may not have a default `mailto:` handler; also keep mailto bodies short (URL length limits).

