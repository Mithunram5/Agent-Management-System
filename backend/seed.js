/**
 * Database Seed Script for Agent Management System
 * This script initializes the database with an admin user and sample agents
 *
 * Usage: npm run seed
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';
import Agent from './src/models/Agent.js';
import DistributedList from './src/models/DistributedList.js';

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/agent_management';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

async function connectDatabase() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

async function clearExistingData() {
  try {
    await User.deleteMany({});
    await Agent.deleteMany({});
    await DistributedList.deleteMany({});
    console.log('🗑️  Cleared existing data');
  } catch (error) {
    console.error('❌ Error clearing data:', error);
    throw error;
  }
}

async function createAdminUser() {
  try {
    const adminExists = await User.findOne({ email: ADMIN_EMAIL });
    if (adminExists) {
      console.log('👤 Admin user already exists');
      return adminExists;
    }

    const admin = new User({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: 'admin'
    });

    await admin.save();
    console.log(`✅ Created admin user: ${ADMIN_EMAIL}`);
    return admin;
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    throw error;
  }
}

async function createAgents() {
  try {
    // Create exactly 5 agents as required for distribution
    const agentsData = [
      { name: 'Agent One', email: 'agent1@example.com', mobile: '+911111111111', password: 'agent123' },
      { name: 'Agent Two', email: 'agent2@example.com', mobile: '+922222222222', password: 'agent123' },
      { name: 'Agent Three', email: 'agent3@example.com', mobile: '+933333333333', password: 'agent123' },
      { name: 'Agent Four', email: 'agent4@example.com', mobile: '+944444444444', password: 'agent123' },
      { name: 'Agent Five', email: 'agent5@example.com', mobile: '+955555555555', password: 'agent123' },
    ];

    const createdAgents = [];

    for (const agentData of agentsData) {
      const existingAgent = await Agent.findOne({ email: agentData.email });
      if (existingAgent) {
        console.log(`👤 Agent already exists: ${agentData.email}`);
        createdAgents.push(existingAgent);
        continue;
      }

      const agent = new Agent({
        name: agentData.name,
        email: agentData.email,
        mobile: agentData.mobile,
        password: agentData.password
      });

      await agent.save();
      createdAgents.push(agent);
      console.log(`✅ Created agent: ${agentData.name} (${agentData.email})`);
    }

    return createdAgents;
  } catch (error) {
    console.error('❌ Error creating agents:', error);
    throw error;
  }
}

async function seed() {
  try {
    console.log('🌱 Starting database seeding...');

    // Connect to database
    await connectDatabase();

    // Clear existing data
    await clearExistingData();

    // Create admin user
    const admin = await createAdminUser();

    // Create agents
    const agents = await createAgents();

    console.log('\n🎉 Database seeding completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - Admin users: 1`);
    console.log(`   - Agents: ${agents.length}`);
    console.log(`   - Admin email: ${admin.email}`);
    console.log(`   - Admin password: ${ADMIN_PASSWORD}`);
    console.log('\n💡 You can now start the server and login with the admin credentials.');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
}

// Run the seed function
seed();
