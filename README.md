# EcomVision — Admin Dashboard

A full-stack administrative dashboard for an e-commerce dataset. The application
presents sales analytics, customer and transaction records, product catalogue
data, and geographic distribution, backed by a REST API over MongoDB.

The repository is a two-package monorepo: a React single-page application in
`admin/` and an Express API in `backend/`.

---

## Contents

- [Features](#features)
- [Technology stack](#technology-stack)
- [Repository structure](#repository-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment variables](#environment-variables)
- [Seeding the database](#seeding-the-database)
- [Running the application](#running-the-application)
- [Available scripts](#available-scripts)
- [API reference](#api-reference)
- [Data models](#data-models)
- [Frontend architecture](#frontend-architecture)
- [Known limitations](#known-limitations)
- [License](#license)

---

## Features

**Dashboard** — Aggregate key performance indicators (total customers, daily,
monthly and yearly sales) alongside an annual sales line chart, a paginated
transaction grid, and a sales-by-category breakdown.

**Client-facing data**

- **Products** — Card-based catalogue with expandable per-product statistics.
- **Customers** — Tabular customer directory with role indicators.
- **Transactions** — Server-side paginated, sortable and searchable grid.
- **Geography** — Choropleth map of users by country.

**Sales analytics**

- **Overview** — Annual sales or units, selectable by view.
- **Daily** — Date-range-filtered daily series.
- **Monthly** — Month and year selection over the same series.
- **Breakdown** — Sales distribution by product category.

**Management**

- **Admin** — Directory of users holding the `admin` role.
- **Performance** — Affiliate sales attributed to a given user.

**Cross-cutting**

- Light and dark palettes derived from a single token set, toggled at runtime.
- Collapsible sidebar navigation grouped by section.
- Shared data-grid component providing consistent theming, a custom column menu,
  and a search toolbar.
- Loading skeletons for chart-heavy views.

---

## Technology stack

### Frontend (`admin/`)

| Concern        | Package                                 |
| -------------- | --------------------------------------- |
| Framework      | React 19                                |
| Build tool     | Vite 8, `@vitejs/plugin-react` 6        |
| UI components  | Material UI 9, MUI X Data Grid 9        |
| Charts         | Nivo 0.99 (`bar`, `geo`, `line`, `pie`) |
| State and data | Redux Toolkit 2 with RTK Query          |
| Routing        | React Router 7                          |
| Date input     | React Datepicker 9                      |
| Testing        | Vitest 4, Testing Library, jsdom        |
| Linting        | ESLint 10                               |

### Backend (`backend/`)

| Concern        | Package              |
| -------------- | -------------------- |
| Runtime        | Node.js (ES modules) |
| HTTP framework | Express 5            |
| ODM            | Mongoose 9           |
| Security       | Helmet 8, CORS       |
| Logging        | Morgan 1             |
| Configuration  | dotenv 17            |
| Country codes  | `country-iso-2-to-3` |

---

## Repository structure

```
.
├── admin/                          React single-page application
│   └── src/
│       ├── assets/                 Static assets and choropleth feature data
│       ├── components/
│       │   ├── common/             Layout primitives, sidebar, navbar, data grid
│       │   ├── module/             Charts, stat cards, grid toolbars and menus
│       │   └── templates/          Loading skeletons
│       ├── hooks/                  Chart colour and series-derivation hooks
│       ├── pages/                  Route components
│       ├── state/                  RTK Query API definition and global slice
│       ├── styles/                 Supplementary stylesheets
│       ├── utils/                  Number, currency and date formatters
│       ├── theme.js                Palette tokens and MUI theme factory
│       └── index.css               Global resets and scrollbar styling
│
└── backend/                        Express REST API
    ├── config/mongodb.js           Connection factory with startup guards
    ├── controllers/                Route handlers by domain
    ├── data/index.js               Seed dataset
    ├── models/                     Mongoose schemas
    ├── routes/                     Router definitions
    └── server.js                   Application entry point
```

---

## Prerequisites

- **Node.js** — Vite 8 declares `^20.19.0 || >=22.12.0`. The same runtime serves
  the API.
- **MongoDB** — A local instance or an Atlas cluster. The connection string and
  database name are supplied via environment variables.

---

## Installation

Clone the repository, then install dependencies for each package
independently. The two packages are not linked by a workspace configuration.

```bash
git clone <repository-url>
cd Admin-dashboard

# API
cd backend
npm install

# Client
cd ../admin
npm install
```

---

## Environment variables

### `backend/.env`

| Variable      | Required | Description                                                                                     |
| ------------- | -------- | ----------------------------------------------------------------------------------------------- |
| `MONGODB_URI` | Yes      | MongoDB connection string. Startup fails if unset.                                              |
| `DB_NAME`     | Yes      | Target database name. Startup fails if unset, or if the connected database name does not match. |
| `PORT`        | No       | Listening port. Defaults to `4000`.                                                             |

### `admin/.env`

| Variable           | Required | Description                                                                                                         |
| ------------------ | -------- | ------------------------------------------------------------------------------------------------------------------- |
| `VITE_BACKEND_URL` | Yes      | Base URL of the API, used as the RTK Query `baseUrl`. For a local API on the default port, `http://localhost:4000`. |

Environment files are excluded from version control by `.gitignore`.

---

## Seeding the database

`backend/data/index.js` exports six datasets: `dataUser`, `dataProduct`,
`dataProductStat`, `dataTransaction`, `dataOverallStat` and `dataAffiliateStat`.

The seeding block at the bottom of `backend/server.js` is commented out by
design, so that a restart cannot duplicate records. To populate an empty
database, uncomment the imports and the relevant `insertMany` calls, start the
server once, then comment them out again.

Transactions are seeded through an intermediate step that maps product
references onto each transaction before insertion; keep the ordering in that
block intact when re-enabling it.

---

## Running the application

Two processes are required. Start the API first, as the client issues requests
on mount.

```bash
# Terminal 1 — API with file watching
cd backend
npm run server

# Terminal 2 — Vite development server
cd admin
npm run dev
```

The API logs the port it binds to and the name of the database it connected to.
`GET /` returns a plain-text health response.

To produce a production build of the client:

```bash
cd admin
npm run build     # emits to admin/dist
npm run preview   # serves the build locally
```

---

## Available scripts

### `admin/`

| Script            | Action                                 |
| ----------------- | -------------------------------------- |
| `npm run dev`     | Start the Vite development server.     |
| `npm run build`   | Produce a production build in `dist/`. |
| `npm run preview` | Serve the production build locally.    |
| `npm run lint`    | Run ESLint across the package.         |

### `backend/`

| Script           | Action                                      |
| ---------------- | ------------------------------------------- |
| `npm start`      | Run the server with Node.                   |
| `npm run server` | Run the server under nodemon with watching. |

### Repository root

| Script                 | Action                                  |
| ---------------------- | --------------------------------------- |
| `npm run pretty`       | Format the repository with Prettier.    |
| `npm run check-update` | Report available dependency updates.    |
| `npm run update-patch` | Apply patch-level dependency updates.   |
| `npm run update-minor` | Apply minor-level dependency updates.   |
| `npm run update`       | Apply all available dependency updates. |

---

## API reference

All routes are read-only `GET` endpoints. Successful responses carry
`success: true` alongside the payload; failures return `success: false` with a
`message`.

### General — `/api/general`

| Endpoint     | Description                                                                                                                                                        |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `/user/:id`  | Single user document.                                                                                                                                              |
| `/dashboard` | Composite payload under `salesStats`: totals, monthly and daily series, category breakdown, the current month and day slices, and the 50 most recent transactions. |

### Client — `/api/client`

| Endpoint        | Description                                                                                                                                                                                                                          |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `/products`     | Products joined with their per-product statistics via a `$lookup` aggregation stage.                                                                                                                                                 |
| `/customers`    | Users with the `user` role.                                                                                                                                                                                                          |
| `/transactions` | Paginated transactions. Query parameters: `page`, `pageSize`, `sort` (JSON, e.g. `{"field":"userId","sort":"desc"}`) and `search`. Search matches `userId` and `cost` case-insensitively; the response includes `totalTransactions`. |
| `/geography`    | User counts keyed by ISO-3 country code, formatted for the choropleth.                                                                                                                                                               |

### Management — `/api/management`

| Endpoint           | Description                                                                                                                                                                                                     |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/admin`           | Users with the `admin` role.                                                                                                                                                                                    |
| `/performance/:id` | Affiliate sale transactions for a user, resolved through an aggregation pipeline joining affiliate statistics to transactions. Returns `400` for a malformed identifier and `404` when the user does not exist. |

### Sales — `/api/sales`

| Endpoint | Description                   |
| -------- | ----------------------------- |
| `/sales` | Overall statistics documents. |

---

## Data models

| Model                | Purpose                                                                                  |
| -------------------- | ---------------------------------------------------------------------------------------- |
| `UserModel`          | Name, email, password, location fields, occupation, phone number, transactions and role. |
| `ProductModel`       | Name, price, description, category, rating and supply.                                   |
| `ProductStatModel`   | Yearly totals plus monthly and daily series for a single product.                        |
| `TransactionModel`   | User reference, cost, and an array of product references with quantities.                |
| `OverallStatModel`   | Aggregate totals per year, monthly and daily series, and a category-keyed sales map.     |
| `AffiliateStatModel` | Links a user to the transactions attributed to them as affiliate sales.                  |

All schemas enable Mongoose timestamps.

---

## Frontend architecture

**Theming.** `src/theme.js` defines a dark token set and derives the light set by
reversing each scale. `themeSettings(mode)` returns a complete theme
configuration, including component-level overrides that publish scrollbar
colours as CSS custom properties. The active mode is held in the Redux global
slice and toggled from the navbar.

**Data access.** A single RTK Query service in `src/state/api.js` declares every
endpoint and its cache tags. Components consume the generated hooks directly;
there are no manual fetch calls or thunks.

**Data grids.** `CustomDataGrid.jsx` exports two components. `DataGridSurface`
renders the themed grid alone and is intended for embedding inside an existing
layout. The default export composes a page heading and outer spacing around that
surface, and is used by the full-page grid routes.

**Charts.** Nivo components are wrapped in local modules that own their
configuration, with colour selection and series derivation extracted into hooks
under `src/hooks/` so the same series can be shared across the overview, daily
and monthly views.

**Layout.** `pages/Layout.jsx` renders the persistent sidebar and navbar around a
React Router outlet. Navigation entries are declared as a single array with
section separators.

---

## Known limitations

The following are properties of the current implementation rather than
outstanding defects, and are documented so they are not mistaken for bugs.

- **The dashboard endpoint targets a fixed period.** `getDashboardStats` pins the
  reporting month, year and day to constants matching the seed dataset. These
  need to be derived from the current date before the endpoint is used against
  live data.
- **The active user is fixed.** `state/globalSlice.js` holds a hard-coded
  `userId`, which the performance view uses. Authentication is not implemented.
- **The API is unauthenticated.** All endpoints are publicly readable, and no
  write operations are exposed.
- **Seeding is manual.** There is no dedicated seed script; the process is the
  commented block described above.

---

## License

Released under the MIT License. See [`LICENSE`](./LICENSE) for the full text.
