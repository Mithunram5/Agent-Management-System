# 🚀 Agent Management System - Complete Setup Guide

## 🎯 Professional MERN Stack Application for Company Submission

This is a production-ready Agent Management System built with modern technologies and best practices. Perfect for demonstrating full-stack development skills.

## ⚡ Super Quick Start (2 minutes)

**For immediate testing without MongoDB setup:**

1. **Clone & Install**:
   ```bash
   git clone <repository-url>
   cd agent-management-system

   # Backend
   cd backend && npm install

   # Frontend (new terminal)
   cd frontend && npm install
   ```

2. **Use Pre-configured Database**:
   Create `backend/.env`:
   ```env
   MONGODB_URI=mongodb+srv://testuser:testpass123@cluster0.mongodb.net/agent_management
   JWT_SECRET=your_super_secret_jwt_key_here
   PORT=5000
   NODE_ENV=development
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=admin123
   ```

   > **Note:** The provided MongoDB Atlas connection string is pre-configured with "Allow access from anywhere (0.0.0.0/0)" in the Network Permission List. Please use the included .env and connection string as-is for instant access. If you encounter any connection issues, create your own database in Atlas, update the `.env` file, and run `npm run seed` in the backend directory to initialize sample data.

3. **Start Application**:
   ```bash
   # Backend terminal
   npm run seed && npm run dev

   # Frontend terminal
   npm run dev
   ```

4. **Access**: http://localhost:5173
   - **Admin**: `admin@example.com` / `admin123`
   - **Agent**: `agent1@example.com` / `agent123`

5. **Test CSV Upload**:
   - Login as admin
   - Navigate to "Upload CSV"
   - Use the included `sample_list.csv` file (25 sample records)
   - Watch the automatic distribution among agents

## 🔧 Quick Setup (5 minutes)

### Step 1: MongoDB Atlas Setup

1. **Go to**: https://cloud.mongodb.com/
2. **Sign up/Login** to MongoDB Atlas
3. **Create Free Cluster**:
   - Click "Build a Database"
   - Choose "M0 Sandbox" (Free tier)
   - Select any region
   - Click "Create Cluster"

4. **Create Database User**:
   - Go to "Database Access" → "Add New Database User"
   - Username: `admin`
   - Password: `admin123`
   - Select "Read and write to any database"
   - Click "Add User"

5. **Whitelist IP**:
   - Go to "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Click "Confirm"

6. **Get Connection String**:
   - Go to "Clusters" → Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - It looks like: `mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/`

### Step 2: Update Backend Configuration

1. **Open**: `backend/.env`
2. **Replace** the MONGODB_URI with your connection string:
   ```env
   MONGODB_URI=mongodb+srv://admin:admin123@cluster0.xxxxx.mongodb.net/agent_management?retryWrites=true&w=majority
   ```
   (Replace `xxxxx` with your actual cluster details)

### Step 3: Install Dependencies & Start

```bash
# Backend
cd backend
npm install
npm run seed    # Creates admin user and sample agents
npm run dev     # Starts server on port 5000

# Frontend (new terminal)
cd frontend
npm install
npm run dev     # Starts frontend on port 5173
```

### Step 4: Access the Application

1. **Open**: http://localhost:5173
2. **Login with**:
   - **Admin**: admin@example.com / admin123
   - **Agent**: agent1@example.com / agent123

## 🎯 Features Overview

### Admin Features:
- **Dashboard**: View statistics and overview
- **Agents**: Manage agents (add, edit, delete, view task counts)
- **Upload CSV**: Upload and distribute files among any number of agents
- **Lists**: View all distributions and assigned tasks
- **Sample Testing**: Use included `sample_list.csv` with 25 records

### Agent Features:
- **My Tasks**: View assigned tasks from CSV uploads
- **Task Details**: See contact information and notes

## 📊 CSV Distribution Logic

- **Flexible Distribution**: Works with any number of agents (minimum 1)
- **Equal Distribution**: 25 items among 5 agents = 5 items per agent
- **Remainder Handling**: 23 items among 5 agents = 5,5,5,4,4 (first agents get extra)
- **Required Columns**: FirstName, Phone, Notes
- **Supported Formats**: CSV, XLSX, XLS (max 5MB)
- **Sample File**: Use included `sample_list.csv` for testing (25 records)

## 📄 Testing with Sample CSV File

The project includes a ready-to-use `sample_list.csv` file with 25 sample records:

**File Structure:**
```csv
FirstName,Phone,Notes
John,1234567890,Call in the morning
Jane,2345678901,Follow up next week
Alice,3456789012,Interested in product
Bob,4567890123,Requested brochure
...
```

**Testing Steps:**
1. **Login as Admin**: `admin@example.com` / `admin123`
2. **Navigate to Upload**: Click "Upload CSV" in the navigation
3. **Upload File**: Select the `sample_list.csv` file from the project root
4. **Watch Distribution**: See how 25 items are distributed among your agents
5. **View Results**: Go to "Lists" to see the distribution
6. **Test Agent View**: Login as `agent1@example.com` / `agent123` to see assigned tasks

**Expected Results:**
- If you have 5 agents: Each gets 5 items
- If you have 3 agents: Distribution will be 9, 8, 8 items
- If you have 1 agent: All 25 items go to that agent

## 🔐 Login Credentials

### Admin Access:
```
Email: admin@example.com
Password: admin123
```

### Agent Access:
```
Email: agent1@example.com
Password: agent123

Other agents:
- agent2@example.com / agent123
- agent3@example.com / agent123
- agent4@example.com / agent123
- agent5@example.com / agent123
```

## 🎨 Modern Login Design Features

- **Gradient background** with modern colors
- **Clean card design** with rounded corners
- **Smooth animations** and hover effects
- **Responsive layout** for all devices
- **Demo credentials** displayed for easy testing

## 🛠️ Troubleshooting

### MongoDB Connection Issues:
1. **Check IP Whitelist**: Ensure your IP is whitelisted in MongoDB Atlas
2. **Verify Credentials**: Make sure username/password are correct
3. **Connection String**: Ensure the connection string is properly formatted

### Port Issues:
- **Backend**: Runs on port 5001
- **Frontend**: Runs on port 5173
- Make sure these ports are available

### Common Fixes:
```bash
# Kill processes on ports
npx kill-port 5001
npx kill-port 5173

# Restart with fresh install
rm -rf node_modules
npm install
```

## 📁 Project Structure

```
agent-management-system/
├── backend/
│   ├── src/
│   │   ├── controllers/    # API logic
│   │   ├── models/         # Database schemas
│   │   ├── routes/         # API routes
│   │   └── server.js       # Main server file
│   ├── .env               # Environment variables
│   ├── package.json       # Dependencies
│   └── seed.js            # Database seeding
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts
│   │   ├── App.jsx         # Main app component
│   │   └── main.jsx        # Entry point
│   └── package.json        # Dependencies
└── README.md              # Documentation
```

## 🚀 Deployment Ready

The application is ready for deployment with:
- Environment-based configuration
- Production-ready MongoDB setup
- Secure authentication with JWT
- Input validation and error handling
- Responsive design for all devices

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Ensure MongoDB Atlas is properly configured
3. Verify all dependencies are installed
4. Check that both backend and frontend are running

---