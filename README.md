# Agent Management System - MERN Stack Application

A comprehensive web application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) for managing agents and distributing CSV data among them.

## 🚀 Quick Start Guide

**Company Reviewers:**

- The included `.env` file and MongoDB Atlas connection string are pre-configured for instant testing.
- Network permissions for the database are set to "Allow access from anywhere (0.0.0.0/0)" so you can connect without whitelisting your IP.
- **Please use the provided connection string and credentials as-is.**
- If you encounter any issues connecting to MongoDB Atlas (e.g., connection error), simply create your own database in Atlas, update the `.env` file with your new connection string, and run `npm run seed` in the backend directory to initialize sample data.
- For step-by-step instructions, see the included `SETUP_GUIDE.md`.

**Test Credentials:**
- **Admin Login**: `admin@example.com` / `admin123`
- **Agent Login**: `agent1@example.com` / `agent123`

---

## � Features

### Admin User Login
- Secure JWT-based authentication
- Email and password validation
- Protected routes and session management

### Agent Management
- Create, read, update, and delete agents
- Agent details: Name, Email, Mobile Number (with country code), Password
- Form validation and error handling
- Responsive agent cards display

### CSV File Upload & Distribution
- Upload CSV, XLSX, and XLS files (max 5MB)
- Automatic validation of file format and structure
- **Flexible distribution among any number of agents** (minimum 1)
- Required columns: FirstName, Phone, Notes
- Real-time distribution preview
- **Role-based access**: Admins upload, Agents view their tasks

### Distributed Lists View
- View all uploaded files and their distributions
- Expandable agent sections showing assigned items
- Detailed item information with contact details
- Search and filter capabilities

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **XLSX** - Excel file processing
- **CSV-Parse** - CSV file processing

### Frontend
- **React.js** - UI library
- **Material-UI (MUI)** - Component library
- **React Router** - Navigation
- **Axios** - HTTP client
- **Vite** - Build tool

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (v8 or higher)
- **MongoDB** (local installation or MongoDB Atlas account)

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd agent-management-system
```

### 2. Backend Setup

#### Navigate to backend directory
```bash
cd backend
```

#### Install dependencies
```bash
npm install
```

#### Environment Configuration
Create a `.env` file in the backend directory with the following variables:

```env
# MongoDB Configuration (Choose one)
# Option 1: Local MongoDB
MONGODB_URI=mongodb://localhost:27017/agent_management

# Option 2: MongoDB Atlas (Cloud) - Replace with your credentials
# MONGODB_URI=mongodb+srv://testuser:testpass123@cluster0.mongodb.net/agent_management

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=5000
NODE_ENV=development

# Admin User (for seeding)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
```

**⚠️ Important for Company Review:**
If you don't have MongoDB installed locally, you can use our test MongoDB Atlas connection:
```env
MONGODB_URI=mongodb+srv://testuser:testpass123@cluster0.mongodb.net/agent_management
```

#### Database Setup & Seeding
```bash
# Seed the database with admin user and sample agents
npm run seed
```

#### Start the backend server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The backend server will start on `http://localhost:5000`

### 3. Frontend Setup

#### Navigate to frontend directory (in a new terminal)
```bash
cd frontend
```

#### Install dependencies
```bash
npm install
```

#### Start the frontend development server
```bash
npm run dev
```

The frontend application will start on `http://localhost:5173`

## 🗄️ MongoDB Database Setup


 **Update .env file** with local MongoDB connection:
   ```env
   # MongoDB Configuration - Replace with your own MongoDB Atlas connection string
   # Make sure to whitelist your IP address in MongoDB Atlas Network Access
   MONGODB_URI=mongodb+srv://mithunramal23:tswpHvwyey7Ya9W6@cluster0.yvsvhal.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_here_change_in_production_2024
   JWT_EXPIRES_IN=24h

   # Server Configuration
   PORT=5000
   NODE_ENV=development
   ```

## 🏢 For Company Reviewers - Quick Setup

### Option 1: Using Configured MongoDB Atlas (Recommended)
1. **Clone the repository**
2. **Backend setup**:
   ```bash
   cd backend
   npm install
   ```
