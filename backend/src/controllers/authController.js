import User from "../models/User.js";
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';


dotenv.config();

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Helper function to format user response (remove password)
const formatUserResponse = (user) => ({
  id: user._id,
  email: user.email,
});

// Helper function for password hashing
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};



export const register = async(req , res) =>{

    try{
        const {email,password} = req.body;

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(409).json({message: "Email Already Exists"});
        }

        const hashedPassword= await hashPassword(password);
        const newUser= new User({
            email,
            password: hashedPassword,
        });

        const savedUser = await newUser.save();

        const token=generateToken(savedUser._id);

        res.status(201).json({
            token,
            user: formatUserResponse(savedUser),
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
            user:formatUserResponse(user),
        });

    } catch (error) {
        console.log('LOGIN ERROR', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getProfile = async(req, res) => {
    try {
        // req.user is populated by authenticateToken middleware
        res.status(200).json({
            user: formatUserResponse(req.user),
        });
    } catch (error) {
        console.log('GET PROFILE ERROR', error);
        res.status(500).json({ message: 'Server error' });
    }
};