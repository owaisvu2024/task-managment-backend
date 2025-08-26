const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const User = require('../models/User'); // User model ko import kiya
const Notification = require('../models/Notification'); // Notification model ko import kiya

// Dummy middleware for now to simulate a logged-in user
// Hum baad mein isko proper authentication se replace karenge
const mockAuthMiddleware = async (req, res, next) => {
  req.user = { id: '68a5684f595b1153451234d1' }; // Example user ID
  next();
};

// GET all tasks for a specific user
router.get('/', mockAuthMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ owner: req.user.id });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET tasks shared with a specific user
router.get('/shared', mockAuthMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ sharedWith: req.user.id }).populate('owner', 'username');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE a new task
router.post('/', mockAuthMiddleware, async (req, res) => {
  const { title, description, status } = req.body;
  const task = new Task({
    title,
    description,
    status,
    owner: req.user.id,
  });

  try {
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// SHARE a task with another user
router.put('/:id/share', mockAuthMiddleware, async (req, res) => {
  try {
    const { userId } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not the owner of this task' });
    }

    const userToShare = await User.findById(userId);
    if (!userToShare) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (task.sharedWith.includes(userId)) {
      return res.status(400).json({ message: 'Task already shared with this user' });
    }

    task.sharedWith.push(userId);
    await task.save();

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE a task
router.put('/:id', mockAuthMiddleware, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not the owner of this task' });
    }

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a task
router.delete('/:id', mockAuthMiddleware, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not the owner of this task' });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;