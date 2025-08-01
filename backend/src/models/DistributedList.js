import mongoose from 'mongoose';

const distributedListSchema = new mongoose.Schema({
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agent',
    required: [true, 'Agent is required']
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  fileName: {
    type: String,
    required: [true, 'File name is required']
  },
  totalItems: {
    type: Number,
    required: true,
    min: 0
  },
  items: [
    {
      firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true
      },
      phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
        match: [/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number']
      },
      notes: {
        type: String,
        trim: true,
        maxlength: [500, 'Notes cannot exceed 500 characters']
      }
    }
  ]
}, {
  timestamps: true
});

// Index for better query performance
distributedListSchema.index({ agent: 1, uploadDate: -1 });

export default mongoose.model('DistributedList', distributedListSchema);
