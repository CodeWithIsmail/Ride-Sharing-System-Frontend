# Backend Services Setup Guide

This frontend application requires backend microservices to be running. Here's how to set them up:

## Required Backend Services

The ride-sharing system uses a microservice architecture with the following services:

1. **User Service** (Port 3001) - Authentication and user management
2. **Ride Service** (Port 3002) - Ride requests and applications
3. **Payment Service** (Port 3003) - Payment processing
4. **Admin Service** (Port 3004) - Administrative functions

## Quick Setup (Recommended)

### Option 1: Using Docker Compose (Easiest)

If you have the backend repository with Docker setup:

```bash
# Clone the backend repository
git clone <backend-repository-url>
cd ride-sharing-backend

# Start all services with Docker Compose
docker-compose up -d

# Check if services are running
docker-compose ps
```

### Option 2: Manual Setup

If you need to set up each service manually:

#### 1. User Service (Port 3001)

```bash
# Navigate to user service directory
cd user-service

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env file with your database connection

# Start the service
npm start
# or for development
npm run dev
```

**Required Environment Variables:**

```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/rideshare_users
JWT_SECRET=your_jwt_secret_key
```

#### 2. Ride Service (Port 3002)

```bash
# Navigate to ride service directory
cd ride-service

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Start the service
npm start
```

**Required Environment Variables:**

```env
PORT=3002
MONGODB_URI=mongodb://localhost:27017/rideshare_rides
```

#### 3. Payment Service (Port 3003)

```bash
# Navigate to payment service directory
cd payment-service

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Start the service
npm start
```

**Required Environment Variables:**

```env
PORT=3003
MONGODB_URI=mongodb://localhost:27017/rideshare_payments
```

#### 4. Admin Service (Port 3004)

```bash
# Navigate to admin service directory
cd admin-service

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Start the service
npm start
```

**Required Environment Variables:**

```env
PORT=3004
MONGODB_URI=mongodb://localhost:27017/rideshare_admin
```

## Database Setup

### MongoDB Installation

#### Windows:

1. Download MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Install and start MongoDB service
3. Default connection: `mongodb://localhost:27017`

#### macOS:

```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb/brew/mongodb-community
```

#### Linux (Ubuntu/Debian):

```bash
# Import MongoDB public key
curl -fsSL https://pgp.mongodb.com/server-6.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-6.0.gpg --dearmor

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-6.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Install MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
```

## API Endpoints

### User Service (localhost:3001)

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/users/verify` - Verify JWT token
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/password` - Change password

### Ride Service (localhost:3002)

- `POST /api/rides` - Create ride request
- `GET /api/rides` - Get rides (with filters)
- `GET /api/rides/:id` - Get specific ride
- `PUT /api/rides/:id` - Update ride
- `DELETE /api/rides/:id` - Delete ride
- `POST /api/rides/:id/apply` - Apply for ride
- `GET /api/rides/:id/applications` - Get ride applications
- `PUT /api/applications/:id/status` - Update application status

### Payment Service (localhost:3003)

- `POST /api/payments` - Process payment
- `GET /api/payments/:rideId` - Get payment for ride
- `POST /api/payments/:id/receipt` - Generate receipt

### Admin Service (localhost:3004)

- `GET /api/admin/users` - Get all users
- `PATCH /api/admin/users/:id/status` - Update user status
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/rides` - Get all rides
- `PATCH /api/admin/rides/:id/status` - Update ride status
- `DELETE /api/admin/rides/:id` - Delete ride

## Testing Backend Services

### Health Check Commands

```bash
# Test User Service
curl http://localhost:3001/health

# Test Ride Service
curl http://localhost:3002/health

# Test Payment Service
curl http://localhost:3003/health

# Test Admin Service
curl http://localhost:3004/health
```

### Using the Frontend Service Status

The frontend includes a service status component that automatically checks if all backend services are running. You can see this on the landing page.

## Common Issues and Solutions

### Issue: "ERR_NETWORK" or Connection Refused

**Solution:** Make sure all backend services are running on the correct ports:

```bash
# Check which services are running on required ports
netstat -an | grep ":3001\|:3002\|:3003\|:3004"

# On Windows PowerShell
netstat -an | Select-String ":3001|:3002|:3003|:3004"
```

### Issue: "401 Unauthorized" during login

**Possible causes:**

1. User doesn't exist in database
2. Wrong credentials
3. JWT secret mismatch between services

**Solution:**

1. Create a test user through registration
2. Check database for user records
3. Verify JWT_SECRET in environment variables

### Issue: Database Connection Failed

**Solution:**

```bash
# Check if MongoDB is running
# Windows
sc query MongoDB

# macOS/Linux
brew services list | grep mongodb
# or
systemctl status mongod

# Check database connection
mongo --eval "db.adminCommand('ismaster')"
```

### Issue: CORS Errors

**Solution:** Ensure backend services have CORS configured for `http://localhost:5173` (Vite dev server).

## Sample Data

To populate the database with sample data for testing:

### Create Test Users

```javascript
// Register test users via API or directly in MongoDB
{
  "name": "Test Passenger",
  "email": "passenger@test.com",
  "password": "password123",
  "role": "passenger"
}

{
  "name": "Test Driver",
  "email": "driver@test.com",
  "password": "password123",
  "role": "driver"
}

{
  "name": "Test Admin",
  "email": "admin@test.com",
  "password": "password123",
  "role": "admin"
}
```

## Development Tips

1. **Use PM2 for Process Management:**

   ```bash
   npm install -g pm2
   pm2 start ecosystem.config.js
   ```

2. **Monitor Logs:**

   ```bash
   pm2 logs
   # or for specific service
   pm2 logs user-service
   ```

3. **Auto-restart on file changes:**
   ```bash
   pm2 start --watch
   ```

## Production Deployment

For production deployment:

1. Use environment-specific configuration files
2. Set up proper database connections (MongoDB Atlas, etc.)
3. Configure reverse proxy (Nginx)
4. Set up SSL certificates
5. Use process managers (PM2, Docker)
6. Set up monitoring and logging

## Support

If you encounter issues:

1. Check the service status component on the frontend
2. Verify all services are running on correct ports
3. Check database connectivity
4. Review logs for error messages
5. Ensure environment variables are properly set

For additional help, please check the backend repository documentation or create an issue in the project repository.
