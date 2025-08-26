const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed'],
    default: 'Pending',
  },
  owner: { // Task ka owner
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  sharedWith: [{ // Jin users ke saath task shared hai
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;