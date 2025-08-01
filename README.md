# Ride Sharing System Frontend

A modern, responsive ride-sharing platform frontend built with React and Bootstrap. This application provides a complete user interface for passengers, drivers, and administrators to manage ride requests, applications, and payments.

## 🚀 Features

### For Passengers

- **Dashboard**: View ride statistics and quick access to platform features
- **Request Rides**: Create new ride requests with pickup/dropoff locations and desired fare
- **Manage Rides**: View and manage your ride requests
- **Review Applications**: See driver applications for your rides and approve/reject them
- **Payment Processing**: Handle payments for completed rides

### For Drivers

- **Dashboard**: View available rides and driver statistics
- **Browse Rides**: Search and filter available ride requests
- **Apply for Rides**: Submit applications to drive passengers
- **Manage Rides**: Track your accepted rides and update their status

### For Administrators

- **Dashboard**: Monitor platform statistics and recent activity
- **User Management**: View, activate/deactivate, and manage user accounts
- **Ride Management**: Monitor all ride requests and their statuses
- **Platform Analytics**: View system health and performance metrics

## 🛠 Technology Stack

- **Frontend Framework**: React 19.1.0
- **UI Framework**: Bootstrap 5.3.7
- **Routing**: React Router DOM 7.7.1
- **HTTP Client**: Axios 1.7.8
- **Build Tool**: Vite 6.0.5
- **Development**: ESLint for code quality

## 🏗 Architecture

The application follows a microservice architecture pattern with separate backend services:

- **User Service** (Port 3001): Authentication and user management
- **Ride Service** (Port 3002): Ride requests and applications
- **Payment Service** (Port 3003): Payment processing
- **Admin Service** (Port 3004): Administrative functions

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend services running (see backend repository)

## 🚀 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Ride-Sharing-System-Frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up backend services**

   **Option A: Use Mock Server (for testing/development)**

   ```bash
   # Navigate to mock server directory
   cd mock-server

   # Install mock server dependencies
   npm install

   # Start mock backend services
   npm start
   ```

   **Option B: Set up actual backend services**

   See [BACKEND_SETUP.md](./BACKEND_SETUP.md) for detailed instructions on setting up the actual backend microservices.

4. **Start the development server**

   ```bash
   # Return to project root
   cd ..

   # Start frontend
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🧪 Testing with Mock Data

The mock server provides test accounts:

- **Passenger**: `passenger@test.com` / `password123`
- **Driver**: `driver@test.com` / `password123`
- **Admin**: `admin@test.com` / `password123`

The service status component on the landing page will show green indicators when the mock server is running.

## 📁 Project Structure

```
src/
├── components/           # Reusable components
│   ├── Navbar.jsx       # Navigation component
│   └── ProtectedRoute.jsx # Route protection wrapper
├── context/             # React context providers
│   └── AuthContext.jsx  # Authentication state management
├── pages/               # Page components
│   ├── admin/           # Admin-specific pages
│   ├── driver/          # Driver-specific pages
│   ├── passenger/       # Passenger-specific pages
│   ├── LandingPage.jsx  # Homepage
│   ├── LoginPage.jsx    # User login
│   ├── RegisterPage.jsx # User registration
│   ├── ProfilePage.jsx  # User profile
│   └── PaymentPage.jsx  # Payment processing
├── services/            # API service layer
│   └── apiService.js    # Centralized API calls
├── styles/              # Custom stylesheets
├── utils/               # Utility functions
├── App.jsx              # Main application component
└── main.jsx            # Application entry point
```

## 🔐 Authentication & Authorization

The application implements role-based access control with three user roles:

- **Passenger**: Can request rides and manage their bookings
- **Driver**: Can browse and apply for rides
- **Admin**: Can manage users and monitor platform activity

Authentication is handled via JWT tokens stored in localStorage.

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach using Bootstrap
- **Modern Interface**: Clean, intuitive design with consistent styling
- **Loading States**: Spinners and loading indicators for better UX
- **Error Handling**: User-friendly error messages and validation
- **Interactive Elements**: Modals, badges, and form validations

## 🔧 Configuration

The application connects to backend services via configurable base URLs in `src/services/apiService.js`:

```javascript
const USER_SERVICE_URL = "http://localhost:3001";
const RIDE_SERVICE_URL = "http://localhost:3002";
const PAYMENT_SERVICE_URL = "http://localhost:3003";
const ADMIN_SERVICE_URL = "http://localhost:3004";
```

## 📱 Pages Overview

### Public Pages

- **Landing Page**: Platform introduction and features
- **Login/Register**: User authentication

### Passenger Pages

- **Dashboard**: Statistics and quick actions
- **Request Ride**: Create new ride requests
- **My Rides**: Manage ride requests
- **Applications**: Review driver applications

### Driver Pages

- **Dashboard**: Available rides overview
- **Available Rides**: Browse and apply for rides
- **My Rides**: Manage accepted rides

### Admin Pages

- **Dashboard**: Platform statistics and monitoring
- **Manage Users**: User account administration
- **Manage Rides**: Ride request oversight

## 🔄 State Management

The application uses React Context API for state management:

- **AuthContext**: Manages user authentication state, login/logout functions, and user role information

## 🌐 API Integration

All API calls are centralized in `src/services/apiService.js` with separate service modules:

- **userService**: Authentication and user management
- **rideService**: Ride operations
- **paymentService**: Payment processing
- **adminService**: Administrative functions

## 🚦 Routing

Protected routes ensure users can only access pages appropriate to their role:

```javascript
<ProtectedRoute roles={["passenger"]}>
  <PassengerDashboard />
</ProtectedRoute>
```

## 🎯 Key Features Implementation

### Dashboard Analytics

- Real-time statistics display
- Quick action buttons
- Recent activity feeds

### Ride Management

- Advanced filtering and searching
- Status-based organization
- Real-time updates

### Payment Processing

- Secure payment forms
- Receipt generation
- Payment history tracking

### User Management

- Role-based access control
- Account activation/deactivation
- User statistics and monitoring

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Quality

The project uses ESLint for code quality and consistency. Run `npm run lint` to check for issues.

## 🚀 Deployment

1. **Build the application**

   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your hosting service

3. **Configure environment variables** for production API endpoints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please create an issue in the repository or contact the development team.

---

**Note**: This frontend application requires the corresponding backend services to be running for full functionality. Please refer to the backend repository for setup instructions.+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
