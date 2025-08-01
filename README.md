# Agent Management System

A comprehensive MERN stack application for managing agents and distributing CSV data among them.

## 🚀 Quick Start

1. **Clone the repository**
2. **Setup MongoDB** (local or Atlas)
3. **Configure environment** variables in `backend/.env`
4. **Install dependencies** and run the application
5. **Use sample data** for testing

See detailed instructions in [SETUP_GUIDE.md](SETUP_GUIDE.md)

**Demo Credentials:**
- **Admin**: `admin@example.com` / `admin123`
- **Agent**: `agent1@example.com` / `agent123`

## 🚀 Features

### Admin Features
- Secure JWT-based authentication
- Agent management (CRUD operations)
- CSV file upload and distribution
- View all distributions and assigned tasks
- Dashboard with statistics

### Agent Features
- Role-based authentication
- View assigned tasks from CSV uploads
- Task details with contact information

### CSV Distribution
- Upload CSV, XLSX, and XLS files (max 5MB)
- Automatic validation and distribution
- Flexible distribution among any number of agents
- Required columns: FirstName, Phone, Notes

## 🛠️ Technology Stack

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose
- JWT Authentication
- Multer for file uploads
- XLSX & CSV parsing

**Frontend:**
- React.js with Hooks
- Material-UI (MUI)
- React Router
- Axios for API calls
- Vite build tool

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm (v8 or higher)
- MongoDB (local or Atlas)

## 🔧 Installation

### 1. Clone Repository
```bash
git clone <repository-url>
cd agent-management-system
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/agent_management
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=24h
PORT=5000
NODE_ENV=development
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

### 4. Database Setup
```bash
cd backend
npm run seed  # Creates admin user and sample agents
```

### 5. Start Application
```bash
# Backend (terminal 1)
cd backend
npm run dev

# Frontend (terminal 2)
cd frontend
npm run dev
```

Access the application at `http://localhost:5173`

## 🗄️ MongoDB Setup

### Local MongoDB
1. Install MongoDB Community Edition
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/agent_management`

### MongoDB Atlas (Cloud)
1. Create free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create cluster and database user
3. Whitelist IP address
4. Use Atlas connection string in `.env`

## 🚀 Usage

### Admin Workflow
1. Login with admin credentials
2. Add agents in "Agents" section
3. Upload CSV file in "Upload CSV" section
4. View distributions in "Lists" section

### Agent Workflow
1. Login with agent credentials
2. View assigned tasks in "My Tasks"
3. See contact details and notes

## 📄 Sample Data

The project includes `sample_list.csv` with 25 test records for CSV upload testing.

## 📁 Project Structure

```
agent-management-system/
├── backend/
│   ├── src/
│   │   ├── controllers/     # API logic
│   │   ├── models/          # Database schemas
│   │   ├── routes/          # API routes
│   │   └── server.js        # Main server
│   ├── .env                 # Environment variables
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── contexts/        # React contexts
│   │   └── App.jsx          # Main app
│   └── package.json
├── sample_list.csv          # Test data
└── README.md
```

## 🧪 Testing

### Manual Testing
1. **Authentication**: Login/logout functionality
2. **Agent Management**: CRUD operations
3. **File Upload**: CSV upload and validation
4. **Distribution**: View distributed lists
5. **Role Access**: Admin vs Agent permissions

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Input validation and sanitization
- File type and size validation
- Protected API routes
- Role-based access control

## 📝 API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Agents
- `GET /api/agents` - Get all agents
- `POST /api/agents` - Create agent
- `PUT /api/agents/:id` - Update agent
- `DELETE /api/agents/:id` - Delete agent

### Lists
- `POST /api/lists/upload` - Upload CSV (Admin)
- `GET /api/lists` - Get distributions (Admin)
- `GET /api/lists/my-tasks` - Get agent tasks (Agent)

## 🚀 Deployment

### Environment Variables
```env
NODE_ENV=production
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret
PORT=5000
```

### Build Commands
```bash
# Backend
npm install && npm start

# Frontend
npm install && npm run build
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Created for MERN Stack Developer Position

**Key Features Demonstrated:**
- Full-stack MERN development
- Authentication & authorization
- File upload & processing
- Database design & relationships
- Modern UI/UX with Material-UI
- Role-based access control
- RESTful API design
- Error handling & validation

---
