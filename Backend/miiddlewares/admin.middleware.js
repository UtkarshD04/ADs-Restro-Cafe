import { authUser } from './auth.middleware.js';

export const adminAuth = async (req, res, next) => {
    // First check if user is authenticated
    authUser(req, res, (err) => {
        if (err) return next(err);
        
        // Check if user is admin
        if (!req.user.isAdmin) {
            return res.status(403).json({ 
                message: 'Access denied. Admin privileges required.' 
            });
        }
        
        next();
    });
};