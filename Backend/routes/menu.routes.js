import express from 'express';
import { addMenuItem, deleteMenuItem,getAllMenuItems,updateMenuItem } from '../controllers/menu.controller.js';
import { adminAuth } from '../miiddlewares/admin.middleware.js';
import upload from '../miiddlewares/multer.js';

const menuRoutes = express.Router();

// Public route - anyone can view categories
menuRoutes.get('/all', getAllMenuItems);

// Admin only routes - protected with adminAuth middleware
menuRoutes.post('/add', adminAuth, upload.single('image'), addMenuItem);
menuRoutes.put('/update/:id', adminAuth, upload.single('image'), updateMenuItem);
menuRoutes.delete('/delete/:id', adminAuth, deleteMenuItem);

export default menuRoutes;