# 🚀 Agent Management System - Setup Guide

## ⚡ Quick Setup (5 minutes)

### Step 1: Clone Repository
```bash
git clone <repository-url>
cd agent-management-system
```

### Step 2: Backend Setup
```bash
cd backend
npm install
```

Create `.env` file in backend directory:
```env
MONGODB_URI=mongodb://localhost:27017/agent_management
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=24h
PORT=5000
NODE_ENV=development
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
```

### Step 3: Frontend Setup
```bash
cd frontend
npm install
```

### Step 4: Database Setup
```bash
cd backend
npm run seed    # Creates admin user and sample agents
npm run dev     # Starts backend server
```

### Step 5: Start Frontend
```bash
cd frontend
npm run dev     # Starts frontend server
```

### Step 6: Access Application
- **URL**: http://localhost:5173
- **Admin**: `admin@example.com` / `admin123`
- **Agent**: `agent1@example.com` / `agent123`

### Step 7: Test CSV Upload
- Login as admin
- Navigate to "Upload CSV"
- Use the included `sample_list.csv` file (25 sample records)
- Watch the automatic distribution among agents

## 🗄️ MongoDB Setup Options

### Option 1: Local MongoDB (Recommended)

1. **Install MongoDB Community Edition**
   - Download from [MongoDB Official Website](https://www.mongodb.com/try/download/community)
   - Follow installation instructions for your OS

2. **Start MongoDB Service**
   ```bash
   # Windows
   net start MongoDB
   
   # macOS
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

3. **Verify Installation**
   ```bash
   mongosh
   show dbs
   exit
   ```

### Option 2: MongoDB Atlas (Cloud)

1. **Create Account**: Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. **Create Cluster**: Choose free tier (M0)
3. **Create Database User**: Add username/password
4. **Whitelist IP**: Add your IP address
5. **Get Connection String**: Copy from Atlas dashboard
6. **Update .env**: Replace MONGODB_URI with Atlas connection string

## 🎯 Features Overview

### Admin Features
- **Dashboard**: View statistics and overview
- **Agents**: Manage agents (add, edit, delete with confirmation)
- **Upload CSV**: Upload and distribute files among any number of agents
- **Lists**: View all distributions and assigned tasks
- **Sample Testing**: Use included `sample_list.csv` with 25 records

### Agent Features
- **My Tasks**: View assigned tasks from CSV uploads
- **Task Details**: See contact information and notes
- **Role-based Access**: Cannot access admin features

## 📊 CSV Distribution Logic

- **Flexible Distribution**: Works with any number of agents (minimum 1)
- **Equal Distribution**: 25 items among 5 agents = 5 items per agent
- **Remainder Handling**: 23 items among 5 agents = 5,5,5,4,4 (first agents get extra)
- **Required Columns**: FirstName, Phone, Notes
- **Supported Formats**: CSV, XLSX, XLS (max 5MB)
- **Sample File**: Use included `sample_list.csv` for testing (25 records)

## 📄 Testing with Sample CSV File

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

### Admin Access
```
Email: admin@example.com
Password: admin123
```

### Agent Access
```
Email: agent1@example.com
Password: agent123

Other agents:
- agent2@example.com / agent123
- agent3@example.com / agent123
- agent4@example.com / agent123
- agent5@example.com / agent123
```

## 🛠️ Troubleshooting

### MongoDB Connection Issues
1. **Check MongoDB Service**: Ensure MongoDB is running
2. **Verify Connection String**: Check MONGODB_URI in .env
3. **Network Access**: For Atlas, verify IP whitelist

### Port Issues
- **Backend**: Runs on port 5000
- **Frontend**: Runs on port 5173
- Make sure these ports are available

### Common Fixes
```bash
# Kill processes on ports
npx kill-port 5000
npx kill-port 5173

# Restart with fresh install
rm -rf node_modules
npm install
```

### Environment Variables Missing
- Copy the `.env` template provided above
- Ensure all required environment variables are set
- Verify MongoDB connection before seeding

### Seeding Issues
- Run `npm run seed` in the backend directory
- Check MongoDB connection before seeding
- Verify admin user is created successfully

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
├── sample_list.csv         # Test data
├── README.md              # Main documentation
└── SETUP_GUIDE.md         # This file
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
2. Ensure MongoDB is properly configured
3. Verify all dependencies are installed
4. Check that both backend and frontend are running

---
