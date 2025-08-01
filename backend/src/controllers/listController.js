import Agent from '../models/Agent.js';
import DistributedList from '../models/DistributedList.js';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';
import { parse } from 'csv-parse/sync';

// Ensure uploads directory exists
const uploadsDir = 'uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer config for file upload
export const upload = multer({
  dest: uploadsDir,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    const allowedExtensions = ['.csv', '.xlsx', '.xls'];
    const fileExtension = path.extname(file.originalname).toLowerCase();

    if (allowedMimeTypes.includes(file.mimetype) || allowedExtensions.includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV, XLSX, and XLS files are allowed'), false);
    }
  }
});

// Validate CSV/Excel data structure
const validateDataStructure = (items) => {
  const errors = [];

  if (!Array.isArray(items) || items.length === 0) {
    errors.push('File must contain at least one data row');
    return errors;
  }

  // Check required columns
  const requiredFields = ['firstName', 'phone'];
  const sampleItem = items[0];

  for (const field of requiredFields) {
    if (!(field in sampleItem) && !(`${field.charAt(0).toUpperCase()}${field.slice(1)}` in sampleItem)) {
      errors.push(`Missing required column: ${field} or ${field.charAt(0).toUpperCase()}${field.slice(1)}`);
    }
  }

  // Validate each row
  items.forEach((item, index) => {
    if (!item.firstName && !item.FirstName) {
      errors.push(`Row ${index + 2}: FirstName is required`);
    }
    if (!item.phone && !item.Phone) {
      errors.push(`Row ${index + 2}: Phone is required`);
    }

    // Validate phone number format
    const phone = item.phone || item.Phone;
    if (phone && !/^\+?[1-9]\d{1,14}$/.test(phone.toString().replace(/\s+/g, ''))) {
      errors.push(`Row ${index + 2}: Invalid phone number format`);
    }
  });

  return errors;
};

// Parse file content
const parseFileContent = (file) => {
  const fileExtension = path.extname(file.originalname).toLowerCase();
  let items = [];

  try {
    if (fileExtension === '.csv' || file.mimetype === 'text/csv') {
      const content = fs.readFileSync(file.path, 'utf8');
      const records = parse(content, {
        columns: true,
        trim: true,
        skip_empty_lines: true
      });
      items = records.map(r => ({
        firstName: r.FirstName || r.firstName || '',
        phone: r.Phone || r.phone || '',
        notes: r.Notes || r.notes || ''
      }));
    } else if (['.xlsx', '.xls'].includes(fileExtension)) {
      const workbook = XLSX.readFile(file.path);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      items = jsonData.map(r => ({
        firstName: r.FirstName || r.firstName || '',
        phone: r.Phone || r.phone || '',
        notes: r.Notes || r.notes || ''
      }));
    } else {
      throw new Error('Unsupported file format');
    }

    return items;
  } catch (error) {
    throw new Error(`Failed to parse file: ${error.message}`);
  }
};

