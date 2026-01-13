import userModel from '../models/user.Model.js'
import * as userServices from '../services/user.service.js'
import {validationResult} from 'express-validator'
import blacklistTokenModel from '../models/blacklistToken.model.js'

export const registerUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

   //  console.log(req.body);
    const { fullname, email, password, phone } = req.body;
    const hashPassword = await userModel.hashPassword(password);

    const user = await userServices.createUser(
       { firstname: fullname.firstname,
         lastname: fullname.lastname,
          email,
         password: hashPassword,
         phone
        } );
   const token =  await user.generateAuthToken();
  // Printing token for debugging purposes. You can remove it before production.  // DO NOT LOG SECRET KEYS IN PRODUCTION!  // You should
   res.status(201).json({ user, token });
}

export const loginUser = async (req, res) => {
 
const errors = validationResult(req);
 if(!errors.isEmpty()){
    return res.status(400).json({ errors: errors.array() });
 }

 const { email , password} = req.body;

 const user = await userModel.findOne({email}).select('+password');

 if(!user){
    return res.status(401).json({ error: 'Invalid email or password' });

 } 
 const isMatch = await user.comparePassword(password);

 if(!isMatch){
    return res.status(401).json({message:'Invalid email or password'});

 }

 const token = await user.generateAuthToken();
    res.cookie('token', token);
    
    // Check if user is admin and return appropriate response
    if (user.isAdmin) {
        res.status(200).json({ 
            message: 'Admin login successful',
            token, 
            user,
            isAdmin: true,
            redirectTo: '/admin-panel'
        });
    } else {
        res.status(200).json({ 
            message: 'Login successful',
            token, 
            user,
            isAdmin: false,
            redirectTo: '/dashboard'
        });
    }

 
}

export const getUserProfile = async (req, res) => { 
   res.status(200).json(req.user);
 }
 
export const logoutUser = async (req, res) => {
    res.clearCookie('token');
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    await blacklistTokenModel.create({ token });

    res.status(200).json({ message: 'Logged out' });

}