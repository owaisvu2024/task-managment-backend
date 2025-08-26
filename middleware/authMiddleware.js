const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    // Header se token lo
    const token = req.header('Authorization');

    // Agar token nahi hai to 401 Unauthorised error do
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        // Token ko verify karo
        const decoded = jwt.verify(token, 'mysecrettoken'); // Wahi secret key jo authRoutes mein istemal ki thi

        // Request object mein user ki ID add karo
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};