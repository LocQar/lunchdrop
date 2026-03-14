# LunchDrop Backend API

Production-ready REST API for the LunchDrop food delivery platform.

## Features

✅ **Phase 1 (MVP) - COMPLETED**
- User authentication with JWT
- MongoDB database with Mongoose
- RESTful API structure
- Password hashing with bcrypt
- Protected routes
- Role-based access control

🚧 **In Progress**
- Restaurant management APIs
- Order processing APIs
- Payment integration (Stripe)
- Email notifications

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Security:** bcryptjs, cors
- **Email:** Nodemailer
- **Payments:** Stripe

## Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up MongoDB
Make sure MongoDB is installed and running:
```bash
# Windows (if using MongoDB Community)
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in .env
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env` and update values:
```bash
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/lunchdrop
JWT_SECRET=your-secret-key-here
STRIPE_SECRET_KEY=your-stripe-key
EMAIL_USER=your-email@gmail.com
```

### 4. Start the Server
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register new user | ❌ |
| POST | `/login` | Login user | ❌ |
| GET | `/me` | Get current user | ✅ |
| GET | `/logout` | Logout user | ✅ |
| PUT | `/updatedetails` | Update user info | ✅ |
| PUT | `/updatepassword` | Change password | ✅ |

### Example Requests

**Register:**
```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "building": "building-id-here"
}
```

**Login:**
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Get Current User:**
```bash
GET http://localhost:5000/api/auth/me
Authorization: Bearer YOUR_JWT_TOKEN
```

## Database Models

### User
- name, email, password
- role (user, restaurant, admin)
- building, companyCode, company
- favorites, addresses
- subscription info

### Restaurant
- name, owner, cuisine, description
- menu (categories and items)
- hours, maxDailyOrders
- rating, reviews
- status (active, pending, suspended)

### Order
- orderId, user, restaurant
- items with customizations
- pricing (subtotal, fees, taxes, total)
- delivery address
- status tracking
- payment info

### Building
- name, address, zone
- worker count
- coordinates

## Authentication Flow

1. **Register/Login** → Receives JWT token
2. **Store token** in localStorage/cookies
3. **Include token** in Authorization header:
   ```
   Authorization: Bearer YOUR_JWT_TOKEN
   ```
4. **Protected routes** verify token before allowing access

## Security Features

- Password hashing with bcrypt (10 rounds)
- JWT token expiration (7 days)
- HTTP-only cookies
- CORS configuration
- Input validation
- Role-based access control

## Development

### Project Structure
```
backend/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   └── authController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Restaurant.js
│   │   ├── Order.js
│   │   └── Building.js
│   ├── routes/
│   │   └── auth.js
│   ├── utils/
│   │   └── jwt.js
│   └── server.js
├── .env
├── .env.example
└── package.json
```

## Next Steps

1. ✅ Create restaurant API routes
2. ✅ Create order API routes
3. ✅ Integrate Stripe payments
4. ✅ Add email notifications
5. ✅ Connect frontend to backend

## Testing

```bash
# Health check
curl http://localhost:5000/api/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'
```

## Troubleshooting

**MongoDB connection error:**
- Make sure MongoDB is running
- Check MONGODB_URI in .env
- Try: `mongod --dbpath /data/db`

**Port already in use:**
- Change PORT in .env
- Or kill process: `npx kill-port 5000`

**JWT errors:**
- Verify JWT_SECRET is set
- Check token expiration
- Ensure Bearer token format

## License

MIT