// Upload and Distribute CSV/Excel
export const uploadAndDistribute = async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    let items = [];

    try {
      // Parse file content
      items = parseFileContent(req.file);

      // Validate data structure
      const validationErrors = validateDataStructure(items);
      if (validationErrors.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'File validation failed',
          errors: validationErrors
        });
      }

      // Clean up the data
      items = items.filter(item =>
        (item.firstName && item.firstName.trim()) &&
        (item.phone && item.phone.toString().trim())
      ).map(item => ({
        firstName: item.firstName.trim(),
        phone: item.phone.toString().trim(),
        notes: item.notes ? item.notes.trim() : ''
      }));

      if (items.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No valid data found in file'
        });
      }

    } catch (parseError) {
      return res.status(400).json({
        success: false,
        message: parseError.message
      });
    } finally {
      // Clean up uploaded file
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    }

    // Distribute the items
    await distributeItems(items, req.file.originalname, res);

  } catch (error) {
    console.error('Upload and distribute error:', error);

    // Clean up uploaded file in case of error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Distribute items among exactly 5 agents
async function distributeItems(items, fileName, res) {
  try {
    // Get all agents
    const agents = await Agent.find().sort({ createdAt: 1 }); // Sort by creation date for consistency

    // Check if we have at least 1 agent
    if (agents.length < 1) {
      return res.status(400).json({
        success: false,
        message: 'No agents found. Please add at least one agent before distributing.'
      });
    }

    // Use all available agents for distribution
    const distributionAgents = agents;

    // Calculate distribution - distribute equally among all available agents
    const totalItems = items.length;
    const totalAgents = distributionAgents.length;
    const itemsPerAgent = Math.floor(totalItems / totalAgents);
    let remainingItems = totalItems % totalAgents;

    console.log(`Distributing ${totalItems} items among ${totalAgents} agents:`);
    console.log(`Base items per agent: ${itemsPerAgent}`);
    console.log(`Remaining items to distribute: ${remainingItems}`);

    const distributions = [];
    let currentIndex = 0;

    for (let i = 0; i < totalAgents; i++) {
      const agent = distributionAgents[i];

      // Calculate items for this agent
      // First agents get the extra items if total is not divisible by 5
      let itemsForThisAgent = itemsPerAgent;
      if (i < remainingItems) {
        itemsForThisAgent += 1;
      }

      // Get items for this agent
      const agentItems = items.slice(currentIndex, currentIndex + itemsForThisAgent);
      currentIndex += itemsForThisAgent;

      console.log(`Agent ${i + 1} (${agent.name}): ${itemsForThisAgent} items`);

      // Create distribution record
      const distributedList = new DistributedList({
        agent: agent._id,
        fileName: fileName,
        totalItems: agentItems.length,
        items: agentItems
      });

      await distributedList.save();

      distributions.push({
        agent: {
          id: agent._id,
          name: agent.name,
          email: agent.email
        },
        itemCount: agentItems.length,
        items: agentItems
      });
    }

    res.status(200).json({
      success: true,
      message: 'List distributed successfully among 5 agents',
      data: {
        fileName: fileName,
        totalItems: totalItems,
        distributions: distributions,
        summary: {
          totalAgents: totalAgents,
          itemsPerAgent: itemsPerAgent,
          extraItems: totalItems % totalAgents,
          distributionDate: new Date()
        }
      }
    });

  } catch (error) {
    console.error('Distribution error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to distribute items'
    });
  }
}

// Get all distributed lists
export const getDistributedLists = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get distributed lists with agent details
    const lists = await DistributedList.find()
      .populate('agent', 'name email mobile')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalLists = await DistributedList.countDocuments();
    const totalPages = Math.ceil(totalLists / limit);

    // Group by upload session (same fileName and similar upload time)
    const groupedLists = {};
    lists.forEach(list => {
      const key = `${list.fileName}_${list.createdAt.toDateString()}`;
      if (!groupedLists[key]) {
        groupedLists[key] = {
          fileName: list.fileName,
          uploadDate: list.createdAt,
          totalItems: 0,
          distributions: []
        };
      }
      groupedLists[key].totalItems += list.totalItems;
      groupedLists[key].distributions.push({
        agent: list.agent,
        itemCount: list.totalItems,
        items: list.items
      });
    });

    res.status(200).json({
      success: true,
      message: 'Distributed lists retrieved successfully',
      data: {
        lists: Object.values(groupedLists),
        pagination: {
          currentPage: page,
          totalPages,
          totalLists,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Get distributed lists error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get distributed list for a specific agent
export const getAgentDistributedList = async (req, res) => {
  try {
    const { agentId } = req.params;

    if (!agentId) {
      return res.status(400).json({
        success: false,
        message: 'Agent ID is required'
      });
    }

    const lists = await DistributedList.find({ agent: agentId })
      .populate('agent', 'name email mobile')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Agent distributed lists retrieved successfully',
      data: {
        lists,
        totalItems: lists.reduce((sum, list) => sum + list.totalItems, 0)
      }
    });

  } catch (error) {
    console.error('Get agent distributed list error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get my tasks (for logged-in agent)
export const getMyTasks = async (req, res) => {
  try {
    // If admin, return error
    if (req.user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'This endpoint is for agents only'
      });
    }

    const lists = await DistributedList.find({ agent: req.user.id })
      .populate('agent', 'name email mobile')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Your tasks retrieved successfully',
      data: {
        lists,
        totalItems: lists.reduce((sum, list) => sum + list.totalItems, 0)
      }
    });

  } catch (error) {
    console.error('Get my tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
