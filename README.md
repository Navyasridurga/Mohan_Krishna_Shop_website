# Mohan Krishna Juice & Fried Rice — Website

A full-stack website for a local juice & fast-food shop in Ramachandrapuram, Andhra Pradesh.

## Architecture

```
mohan-krishna-website/
├── backend/                 Express API (Node.js)
│   ├── config/db.js          SQLite connection (swap-in path for Postgres later)
│   ├── database/
│   │   ├── schema.sql         Table definitions (Postgres-compatible SQL)
│   │   └── seed.js            One-time script: creates admin user + sample menu/reviews
│   ├── controllers/           Business logic per resource (menu, orders, contact, auth)
│   ├── routes/                Route definitions + input validation rules
│   ├── middleware/            JWT auth guard, validation runner, error handler
│   ├── utils/                 asyncHandler, ApiError
│   ├── server.js              App entry point
│   └── .env.example
└── frontend/                 React + Vite + Tailwind
    ├── src/
    │   ├── api/                Axios client + one file per resource (menuApi, orderApi, ...)
    │   ├── context/AuthContext.jsx   Admin session state (token in localStorage)
    │   ├── components/          Reusable UI (Navbar, FoodCard, CallButton, ...)
    │   ├── components/admin/    Admin-only building blocks (forms, tables)
    │   └── pages/                One file per route (Home, Menu, Contact, AdminDashboard, ...)
    └── .env.example
```

### How the pieces talk to each other

1. The React app (port 5173 in dev) calls the Express API (port 5000) over HTTP using `axios`,
   with the base URL set in `frontend/.env` (`VITE_API_BASE_URL`).
2. Express routes validate input with `express-validator`, then hand off to a controller.
3. Controllers run parameterized SQL queries against SQLite via `better-sqlite3`. All SQL is
   written in a Postgres-compatible subset — to move to Postgres later, only `backend/config/db.js`
   needs to change to a `pg` Pool (same `db.prepare(...).run/get/all` shape can be re-implemented
   as thin wrappers around `pool.query`).
4. Every response follows one shape: `{ success: boolean, data?, message?, details? }`, so the
   frontend has one predictable way to handle success and error cases.

### Authentication

- Admin credentials are **never stored or hard-coded in frontend code**. The only admin account is
  created once by `backend/database/seed.js`, which reads `ADMIN_USERNAME` / `ADMIN_PASSWORD` from
  `backend/.env` and stores a **bcrypt hash** of the password in SQLite.
- `POST /api/auth/login` checks the hash and, on success, signs a short-lived JWT (`JWT_SECRET`,
  `JWT_EXPIRES_IN` in `.env`). The token is returned to the browser and kept in `localStorage`.
- Every admin-only request (`add/edit/delete menu item`, `view orders`, `change order status`) sends
  `Authorization: Bearer <token>`. The `requireAdmin` middleware verifies the JWT before the request
  reaches the controller — the frontend has no way to bypass this, since verification happens
  server-side.
- The login endpoint is rate-limited (10 attempts / 15 minutes) to slow down brute-forcing.

### How orders work

1. On the **Menu** page, customers tap "Add to order" on any item, building a running cart in
   React state.
2. Filling in name + phone and hitting **Place Order** sends `POST /api/orders`. The backend
   re-checks each item is still available, snapshots its current name & price into `order_items`
   (so a later price change doesn't rewrite history), computes the total server-side, and saves
   everything in one SQLite transaction.
3. The order appears immediately in the **Admin Dashboard → Orders** tab, where the shop owner can
   move it through `pending → confirmed → preparing → ready → completed` (or `cancelled`).
4. Customers can also skip the order form entirely and tap **Order on WhatsApp**, which opens
   WhatsApp with the cart pre-filled as a message — useful when there's no data connection or the
   owner prefers to confirm by chat.

## Running it locally

You'll need [Node.js 18+](https://nodejs.org/) installed. This project was scaffolded without
network access, so dependencies have **not** been installed yet — run `npm install` in each folder
as shown below.

### 1. Backend

```bash
cd backend
cp .env.example .env        # edit ADMIN_USERNAME / ADMIN_PASSWORD / JWT_SECRET as you like
npm install
npm run seed                 # creates the database file, admin user, and sample menu items
npm run dev                  # starts the API on http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev                  # starts the site on http://localhost:5173
```

Open http://localhost:5173 in your browser. The admin dashboard is at `/admin/login` — sign in
with the `ADMIN_USERNAME` / `ADMIN_PASSWORD` you set in `backend/.env` before seeding.

### Menu images

The seeded menu items reference paths like `/images/mosambi.jpg`. Add real photos to
`frontend/public/images/` using those exact filenames (see `backend/database/seed.js` for the
full list), or update each item's Image URL from the admin dashboard once it's live.

## Moving to PostgreSQL later

1. `npm install pg` in `backend/`.
2. Replace the contents of `backend/config/db.js` with a `pg.Pool` connected via `DATABASE_URL`,
   exposing the same `db.prepare(sql).get/all/run(...params)` interface (or refactor controllers
   to use `pool.query` directly — the SQL itself needs no changes).
3. Run `schema.sql` against Postgres (change `AUTOINCREMENT` → `SERIAL`, `TEXT` timestamps →
   `TIMESTAMP`, as noted in the file's comments).

## Notes on this build

- Passwords are hashed with bcrypt; JWTs are short-lived and verified server-side on every
  protected request.
- All forms (order, contact, admin login, add/edit menu item) show loading, error, and success/empty
  states — nothing is faked.
- The design intentionally avoids generic "SaaS template" styling: a mango/papaya/lime/deep-teal
  palette, Baloo 2 for display type, and one deliberate hero animation rather than fades on every
  section.
