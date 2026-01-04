# Ameridea Backend API

Express.js + TypeScript backend for the Ameridea Health Insurance mobile app, integrated with Supabase.

## Features

- **Authentication**: Register, login, JWT-based auth
- **Claims Management**: Submit, view, track insurance claims
- **Coverage**: View insurance coverage limits and usage
- **Messaging**: Real-time support conversations
- **Bills**: View and pay bills

## Tech Stack

- **Node.js** & **Express.js**
- **TypeScript**
- **Supabase** (PostgreSQL, Auth, Real-time)
- **JWT** for authentication
- **bcrypt** for password hashing

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and fill in your Supabase credentials:

```bash
cp .env.example .env
```

Update the following in `.env`:
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anon/public key
- `SUPABASE_SERVICE_KEY`: Your Supabase service role key
- `JWT_SECRET`: A secure random string for JWT signing

### 3. Set Up Database

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the `database/schema.sql` file to create tables
4. (Optional) Run `database/seed.sql` for test data

### 4. Run Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3000`

### 5. Build for Production

```bash
npm run build
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `POST /api/auth/logout` - Logout user (protected)

### Claims
- `GET /api/claims` - Get all user claims (protected)
- `GET /api/claims/:id` - Get single claim (protected)
- `POST /api/claims` - Submit new claim (protected)
- `PUT /api/claims/:id` - Update claim (protected)

### Coverage
- `GET /api/coverage` - Get all coverage plans (protected)
- `GET /api/coverage/:id` - Get single coverage (protected)
- `GET /api/coverage/summary` - Get coverage summary (protected)

### Messages
- `GET /api/messages/conversations` - Get all conversations (protected)
- `GET /api/messages/conversations/:id/messages` - Get messages (protected)
- `POST /api/messages/conversations` - Create conversation (protected)
- `POST /api/messages/conversations/:id/messages` - Send message (protected)
- `PUT /api/messages/conversations/:id/read` - Mark as read (protected)

### Bills
- `GET /api/bills` - Get all bills (protected)
- `GET /api/bills/:id` - Get single bill (protected)
- `POST /api/bills/:id/pay` - Pay bill (protected)

## Authentication

Protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Project Structure

```
Backend/
├── src/
│   ├── config/
│   │   └── supabase.ts         # Supabase client configuration
│   ├── middleware/
│   │   ├── auth.ts              # JWT authentication middleware
│   │   └── errorHandler.ts     # Error handling middleware
│   ├── routes/
│   │   ├── auth.routes.ts       # Authentication routes
│   │   ├── claims.routes.ts     # Claims routes
│   │   ├── coverage.routes.ts   # Coverage routes
│   │   ├── messages.routes.ts   # Messaging routes
│   │   └── bills.routes.ts      # Bills routes
│   └── server.ts                # Main server file
├── database/
│   ├── schema.sql               # Database schema
│   └── seed.sql                 # Sample data
├── .env.example                 # Environment variables template
├── .gitignore
├── package.json
└── tsconfig.json
```

## Mobile App Integration

Update your mobile app to use this backend:

1. Create an API client in your mobile app
2. Store JWT token after login
3. Include token in all protected requests
4. Update endpoints to point to this backend

## Development

- **Hot reload**: Uses `nodemon` for automatic restart on file changes
- **TypeScript**: Full type safety
- **Linting**: ESLint configured for TypeScript

## Security

- Passwords hashed with bcrypt
- JWT tokens for stateless auth
- Helmet.js for security headers
- CORS configured
- Row Level Security (RLS) in Supabase
- Input validation with express-validator

## License

ISC
