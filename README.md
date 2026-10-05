# antrepriznodwes

**ANTREPRIZ NODWES** — construction supplies web application (MVP Phase 1 UI prototype).

React + TypeScript + Vite single-page app with Tailwind CSS, based on the MVP specification for a Netlify-hosted construction store (catalog, cart, checkout with pickup/delivery, notifications, and admin screens using mock in-memory data).

## Location

Project path: `~/Documents/Projects/WebApp/antrepriznodwes`  
(On this cloud environment that resolves to `/home/ubuntu/Documents/Projects/WebApp/antrepriznodwes`.)

## Run locally

```bash
cd ~/Documents/Projects/WebApp/antrepriznodwes
npm install
npm run dev
```

Open [http://127.0.0.1:43123](http://127.0.0.1:43123).

## Languages

French (**FR**) is the default interface language. Use the **FR | EN** toggle in the header to switch to English. The choice is saved in `localStorage`.

## Build

```bash
npm run build
npm run preview
```

## Accounts (demo)

Browse as a **guest** by default. Use **Se connecter / Log in** in the header.

| Username   | Password | Role     | After login  |
|------------|----------|----------|--------------|
| `user1`    | `user1`  | Customer | `/account`   |
| `user2`    | `user2`  | Customer | `/account`   |
| `ano_admin`| `admin`  | Admin    | `/admin`     |

New customers can **sign up** with a unique username (stored locally in the browser for this MVP).

Publishing a new product from Admin creates a customer notification and adds the item to the catalog.

## Next phases (from MVP doc)

- PostgreSQL schema and Netlify Functions for products, orders, inventory, and notifications
- Managed authentication for customers and admins
- GitHub → Netlify deployment with environment variables
