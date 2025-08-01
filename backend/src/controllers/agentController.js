import Agent from '../models/Agent.js';
import { validationResult } from 'express-validator';
import mongoose from 'mongoose';

// Add Agent
export const addAgent = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, mobile, password } = req.body;

    // Check if agent already exists
    const existingAgent = await Agent.findOne({
      $or: [{ email: email.toLowerCase() }, { mobile }]
    });

    if (existingAgent) {
      return res.status(409).json({
        success: false,
        message: 'Agent with this email or mobile number already exists'
      });
    }

    // Create new agent
    const agent = new Agent({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      mobile: mobile.trim(),
      password
    });

    await agent.save();

    // Remove password from response
    const agentResponse = agent.toObject();
    delete agentResponse.password;

    res.status(201).json({
      success: true,
      message: 'Agent created successfully',
      agent: agentResponse
    });

  } catch (error) {
    console.error('Add agent error:', error);

    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// List All Agents
export const listAgents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get agents without password field
    const agents = await Agent.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalAgents = await Agent.countDocuments();
    const totalPages = Math.ceil(totalAgents / limit);

    res.status(200).json({
      success: true,
      message: 'Agents retrieved successfully',
      data: {
        agents,
        pagination: {
          currentPage: page,
          totalPages,
          totalAgents,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });

  } catch (error) {
    console.error('List agents error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get Single Agent
export const getAgent = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid agent ID'
      });
    }

    const agent = await Agent.findById(id).select('-password');

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Agent retrieved successfully',
      agent
    });

  } catch (error) {
    console.error('Get agent error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update Agent
export const editAgent = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid agent ID'
      });
    }

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, mobile, password } = req.body;

    // Check if another agent has the same email or mobile
    const existingAgent = await Agent.findOne({
      $and: [
        { _id: { $ne: id } },
        { $or: [{ email: email.toLowerCase() }, { mobile }] }
      ]
    });

    if (existingAgent) {
      return res.status(409).json({
        success: false,
        message: 'Another agent with this email or mobile number already exists'
      });
    }

    // Prepare update object
    const updateData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      mobile: mobile.trim()
    };

    // Only update password if provided
    if (password && password.trim()) {
      updateData.password = password;
    }

    const agent = await Agent.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Agent updated successfully',
      agent
    });

  } catch (error) {
    console.error('Edit agent error:', error);

    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Delete Agent
export const deleteAgent = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid agent ID'
      });
    }

    const agent = await Agent.findByIdAndDelete(id);

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Agent deleted successfully'
    });

  } catch (error) {
    console.error('Delete agent error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
