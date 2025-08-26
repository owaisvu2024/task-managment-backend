const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// Dummy auth middleware (ab yahin par hai)
const mockAuthMiddleware = (req, res, next) => {
    // Tumhari user ID yahan hai
    req.user = { id: '68a5684f595b1153451234d1' };
    next();
};

// GET summary stats
router.get('/overview', mockAuthMiddleware, async (req, res) => {
    try {
        const totalTasks = await Task.countDocuments({ owner: req.user.id });
        const completedTasks = await Task.countDocuments({ owner: req.user.id, status: 'Completed' });
        const inProgressTasks = await Task.countDocuments({ owner: req.user.id, status: 'In Progress' });
        const pendingTasks = await Task.countDocuments({ owner: req.user.id, status: 'Pending' });

        res.json({
            totalTasks,
            completedTasks,
            inProgressTasks,
            pendingTasks,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET weekly/monthly trends
router.get('/trends', mockAuthMiddleware, async (req, res) => {
    try {
        const trends = await Task.aggregate([
            { $match: { owner: req.user.id } },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                        week: { $week: "$createdAt" }
                    },
                    createdTasks: { $sum: 1 },
                    completedTasks: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "Completed"] }, 1, 0]
                        }
                    },
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1, "_id.week": 1 } }
        ]);

        res.json(trends);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;