import Menu from "../models/menu.model.js";    

import {v2 as cloudinary} from "cloudinary"

export const addMenuItem = async(req,res) => {
    try{
        console.log('Request body:', req.body);
        console.log('Request file:', req.file);
        
        const name = req.body?.name;
        const description = req.body?.description;
        const price = req.body?.price;
        const category = req.body?.category;
        
        if(!name || !description || !price || !category || !req.file){
            return res
            .status(400)
            .json({message: "All fields are required", success: false});
        }
        
        const result = await cloudinary.uploader.upload(req.file.path);
        const newMenuItem = await Menu.create({
            name,
            description,
            price,
            category,
            image: result.secure_url
        });
        
        res.status(201).json({
            message: "Menu item added successfully",
            success: true,
            menuItem: newMenuItem
        });
    }
    catch(error){
        console.error('Add menu item error:', error);
        return res.status(500).json({message:"Internal server error", success:false, error: error.message})
    }
}

export const getAllMenuItems = async(req,res) => {
    try{
        const menuItems = await Menu.find().populate('category').sort({createdAt: -1});
        res.status(200).json({success:true, menuItems});
    }
    catch(error){
        console.error('Get menu items error:', error);
        return res.status(500).json({message:"Internal server error", success:false, error: error.message})
    }
}

export const getMenuItemsByCategory = async(req,res) => {
    try{
        const {categoryId} = req.params;
        const menuItems = await Menu.find({category: categoryId}).populate('category').sort({createdAt: -1});
        res.status(200).json({success:true, menuItems});
    }
    catch(error){
        console.error('Get menu items by category error:', error);
        return res.status(500).json({message:"Internal server error", success:false, error: error.message})
    }
}

export const updateMenuItem = async(req,res) => {
    try{
        const {id} = req.params;
        const name = req.body?.name;
        const description = req.body?.description;
        const price = req.body?.price;
        const category = req.body?.category;
        
        const menuItem = await Menu.findById(id);
        if(!menuItem){
            return res
            .status(404)
            .json({message: "Menu item not found", success:false});
        }
        
        if(req.file){
            const result = await cloudinary.uploader.upload(req.file.path);
            menuItem.image = result.secure_url;
        }
        
        if(name) menuItem.name = name;
        if(description) menuItem.description = description;
        if(price) menuItem.price = price;
        if(category) menuItem.category = category;
        
        await menuItem.save();
        
        res.status(200).json({
            message: "Menu item updated successfully",
            success: true,
            menuItem
        });
    }
    catch(error){
        console.error('Update menu item error:', error);
        return res.status(500).json({message: "Internal server error", success:false, error: error.message})
    }
}

export const deleteMenuItem = async(req, res) => {
    try {
        const { id } = req.params;
        
        const menuItem = await Menu.findById(id);
        if (!menuItem) {
            return res
                .status(404)
                .json({ message: "Menu item not found", success: false });
        }
        
        // Delete image from cloudinary if exists
        if (menuItem.image) {
            const publicId = menuItem.image.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(publicId);
        }
        
        await Menu.findByIdAndDelete(id);
        
        res.status(200).json({
            message: "Menu item deleted successfully",
            success: true
        });
    } catch (error) {
        console.error('Delete menu item error:', error);
        return res.status(500).json({ message: "Internal server error", success: false, error: error.message });
    }
}
