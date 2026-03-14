# 🍱 LunchDrop

A modern, full-stack food delivery platform connecting office workers with curated local restaurants.

![Status](https://img.shields.io/badge/status-in%20development-yellow)
![License](https://img.shields.io/badge/license-MIT-blue)

## 📋 Overview

LunchDrop streamlines lunch ordering for corporate environments by partnering with local restaurants and delivering to office buildings in the SF Financial District. Built with React, Express, and MongoDB.

### ✨ Key Features

- 🍽️ **Restaurant Marketplace** - Browse 8+ curated restaurants with full menus
- 🛒 **Smart Cart System** - Real-time cart with customizations & dietary filters
- 📦 **Order Tracking** - Live order status from placement to delivery
- 🏢 **Company Integration** - Company codes with perks & locked delivery locations
- 👨‍🍳 **Restaurant Dashboard** - Complete order and menu management system
- ⚡ **Admin Panel** - Platform management and analytics
- 💳 **Subscription Plans** - Lunch Pass and Team Plans with discounts
- 🔐 **Authentication** - JWT-based secure auth with role management
- 📧 **Notifications** - Real-time order updates (planned)

## 🚀 Quick Start

### Prerequisites

- Node.js v16+
- MongoDB v5+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/lunchdrop.git
cd lunchdrop

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### Running the App

**1. Start MongoDB**
```bash
mongod
```

**2. Start Backend API** (Terminal 1)
```bash
cd backend
npm run dev
```
✅ Backend runs at: `http://localhost:5000`

**3. Start Frontend** (Terminal 2)
```bash
npm run dev
```
✅ Frontend runs at: `http://localhost:3003`

## 📁 Project Structure

```
lunchdrop/
├── src/                      # Frontend React app
│   ├── App.jsx              # Main application (7,326 lines)
│   └── main.jsx             # React entry point
├── backend/                  # Backend Express API
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Auth & validation
│   │   ├── models/          # Mongoose schemas
│   │   │   ├── User.js
│   │   │   ├── Restaurant.js
│   │   │   ├── Order.js
│   │   │   └── Building.js
│   │   ├── routes/          # API routes
│   │   ├── utils/           # Helper functions
│   │   └── server.js        # Express server
│   ├── .env.example         # Environment template
│   └── package.json
├── public/                   # Static assets
├── .gitignore               # Git ignore rules
├── package.json             # Frontend dependencies
└── README.md                # This file
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool & dev server
- **CSS-in-JS** - Custom styling with CSS variables
- **Context API** - State management

### Backend (Phase 1 - MVP Completed ✅)
- **Node.js & Express** - REST API server
- **MongoDB & Mongoose** - Database & ODM
- **JWT** - Secure authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin support
- **Stripe** - Payment processing (planned)
- **Nodemailer** - Email notifications (planned)

## 🔑 Environment Setup

### Backend Configuration

Copy `.env.example` to `.env` in the backend folder:

```bash
cd backend
cp .env.example .env
```

Update `backend/.env`:
```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/lunchdrop

# JWT
JWT_SECRET=your-super-secret-key-change-this
JWT_EXPIRE=7d

# Stripe (optional for now)
STRIPE_SECRET_KEY=sk_test_...

# Email (optional for now)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Frontend
FRONTEND_URL=http://localhost:3003
```

## 📡 API Documentation

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/login` | Login user | ❌ |
| GET | `/api/auth/me` | Get current user | ✅ |
| GET | `/api/auth/logout` | Logout user | ✅ |
| PUT | `/api/auth/updatedetails` | Update profile | ✅ |
| PUT | `/api/auth/updatepassword` | Change password | ✅ |

### Coming Soon
- 🍽️ Restaurant APIs (CRUD)
- 📦 Order APIs (create, track, manage)
- 💳 Payment APIs (Stripe integration)
- 👨‍💼 Admin APIs (platform management)

**Full API docs:** [backend/README.md](backend/README.md)

## 🎯 Development Roadmap

### ✅ Phase 1: MVP (In Progress)
- [x] Frontend UI with all features
- [x] Backend API structure
- [x] MongoDB models (User, Restaurant, Order, Building)
- [x] JWT authentication system
- [x] Company code integration with location locking
- [ ] Restaurant CRUD APIs
- [ ] Order processing APIs
- [ ] Stripe payment integration
- [ ] Email notification system
- [ ] Frontend-backend integration

### 🚧 Phase 2: Enhancement
- [ ] Real-time order tracking (WebSocket/Socket.io)
- [ ] Push notifications (Web Push API)
- [ ] User review & rating system
- [ ] Multiple address management
- [ ] Order modification & cancellation
- [ ] Advanced search & filters

### 🔮 Phase 3: Scale
- [ ] Delivery driver mobile app
- [ ] Advanced analytics dashboard
- [ ] Loyalty points & rewards program
- [ ] Native mobile app (React Native)
- [ ] AI-powered recommendations
- [ ] Multi-city expansion

## 🧪 Testing

```bash
# Frontend (coming soon)
npm test                 # Run tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report

# Backend (coming soon)
cd backend
npm test
```

## 🏗️ Development

### Frontend Commands
```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Preview production build
```

### Backend Commands
```bash
cd backend
npm run dev          # Start with nodemon (auto-reload)
npm start            # Production mode
npm run seed         # Seed database (coming soon)
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards
- Follow existing code style
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation as needed

## 🐛 Troubleshooting

**MongoDB connection error:**
```bash
# Make sure MongoDB is running
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in backend/.env
```

**Port already in use:**
```bash
# Change PORT in backend/.env
# Or kill the process:
npx kill-port 5000
```

**Frontend not connecting to backend:**
- Verify backend is running on port 5000
- Check CORS settings in backend/src/server.js
- Ensure FRONTEND_URL is correct in backend/.env

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Restaurant images from [Unsplash](https://unsplash.com)
- Typography: Outfit & Inter from Google Fonts
- Built with React, Express, and MongoDB

## 📧 Contact

Project Link: [https://github.com/yourusername/lunchdrop](https://github.com/yourusername/lunchdrop)

---

**Made with ❤️ and ☕**

*Scheduled office lunch delivery platform for the SF Financial District*
