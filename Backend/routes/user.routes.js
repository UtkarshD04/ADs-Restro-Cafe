import express from 'express';
import { registerUser, loginUser, getUserProfile, logoutUser } from '../controllers/user.controller.js';
import { authUser } from '../miiddlewares/auth.middleware.js';
import { validateUserRegistration, validateUserLogin } from '../miiddlewares/validation.middleware.js';

const router = express.Router();

router.post('/register', validateUserRegistration, registerUser);
router.post('/login', validateUserLogin, loginUser);
router.get('/profile', authUser, getUserProfile);
router.post('/logout', authUser, logoutUser);

export default router;