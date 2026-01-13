import express from 'express';
import { addCategory, getAllCategories, updateCategory, deleteCategory } from '../controllers/category.controller.js';
import { adminAuth } from '../miiddlewares/admin.middleware.js';
import upload from '../miiddlewares/multer.js';

const categoryRouter = express.Router();

// Public route - anyone can view categories
categoryRouter.get('/', getAllCategories);

// Admin only routes - protected with adminAuth middleware
categoryRouter.post('/add', adminAuth, upload.single('image'), addCategory);
categoryRouter.put('/update/:id', adminAuth, upload.single('image'), updateCategory);
categoryRouter.delete('/delete/:id', adminAuth, deleteCategory);

export default categoryRouter;