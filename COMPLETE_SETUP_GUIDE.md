# Ameridea Health Insurance App - Complete Setup Guide

## Project Overview

A full-stack health insurance management application with:
- **Mobile App**: React Native + Expo
- **Backend**: Node.js + Express.js + TypeScript
- **Database**: Supabase (PostgreSQL)

---

## 🚀 Quick Start

### 1. Backend Setup

#### Install Dependencies
```bash
cd Backend
npm install
```

#### Configure Supabase
1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Copy `.env.example` to `.env`
3. Fill in your Supabase credentials:
   ```env
   SUPABASE_URL=your_project_url
   SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_KEY=your_service_key
   JWT_SECRET=generate_random_secret
   ```

#### Set Up Database
1. Go to Supabase SQL Editor
2. Run `database/schema.sql` to create tables
3. (Optional) Run `database/seed.sql` for test data

#### Start Backend Server
```bash
npm run dev
```
Server runs on: `http://localhost:3000`

---

### 2. Mobile App Setup

#### Install Dependencies
```bash
cd Mobile/ameridea
npm install
```

#### Configure API
Update `config/api.ts` with your backend URL:
```typescript
export const API_CONFIG = {
  BASE_URL: __DEV__ 
    ? 'http://YOUR_LOCAL_IP:3000' // e.g., 'http://192.168.1.100:3000'
    : 'https://your-production-api.com',
};
```

**Important**: Use your computer's local IP address, not `localhost`

#### Start Expo
```bash
npm run dev
```

#### Run on Device
1. Install **Expo Go** app on your phone
2. Scan the QR code from terminal
3. App opens in Expo Go

---

## 📱 Features Implemented

### Mobile App
- ✅ Authentication (Login/Register)
- ✅ Dashboard with coverage overview
- ✅ Claims management
- ✅ Coverage tracking
- ✅ Messaging system
- ✅ Bills & payments
- ✅ Settings

### Backend API
- ✅ JWT Authentication
- ✅ RESTful API endpoints
- ✅ Supabase integration
- ✅ Row Level Security
- ✅ Error handling
- ✅ Input validation

---

## 🔧 Tech Stack

### Mobile
- React Native
- Expo Router
- TypeScript
- AsyncStorage

### Backend
- Node.js
- Express.js
- TypeScript
- Supabase
- JWT
- bcrypt

---

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Endpoints

#### Authentication
- `POST /auth/register` - Register user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user (protected)
- `POST /auth/logout` - Logout (protected)

#### Claims
- `GET /claims` - Get all claims (protected)
- `GET /claims/:id` - Get single claim (protected)
- `POST /claims` - Submit claim (protected)
- `PUT /claims/:id` - Update claim (protected)

#### Coverage
- `GET /coverage` - Get coverage plans (protected)
- `GET /coverage/:id` - Get single coverage (protected)
- `GET /coverage/summary` - Get summary (protected)

#### Messages
- `GET /messages/conversations` - Get conversations (protected)
- `GET /messages/conversations/:id/messages` - Get messages (protected)
- `POST /messages/conversations` - Create conversation (protected)
- `POST /messages/conversations/:id/messages` - Send message (protected)

#### Bills
- `GET /bills` - Get all bills (protected)
- `GET /bills/:id` - Get single bill (protected)
- `POST /bills/:id/pay` - Pay bill (protected)

---

## 🔐 Authentication Flow

1. User registers/logs in via mobile app
2. Backend validates credentials with Supabase
3. JWT token returned and stored in AsyncStorage
4. Token included in Authorization header for protected routes
5. Backend verifies token on each request

---

## 🗄️ Database Schema

### Tables
- `users` - User profiles
- `coverage` - Insurance coverage plans
- `claims` - Insurance claims
- `bills` - Bills and payments
- `conversations` - Message conversations
- `messages` - Individual messages
- `history` - Activity history

All tables have Row Level Security (RLS) enabled.

---

## 🛠️ Development

### Backend
```bash
cd Backend
npm run dev      # Development with hot reload
npm run build    # Build for production
npm start        # Run production build
```

### Mobile
```bash
cd Mobile/ameridea
npm run dev      # Start Expo
npm run lint     # Run linter
npm run typecheck # Type checking
```

---

## 📦 Project Structure

```
Ameridea/
├── Backend/
│   ├── src/
│   │   ├── config/        # Configuration files
│   │   ├── middleware/    # Express middleware
│   │   ├── routes/        # API routes
│   │   └── server.ts      # Main server file
│   ├── database/
│   │   ├── schema.sql     # Database schema
│   │   └── seed.sql       # Seed data
│   └── package.json
│
└── Mobile/
    └── ameridea/
        ├── app/           # Expo Router screens
        ├── components/    # Reusable components
        ├── context/       # React Context
        ├── services/      # API services
        ├── config/        # Configuration
        └── types/         # TypeScript types
```

---

## 🚨 Troubleshooting

### Backend won't start
- Check `.env` file exists and has correct values
- Ensure Supabase credentials are correct
- Verify port 3000 is available

### Mobile app can't connect to backend
- Use your computer's local IP, not `localhost`
- Ensure both devices on same network
- Check firewall isn't blocking port 3000
- Verify backend is running

### Database errors
- Ensure you ran `schema.sql` in Supabase
- Check RLS policies are enabled
- Verify Supabase service key is correct

---

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Helmet.js security headers
- CORS configuration
- Row Level Security in database
- Input validation
- SQL injection prevention

---

## 📝 Next Steps

1. **Get Supabase credentials** and configure `.env`
2. **Set up database** by running SQL files
3. **Start backend** server
4. **Update mobile API config** with your local IP
5. **Start mobile app** and test

---

## 🎯 Recommendation

**Use Express.js + Node.js + Supabase** for these reasons:

✅ **Flexibility**: Full control over business logic
✅ **Supabase Benefits**: Built-in auth, PostgreSQL, real-time, storage
✅ **Scalability**: Can handle complex operations
✅ **TypeScript**: Type safety across stack
✅ **Cost-effective**: Supabase free tier is generous
✅ **Developer Experience**: Great tooling and documentation

This setup gives you the best of both worlds - Supabase's powerful features plus custom backend logic when needed.
