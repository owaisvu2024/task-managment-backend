const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
  },
}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;