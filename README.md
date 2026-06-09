# Smart Delivery Zone Clustering

> **ITM Skills University | DSA-3 | B.Tech CSE 2023-27 | Semester VI**
> 
> Topic: **Union-Find (Disjoint Set Union)** | Industry: **Logistics**

A full-stack MERN web application that demonstrates how the **Union-Find** data structure can be applied to automatically cluster delivery zones based on their route connectivity.

---

## 🎯 Why is this helpful?

This project solves a major problem for delivery companies, e-commerce businesses, and courier services: **efficient fleet assignment and network visibility.**

### 1. Grouping Connected Zones for Fleet Management
Instead of assigning drivers randomly across a city, businesses can use this tool to see which delivery zones are geographically connected by routes. The algorithm automatically groups these connected zones into distinct **"Clusters"**. 
* **The Benefit:** A manager can assign a specific fleet of drivers strictly to "Cluster 1", knowing they can reach all zones within that cluster without ever needing to cross over into another team's territory. This saves massive amounts of fuel and time.

### 2. Identifying Isolated "Dead Zones"
If a company expands to a new neighborhood, the dashboard immediately flags it as an **Isolated Zone** until a route is connected to it. 
* **The Benefit:** It acts as a warning system for logistics managers, telling them: *"Hey, you have a delivery region here, but no drivers can access it yet because no routes are connected to the main network!"*

### 3. Visualizing Complex Data
Logistics networks can have thousands of overlapping nodes and routes, which is impossible to track on a spreadsheet. 
* **The Benefit:** The app turns raw data into interactive graphs, pie charts, and visualizations, making it instantly obvious to stakeholders how healthy and connected their delivery infrastructure is. 

---

## 🚀 Features

- **Admin Authentication** — JWT-based login (hardcoded credentials for demo)
- **Zone Management** — Add, search, and delete delivery zones
- **Route Management** — Connect zones with delivery routes using dropdowns
- **Cluster Analysis** — Run Union-Find on all zones/routes and view color-coded clusters
- **DSA Visualization** — Animated React Flow graph showing Union-Find step-by-step
- **Reports** — Cluster analytics with CSV export
- **DSA Explanation** — Academic page covering Union-Find concepts and complexity

---

## 🛠 Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React (Vite), Tailwind CSS        |
| Routing    | React Router v6                   |
| HTTP       | Axios                             |
| Charts     | Recharts                          |
| Graph      | React Flow (`@xyflow/react`)      |
| Toasts     | React Hot Toast                   |
| Backend    | Node.js, Express.js               |
| Database   | MongoDB (local), Mongoose         |
| Auth       | JWT (`jsonwebtoken`)              |
| Icons      | Lucide React                      |

---

## 📁 Folder Structure

```
Delivery-Clustering/
├── backend/
│   ├── algorithms/unionFind.js    ← Core DSU implementation
│   ├── config/db.js
│   ├── controllers/
│   ├── middleware/authMiddleware.js
│   ├── models/Zone.js + Route.js
│   ├── routes/
│   ├── seed/seedData.js
│   ├── services/clusterService.js
│   ├── .env
│   └── server.js
└── frontend/
    └── src/
        ├── components/ui/
        ├── hooks/
        ├── layouts/
        ├── pages/
        ├── services/
        └── utils/
```

---

## ⚡ Installation & Setup

### Prerequisites
- Node.js ≥ 18
- MongoDB running locally on port 27017

### 1. Clone & Install

```bash
# Install backend deps
cd backend
npm install

# Install frontend deps
cd ../frontend
npm install
```

### 2. Configure Environment

The `.env` file in `backend/` is pre-configured for local development:

```env
PORT=4000
MONGO_URI=mongodb://localhost:27017/smart_delivery_clustering
JWT_SECRET=smartdelivery_dsa_secret_key_2024
JWT_EXPIRE=7d
ADMIN_EMAIL=admin@delivery.com
ADMIN_PASSWORD=admin123
```

### 3. Seed Database

```bash
cd backend
npm run seed
```

This creates **15 zones** and **13 routes** designed to produce:
- 🟣 **Large cluster** — 8 Mumbai core zones
- 🔵 **Small cluster** — Navi Mumbai + Kurla (2 zones)
- 🟢 **Medium cluster** — 4 Pune zones
- 🔴 **Isolated zone** — Borivali (no routes)

### 4. Run the App

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:4000

---

## 🔐 Login Credentials

```
Email:    admin@delivery.com
Password: admin123
```

---

## 🔌 API Endpoints

| Method | Endpoint                   | Auth | Description             |
|--------|----------------------------|------|-------------------------|
| POST   | `/api/auth/login`          | No   | Admin login             |
| GET    | `/api/auth/me`             | Yes  | Current admin info      |
| GET    | `/api/zones`               | Yes  | Get all zones           |
| POST   | `/api/zones`               | Yes  | Add zone                |
| DELETE | `/api/zones/:id`           | Yes  | Delete zone + routes    |
| GET    | `/api/routes`              | Yes  | Get all routes          |
| POST   | `/api/routes`              | Yes  | Add route               |
| DELETE | `/api/routes/:id`          | Yes  | Delete route            |
| POST   | `/api/clusters/generate`   | Yes  | Run DSU, get clusters   |
| GET    | `/api/clusters`            | Yes  | Last cluster result     |
| GET    | `/api/reports`             | Yes  | Full analytics report   |

---

## 🗄 Database Schema

### Zone
```js
{
  name:      String (required),
  city:      String (required),
  zoneCode:  String (required, unique),
  createdAt: Date
}
```

### Route
```js
{
  sourceZone:      ObjectId → Zone,
  destinationZone: ObjectId → Zone,
  createdAt:       Date
}
```

---

## 🧠 Union-Find Algorithm

Located in `backend/algorithms/unionFind.js`.

### Key Methods

| Method | Description | Complexity |
|--------|-------------|------------|
| `find(x)` | Path compression find | O(α(n)) |
| `union(x, y)` | Union by rank merge | O(α(n)) |
| `connected(x, y)` | Same set check | O(α(n)) |
| `getClusters()` | Get all disjoint sets | O(n·α(n)) |

### How Clustering Works

1. Each zone maps to an integer index (0 to n-1)
2. `UnionFind(n)` initialized — each zone in its own set
3. For each route `(source, destination)` → `union(src, dst)` called
4. `getClusters()` groups indices by shared root
5. Indices mapped back to zone objects and returned to frontend

### Time Complexity
- α(n) = Inverse Ackermann function
- For all practical n, α(n) ≤ 5 → effectively **O(1) per operation**

---

## 📸 Screenshots

| Page | Description |
|------|-------------|
| Login | Dark glassmorphism login with demo credentials |
| Dashboard | Stat cards + Recharts pie/bar charts |
| Zones | Searchable table with add/delete |
| Routes | Zone dropdown connector with route table |
| Clusters | Color-coded cluster cards with Generate button |
| Visualization | React Flow animated Union-Find graph |
| Reports | Analytics + CSV export |
| DSA Explanation | Academic content with complexity table |

---

## 👨‍💻 Author

B.Tech CSE 2023-27 · ITM Skills University · DSA-3 Project
