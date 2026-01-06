import userModel from '../models/user.Model.js';

export const createUser = async ({
    firstname, lastname , email , password, phone
 }) => {
    if(!firstname || !email || !password || !phone){
        throw new Error('All fields are required');
    }

     const user = await userModel.create({
        fullname: {
            firstname,
            lastname
        },
        email,
        password,
        phone
     })
     return user;
 }