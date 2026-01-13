import express from 'express';
import { registerUser, loginUser, getUserProfile, logoutUser } from '../controllers/user.controller.js';
import { createAdmin } from '../controllers/admin.controller.js';
import userModel from '../models/user.Model.js';
import { authUser } from '../miiddlewares/auth.middleware.js';
import { validateUserRegistration, validateUserLogin } from '../miiddlewares/validation.middleware.js';

const router = express.Router();

// Admin creation route (one-time use)
router.post('/create-admin', createAdmin);
router.delete('/delete-admin', async (req, res) => {
    try {
        await userModel.deleteMany({ isAdmin: true });
        res.json({ message: 'All admin users deleted', success: true });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting admin users', success: false });
    }
});

router.post('/register', validateUserRegistration, registerUser);
router.post('/login', loginUser);
router.get('/profile', authUser, getUserProfile);
router.post('/logout', authUser, logoutUser);

export default router;