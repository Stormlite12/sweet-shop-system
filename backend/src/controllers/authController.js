import User from "../models/User.js";
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';


dotenv.config();

export const registration = async(req , res) =>{

    try{
        const {email,password} = req.body;

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(409).json({messgae: "Email Already Exists"});
        }

        const salt= await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const newUser= new User({
            email,
            password: hashedPassword,
        });

        const savedUser = await newUser.save();

        const token= jwt.sign({id: savedUser._id},process.env.JWT_SECRET,{
            expiresIn: '1h',
        });

        res.status(201).json({
            token,
            user: {
                id: savedUser._id,
                email: savedUser.email,
            },
        });
    }
    catch(error){
        console.log('REGISTRATION ERROR',error);
        res.status(500).json({message:'Server Error', error:error.message});
    }

};