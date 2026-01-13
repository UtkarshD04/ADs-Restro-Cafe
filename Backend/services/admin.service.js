import userModel from '../models/user.Model.js';

export const createAdminUser = async () => {
    try {
        // Check if admin already exists
        const adminExists = await userModel.findOne({ isAdmin: true });
        
        if (!adminExists) {
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
            
            console.log('Admin user created successfully');
            return adminUser;
        } else {
            console.log('Admin user already exists');
            return adminExists;
        }
    } catch (error) {
        console.error('Error creating admin user:', error);
    }
};