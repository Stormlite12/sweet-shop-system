
import User from "../models/User.js";
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';


dotenv.config();

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};



export const register = async(req , res) =>{

    try{
        const {email,password} = req.body;

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(409).json({message: "Email Already Exists"});
        }

        const salt= await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const newUser= new User({
            email,
            password: hashedPassword,
        });

        const savedUser = await newUser.save();

        const token=generateToken(savedUser._id);

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


//login function
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = generateToken(user._id);

        res.status(200).json({
            token,
            user: {
                id: user._id,
                email: user.email,
            }
        });

    } catch (error) {
        console.log('LOGIN ERROR', error);
        res.status(500).json({ message: 'Server error' });
    }
};