3. **Create `.env` file** with our database:
   ```env
   # MongoDB Configuration - Replace with your own MongoDB Atlas connection string
# Make sure to whitelist your IP address in MongoDB Atlas Network Access
MONGODB_URI=mongodb+srv://mithunramal23:tswpHvwyey7Ya9W6@cluster0.yvsvhal.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production_2024
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=5000
NODE_ENV=development
   ```
4. **Seed database**: `npm run seed`
5. **Start backend**: `npm run dev`
6. **Frontend setup** (new terminal):
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
7. **Access application**: `http://localhost:5173`

### Option 2: Using Local MongoDB
- Install MongoDB locally (see detailed instructions below)
- Use `MONGODB_URI=mongodb://localhost:27017/agent_management` in `.env`

### Test Credentials
- **Admin**: `admin@example.com` / `admin123`
- **Agent**: `agent1@example.com` / `agent123`

### Sample Data
- **📄 Use the included `sample_list.csv` file for testing CSV upload**
- Contains 25 sample records with FirstName, Phone, and Notes columns
- Perfect for testing distribution among multiple agents
- Pre-seeded with 5 sample agents for immediate testing

## 🚀 Usage

### 1. Admin Login
- Open `http://localhost:5173` in your browser
- Use the admin credentials:
  - **Email**: `admin@example.com`
  - **Password**: `admin123`

### 2. Agent Management
- Navigate to "Agents" from the navigation bar
- Add agents (minimum 1 required for CSV distribution)
- Fill in: Name, Email, Mobile Number (with country code), Password
- **Delete confirmation**: Agents can be deleted with confirmation popup

### 3. CSV Upload & Distribution
- Navigate to "Upload CSV" from the navigation bar
- Upload a CSV/XLSX/XLS file with columns: FirstName, Phone, Notes
- **📄 Use the provided `sample_list.csv` for testing** (25 sample records included)
- The system will automatically distribute items equally among all available agents
- **Flexible distribution**: Works with any number of agents (minimum 1)
- **Example**: 25 items among 5 agents = 5 items per agent

### 4. View Distributions (Admin)
- Navigate to "Lists" from the navigation bar
- View all uploaded files and their distributions
- Expand agent sections to see assigned items
- Filter and search through distributions

### 5. Agent Task View
- **Agent Login**: Use `agent1@example.com` / `agent123`
- Agents are automatically redirected to their "My Tasks" page
- View only tasks assigned to the logged-in agent
- **Role-based access**: Agents cannot access admin features

## � Sample CSV File for Testing

The project includes a `sample_list.csv` file with 25 sample records for testing:

```csv
FirstName,Phone,Notes
John,1234567890,Call in the morning
Jane,2345678901,Follow up next week
Alice,3456789012,Interested in product
...
```

**How to use:**
1. Login as admin (`admin@example.com` / `admin123`)
2. Navigate to "Upload CSV"
3. Upload the `sample_list.csv` file
4. Watch as the system distributes 25 items among your agents
5. View the distribution in "Lists" section
6. Login as an agent to see their assigned tasks

## �📁 Project Structure

```
agent-management-system/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── agentController.js
│   │   │   └── listController.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Agent.js
│   │   │   └── DistributedList.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── agent.js
│   │   │   └── list.js
│   │   └── server.js
│   ├── uploads/
│   ├── .env
│   ├── package.json
│   └── seed.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx              # Authentication interface
│   │   │   ├── Dashboard.jsx          # Admin dashboard with statistics
│   │   │   ├── Layout.jsx             # Navigation and layout wrapper
│   │   │   ├── AgentManagement.jsx    # CRUD operations for agents
│   │   │   ├── FileUpload.jsx         # CSV upload and distribution
│   │   │   ├── DistributedLists.jsx   # View all distributions
│   │   │   ├── MyTasks.jsx            # Agent task view
│   │   │   ├── ProtectedRoute.jsx     # Route protection
│   │   │   └── RoleBasedRedirect.jsx  # Role-based navigation
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx        # Authentication state management
│   │   ├── App.jsx                    # Main application component
│   │   ├── main.jsx                   # Application entry point
│   │   └── index.css                  # Global styles
│   ├── package.json
│   └── vite.config.js
├── sample_list.csv                    # Sample CSV file for testing
├── README.md                          # This file
└── SETUP_GUIDE.md                     # Detailed setup instructions
```

