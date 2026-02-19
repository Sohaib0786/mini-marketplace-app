# 🛍️ Micro Marketplace

A full-stack marketplace application built with **MERN Stack** (MongoDB, Express, React, Node.js) and **React Native (Expo)** for mobile.

---

## 📋 Project Structure

```
micro-marketplace/
├── backend/          # Node.js + Express REST API
│   ├── server.js
│   ├── src/
│   │   ├── models/        # Mongoose models (User, Product)
│   │   ├── controllers/   # Business logic
│   │   ├── routes/        # Express routes
│   │   ├── middleware/     # Auth, validation, upload
│   │   └── utils/         # DB connection, seed script
│   └── uploads/           # Product image storage
│
├── frontend/         # React Web App
│   ├── public/
│   └── src/
│       ├── pages/         # Home, Login, Register, Detail, Favorites, Profile
│       ├── components/    # ProductCard, SearchBar, Pagination, Skeleton
│       ├── context/       # AuthContext (global state)
│       ├── services/      # Axios API calls
│       └── index.css      # Global styles (dark luxury theme)
│
└── mobile/           # React Native (Expo) App
    ├── App.js
    └── src/
        ├── screens/       # Login, Register, Products, Detail, Favorites, Account
        ├── navigation/    # Bottom tabs + Stack navigator
        ├── context/       # AuthContext
        ├── services/      # API service
        └── utils/         # Theme colors
```

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (running locally) **OR** MongoDB Atlas URI
- npm or yarn
- Expo CLI (for mobile): `npm install -g expo-cli`

---

### 1. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file (already included):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/micro-marketplace
JWT_SECRET=micro_marketplace_super_secret_jwt_key_2024
JWT_EXPIRE=7d
NODE_ENV=development
```

**Seed the database:**
```bash
npm run seed
```

**Start the server:**
```bash
npm run dev   # Development with nodemon
npm start     # Production
```

Server runs at: `http://localhost:5000`

---

### 2. Frontend (React Web) Setup

```bash
cd frontend
npm install
npm start
```

App runs at: `http://localhost:3000`

---

### 3. Mobile (React Native / Expo) Setup

```bash
cd mobile
npm install
npx expo start
```

- Press `a` for Android emulator
- Press `i` for iOS simulator  
- Scan QR code with Expo Go app on device

> **Note:** Update the API URL in `mobile/src/services/api.js`:
> ```js
> const API_BASE_URL = 'http://YOUR_MACHINE_IP:5000';
> ```

---

## 🔐 Test Credentials

| Role  | Email                      | Password      |
|-------|----------------------------|---------------|
| Admin | alice@marketplace.com      | password123   |
| User  | bob@marketplace.com        | password123   |

---

## 📡 API Reference

### Base URL: `http://localhost:5000`

#### Authentication

| Method | Endpoint          | Auth     | Description            |
|--------|------------------|----------|------------------------|
| POST   | `/auth/register`  | Public   | Register a new user    |
| POST   | `/auth/login`     | Public   | Login + get JWT token  |
| GET    | `/auth/me`        | 🔒 JWT  | Get current user       |
| PUT    | `/auth/me`        | 🔒 JWT  | Update profile         |

**Register body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "password123"
}
```

**Login response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGci...",
    "user": { "_id": "...", "name": "...", "email": "...", "role": "user" }
  }
}
```

---

#### Products

| Method | Endpoint           | Auth      | Description              |
|--------|--------------------|-----------|--------------------------|
| GET    | `/products`        | Optional  | List with search + pages |
| GET    | `/products/:id`    | Optional  | Get single product       |
| POST   | `/products`        | 🔒 JWT   | Create product           |
| PUT    | `/products/:id`    | 🔒 JWT   | Update product           |
| DELETE | `/products/:id`    | 🔒 JWT   | Delete product (soft)    |
| GET    | `/products/categories` | Public | List all categories  |

**GET /products query parameters:**
```
?search=headphones    # Text search
&category=Electronics # Filter by category
&page=1               # Page number
&limit=9              # Items per page
&sortBy=price         # Sort field: price|rating|createdAt|title
&sortOrder=asc        # asc or desc
&minPrice=10          # Min price filter
&maxPrice=500         # Max price filter
```

**POST /products body (multipart/form-data):**
```
title        (required) - Product name
price        (required) - Decimal price
description  (required) - 10-1000 chars
category     (optional) - One of the predefined categories
stock        (optional) - Integer stock count
image        (optional) - Image file upload
tags         (optional) - Comma-separated tags
```

---

#### Favorites

| Method | Endpoint                       | Auth     | Description         |
|--------|-------------------------------|----------|---------------------|
| GET    | `/favorites`                   | 🔒 JWT  | Get user favorites  |
| POST   | `/favorites/:productId`        | 🔒 JWT  | Add to favorites    |
| DELETE | `/favorites/:productId`        | 🔒 JWT  | Remove from favorites |
| POST   | `/favorites/:productId/toggle` | 🔒 JWT  | Toggle favorite     |

**Authorization Header:**
```
Authorization: Bearer <your_jwt_token>
```

---

## 🌱 Seed Data

Run `npm run seed` to populate:
- **2 users**: alice (admin) + bob (user)
- **10 products** across various categories with real images from Unsplash

---

## ✨ Features

### Web (React)
- 🔐 JWT Authentication (login + register)
- 🔍 Real-time search with debounce
- 📑 Server-side pagination
- 🏷️ Category filters
- ↕️ Multi-field sorting
- ❤️ Favorite/unfavorite with heart animation
- 📱 Responsive layout
- ⚡ Loading skeletons
- 🎨 Premium dark luxury UI with gold accents
- 🌟 Staggered product card animations
- 🔒 Protected routes

### Mobile (React Native + Expo)
- 🔐 Secure token storage with expo-secure-store
- 📋 Infinite scroll product listing
- 🔍 Search + category filtering
- ❤️ Favorites management
- 📦 Product detail view
- 👤 User profile with stats
- 🌑 Native dark theme

### Backend (Node.js + Express)
- 🔒 JWT + bcrypt authentication
- 📝 express-validator input validation
- 📤 Multer image upload
- 📄 Pagination + search + filtering
- 🔄 Soft delete for products
- 🌱 Seed script with sample data
- 🛡️ Proper HTTP status codes

---

## 🛠️ Tech Stack

| Layer    | Technology |
|----------|------------|
| Backend  | Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs |
| Frontend | React 18, React Router v6, Axios, react-hot-toast |
| Mobile   | React Native, Expo, React Navigation |
| Database | MongoDB with Mongoose ODM |
| Auth     | JWT (JSON Web Tokens) + bcryptjs password hashing |
| Storage  | Multer (local), expo-secure-store (mobile) |

---

## 📁 Key Files

- `backend/src/models/User.js` - User schema with favorites array
- `backend/src/models/Product.js` - Product schema with text index for search
- `backend/src/utils/seed.js` - Database seeder
- `backend/src/middleware/auth.js` - JWT middleware
- `frontend/src/context/AuthContext.js` - Global auth + favorites state
- `frontend/src/services/api.js` - Axios instance + all API calls
- `mobile/src/navigation/AppNavigator.js` - Bottom tab + stack navigation

---

## 📸 Screenshots

The web app features a premium dark luxury design with:
- Deep dark backgrounds (`#0a0a0f`) 
- Gold accent color (`#e8b86d`)
- Playfair Display + DM Sans typography
- Animated product cards with hover effects
- Glassmorphism navbar with scroll effects
