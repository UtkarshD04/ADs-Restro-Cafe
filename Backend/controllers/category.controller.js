import Category from "../models/categoryModel.js";

import { v2 as cloudinary } from "cloudinary";

export const addCategory  = async (req, res)=> {
    try{
        console.log('Request body:', req.body);
        console.log('Request file:', req.file);
        
        const name = req.body?.name;
        if(!name || !req.file){
            return res
            .status(400)
            .json({message: "Name and image are require", success: false});

        }
        const alreadyExisst = await Category.findOne({name});
        if(alreadyExisst){
            return res
            .status(400)
            .json({message:"category already exist" , success:false})
        }
        const result = await cloudinary.uploader.upload(req.file.path);
        const newCategory = await Category.create({
            name , 
            image:result.secure_url
        });
        res.status(201).json({
          message: "Category added",
          success: true,
          category : newCategory, 
        });
    }
    catch(error){
        console.error('Add category error:', error);
        return res.status(500).json({message:"Internal server error", success:false, error: error.message })
    }
}
export const getAllCategories = async(req,res) => {
    try{
        console.log('Getting all categories...');
        const categories = await Category.find().sort({createdAt: -1});
        console.log('Categories found:', categories.length);
        res.status(200).json({success:true, categories});
    }
    catch(error){
        console.error('Get categories error:', error);
        return res.status(500).json({message:"Internal server error", success:false, error: error.message})
    }
}

export const updateCategory = async(req,res) => {
    try{
        console.log('Update request params:', req.params);
        console.log('Update request body:', req.body);
        console.log('Update request file:', req.file);
        
        const {id}  = req.params;
        const name = req.body?.name;

        const category = await Category.findById(id);
        if(!category){
            return res
            .status(404)
            .json({message: "Category not found" , success:false});

        };
        if(req.file){
            const result = await cloudinary.uploader.upload(req.file.path);
            category.image  = result.secure_url;
        }
        if(name) category.name  = name ;
        await category.save();
             return  res
        .status(200)
            .json({message: "Category updated" , success:true,  category});

    }
    catch(error){
        console.error('Update category error:', error);
        return res.status(500).json({message: "Internal server error", success:false, error: error.message})
    }
}

export const deleteCategory = async(req, res) => {
    try {
        const { id } = req.params;
        
        const category = await Category.findById(id);
        if (!category) {
            return res
                .status(404)
                .json({ message: "Category not found", success: false });
        }
        
        // Delete image from cloudinary if exists
        if (category.image) {
            const publicId = category.image.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(publicId);
        }
        
        await Category.findByIdAndDelete(id);
        
        res.status(200).json({
            message: "Category deleted successfully",
            success: true
        });
    } catch (error) {
        return res.json({ message: "Internal server error", success: false });
    }
}

