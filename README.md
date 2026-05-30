# AniVerse 🌌

A professional anime discovery platform built with React + Vite (frontend) and Node.js + Express + MongoDB (backend), powered by the [Jikan API](https://jikan.moe) (MyAnimeList unofficial API).

---

## ✨ Features

- **Home Page** — Hero banner, trending/seasonal/movie rows, infinite-scroll grid
- **Search** — Real-time search with debounce, suggestion dropdown, type & filter chips
- **Anime Detail** — Full info, trailer embed, characters, recommendations, related anime
- **Authentication** — JWT signup/login, protected routes, persistent sessions
- **Favorites & Watchlist** — Add/remove, watch-status tracking, stored in MongoDB
- **Recently Viewed** — Automatically recorded per session
- **Profile Page** — Stats, history, account management
- **Dark Anime UI** — Glassmorphism, neon glows, skeleton loaders, toast notifications

---

## 🗂 Folder Structure

```
aniverse/
├── frontend/               # React + Vite + Tailwind
│   └── src/
│       ├── components/
│       │   ├── anime/      # AnimeCard, AnimeRow, AnimeGrid, HeroSection
│       │   ├── layout/     # Navbar, Footer
│       │   └── ui/         # SkeletonCard
│       ├── context/        # AuthContext, AnimeContext
│       ├── hooks/          # useDebounce, useInfiniteScroll, useLocalStorage
│       ├── layouts/        # MainLayout
│       ├── pages/          # All page components
│       ├── routes/         # ProtectedRoute
│       └── services/       # jikanApi.js, api.js (backend client)
│
└── backend/                # Node.js + Express + MongoDB
    ├── config/             # database.js
    ├── controllers/        # authController.js, userController.js
    ├── middleware/         # auth.js (JWT), errorHandler.js
    ├── models/             # User.js (Mongoose)
    ├── routes/             # auth.js, users.js
    └── server.js           # Entry point
```

---

### 1. Clone & Install

```bash
git clone https://github.com/your-username/aniverse.git
cd aniverse

# Install backend deps
cd backend && npm install

# Install frontend deps
cd ../frontend && npm install
```

---

### 2. Configure Environment Variables

**Backend** — copy and edit:
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/aniverse
JWT_SECRET=your_super_secret_key_change_this   # ← change this!
JWT_EXPIRES_IN=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

**Frontend** — copy and edit:
```bash
cd frontend
cp .env.example .env
```

Edit `frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_JIKAN_BASE_URL=https://api.jikan.moe/v4
```

---

### 3. Run Locally

Open **two terminal windows**:

**Terminal 1 — Backend:**
```bash
cd aniverse/backend
npm run dev       # uses nodemon for hot-reload
# Server starts at http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd aniverse/frontend
npm run dev
# App starts at http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/login` | Login user | ❌ |
| GET | `/api/auth/profile` | Get current user | ✅ |

### Users
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/users/favorites` | Get favorites | ✅ |
| POST | `/api/users/favorites` | Add to favorites | ✅ |
| DELETE | `/api/users/favorites/:malId` | Remove favorite | ✅ |
| GET | `/api/users/watchlist` | Get watchlist | ✅ |
| POST | `/api/users/watchlist` | Add to watchlist | ✅ |
| DELETE | `/api/users/watchlist/:malId` | Remove from watchlist | ✅ |
| PATCH | `/api/users/watchlist/:malId` | Update watch status | ✅ |
| GET | `/api/users/history` | Get view history | ✅ |
| POST | `/api/users/history` | Record view | ✅ |

### Health
```
GET /api/health  →  { status: "ok", timestamp: "...", env: "development" }
```

---

## 🏗 Build for Production

**Frontend:**
```bash
cd frontend
npm run build
# Output in frontend/dist/
```

**Backend:**
```bash
# Set NODE_ENV=production in .env
cd backend
npm start
```

---

## ☁️ Deployment

### Vercel (Frontend) + Render (Backend)

**Frontend → Vercel:**
1. Push `frontend/` to a GitHub repo
2. Import to [vercel.com](https://vercel.com)
3. Set environment variables:
   - `VITE_API_BASE_URL` = your Render backend URL (e.g. `https://aniverse-api.onrender.com/api`)
   - `VITE_JIKAN_BASE_URL` = `https://api.jikan.moe/v4`
4. Deploy — Vercel auto-detects Vite

**Backend → Render:**
1. Push `backend/` to GitHub
2. Create a new **Web Service** on [render.com](https://render.com)
3. Build command: `npm install`
4. Start command: `node server.js`
5. Set environment variables:
   - `MONGODB_URI` = MongoDB Atlas connection string
   - `JWT_SECRET` = a strong random string
   - `CLIENT_URL` = your Vercel frontend URL
   - `NODE_ENV` = `production`
---

## 🔑 Key Technical Decisions

| Decision | Reason |
|----------|--------|
| Jikan rate-limit queue | Jikan allows ~3 req/sec; we space requests 400ms apart |
| Optimistic UI updates | Favorites/watchlist toggle feels instant; rolls back on error |
| JWT in localStorage | Simple for SPA; use httpOnly cookies for higher security in prod |
| `$addToSet` in MongoDB | Prevents duplicate favorites/watchlist entries at DB level |
| Debounced search (400ms) | Avoids API call on every keystroke |

---

## 🛡 Security Notes

- Passwords hashed with bcrypt (12 salt rounds)
- JWT signed with `HS256`, expires in 7 days
- Helmet.js sets secure HTTP headers
- Rate limiting: 200 req/15 min globally, 20 req/15 min on auth routes
- Input validation via Mongoose schemas
- CORS restricted to `CLIENT_URL` origin

---

## 📦 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, Vite 5, React Router 6 |
| Styling | Tailwind CSS 3 |
| HTTP | Axios |
| State | Context API + hooks |
| Backend | Node.js, Express 4 |
| Database | MongoDB + Mongoose |
| Auth | JSON Web Tokens (jsonwebtoken) |
| External API | Jikan v4 (MyAnimeList) |

---

## 📄 License

MIT — feel free to use and modify.
