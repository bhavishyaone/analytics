import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'


const generateToken = (userId)=>{
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

};

export const register = async(req,res)=>{

   try{

        const {email,password} = req.body

        if(!email || !password){
            return res.status(400).json({message:"All field are required."})
        }

        const existingUser = await User.findOne({email})
        if(existingUser){
            return res.status(400).json({message:"User already exists."})
        }

        const hashedPassword = await bcrypt.hash(password,10)

        const user = await User.create({email:email,password:hashedPassword})

        return res.status(201).json({message:"User created",user})
   }
    catch(err){
        console.log(err)
        return res.status(500).json("server error.")
    }

};

export const login = async(req,res)=>{
    try{
        const {email,password} = req.body

        const user = await User.findOne({email});
        if (!user)
            return res.status(401).json({message:"Invalid credentials"});

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(401).json({message:"Invalid credentials"});

        const token = generateToken(user._id);
        return res.json({message:"Login Successfully",token});
    }
    catch(err){
        console.log(err)
        return res.status(500).json({message:"server error"})
    }

};