## 🧪 Testing

### Manual Testing Checklist

1. **Authentication**
   - [ ] Login with correct credentials
   - [ ] Login with incorrect credentials
   - [ ] Protected route access without authentication
   - [ ] Logout functionality

2. **Agent Management**
   - [ ] Create new agent with valid data
   - [ ] Create agent with invalid data (validation)
   - [ ] Edit existing agent
   - [ ] Delete agent
   - [ ] View agent list

3. **File Upload**
   - [ ] Upload valid CSV file
   - [ ] Upload valid XLSX file
   - [ ] Upload invalid file format
   - [ ] Upload file with missing columns
   - [ ] Upload file larger than 5MB
   - [ ] Distribution among 5 agents

4. **Distributed Lists**
   - [ ] View distributed lists
   - [ ] Expand agent sections
   - [ ] View item details

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Input validation and sanitization
- File type and size validation
- Protected API routes
- CORS configuration

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env`
   - Verify network access (for Atlas)

2. **Port Already in Use**
   - Change PORT in `.env` file
   - Kill existing processes: `npx kill-port 5000`

3. **File Upload Issues**
   - Check file format (CSV, XLSX, XLS)
   - Verify file size (max 5MB)
   - Ensure required columns exist

4. **Agent Distribution Error**
   - Ensure at least 1 agent exists
   - Check agent data validity
   - Verify agents are properly saved in database

5. **Environment Variables Missing**
   - Copy the `.env` template provided above
   - For quick testing, use the MongoDB Atlas connection string provided
   - Ensure all required environment variables are set

6. **Seeding Issues**
   - Run `npm run seed` in the backend directory
   - Check MongoDB connection before seeding
   - Verify admin user is created successfully

## 📝 API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Agents
- `GET /api/agents` - Get all agents
- `POST /api/agents` - Create new agent
- `GET /api/agents/:id` - Get agent by ID
- `PUT /api/agents/:id` - Update agent
- `DELETE /api/agents/:id` - Delete agent

### Lists
- `POST /api/lists/upload` - Upload and distribute CSV (Admin only)
- `GET /api/lists` - Get distributed lists (Admin only)
- `GET /api/lists/agent/:agentId` - Get lists for specific agent (Admin only)
- `GET /api/lists/my-tasks` - Get tasks for logged-in agent (Agent only)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 🚀 Deployment

### Production Environment Variables
```env
NODE_ENV=production
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret
PORT=5000
FRONTEND_URL=https://your-frontend-domain.com
```

### Deployment Platforms
- **Backend**: Heroku, Railway, Render, DigitalOcean
- **Frontend**: Vercel, Netlify, GitHub Pages
- **Database**: MongoDB Atlas (recommended for production)

### Build Commands
```bash
# Backend
npm install
npm start

# Frontend
npm install
npm run build
npm run preview
```

## 📊 Technical Highlights

### Architecture
- **RESTful API** design with proper HTTP methods
- **JWT Authentication** with role-based access control
- **MongoDB** with Mongoose ODM for data modeling
- **React** with functional components and hooks
- **Material-UI** for consistent, professional design

### Security Features
- Password hashing with bcryptjs
- JWT token-based authentication
- Input validation and sanitization
- File type and size validation
- Protected routes and middleware
- CORS configuration

### Performance Optimizations
- Efficient database queries with population
- File upload with size limits
- Responsive design for all devices
- Optimized bundle size with Vite

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Created for MERN Stack Developer Position**

### Key Features Demonstrated:
- Full-stack MERN development
- Authentication & authorization
- File upload & processing
- Database design & relationships
- Modern UI/UX with Material-UI
- Role-based access control
- RESTful API design
- Error handling & validation

---


