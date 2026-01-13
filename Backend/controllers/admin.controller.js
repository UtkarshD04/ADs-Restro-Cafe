import userModel from '../models/user.Model.js';

export const createAdmin = async (req, res) => {
    try {
        // Check if admin already exists
        const adminExists = await userModel.findOne({ isAdmin: true });
        
        if (adminExists) {
            return res.status(400).json({ 
                message: 'Admin user already exists',
                success: false 
            });
        }

        // Hash password from environment variable
        const hashedPassword = await userModel.hashPassword(process.env.ADMIN_PASSWORD);

        const adminUser = await userModel.create({
            fullname: {
                firstname: 'Admin',
                lastname: 'User'
            },
            email: process.env.ADMIN_EMAIL,
            password: hashedPassword,
            phone: '9999999999',
            isAdmin: true,
            isVerified: true
        });

        res.status(201).json({
            message: 'Admin user created successfully',
            success: true,
            credentials: {
                email: process.env.ADMIN_EMAIL,
                password: process.env.ADMIN_PASSWORD
            }
        });
    } catch (error) {
        console.error('Error creating admin:', error);
        res.status(500).json({ 
            message: 'Error creating admin user',
            success: false 
        });
    }
};