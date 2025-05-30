import { generateToken } from "../lib/utils.js"
import { User } from "../Models/user.model.js"
import bcrypt from "bcryptjs"
import cloudinary from "../lib/cloudinary.js"

export const signUp = async (req, res) => {
    const { fullName, email, password } = req.body
    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters long"
            })
        }
        
        const user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            })
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const newUser = await new User({
            fullName,
            email,
            password: hashedPassword
        })
        if (newUser) {
            await newUser.save()
            generateToken(newUser._id, res)
            res.status(201).json({
                message: "User created successfully",
                user : newUser,
                success: true,
            })
        }
        else {
            return res.status(400).json({
                success: false,
                message: "User not created"
            })
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            failure: "Internal server error",
            message: error.message
        })
    }
}

export const logIn = async(req, res) => {
    try{
        const {email,password} = req.body
        if(!email || !password){
            return res.status(400).json({
                message : "All fields are required",
                success : false,
            })
        }
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({
                message : "Email not found",
                success : false,
            })
        }
        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(400).json({
                message : "Invalid credentials",
                success : false,
            })
        }
        generateToken(user._id,res)
        res.status(200).json({
            message : "Logged in successfully",
            success : true,
            user : user
        })
    }
    catch(error){
        res.status(500).json({
            success: false,
            failure: "Internal server error",
            message: error.message
        })
    }

}

export const logOut = (req, res) => {
    try {
        res.clearCookie("access_token", {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV !== "development",
            Path : "/"
        }).status(200).json({
            success: true,
            message: "Logged out successfully"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            failure: "Internal server error",
            message: error.message
        })
    }
}

export const updateProfile = async (req,res) => {
    try {
        const {profilePic} = req.body
        const userId = req.user._id
        if(!profilePic){
            return res.status(400).json({
                success: false,
                message: "Profile pic is required"
            })
        }
        const uploadResponce = await cloudinary.uploader.upload(profilePic)
        if(!uploadResponce){
            return res.status(400).json({
                success: false,
                message: "Image upload failed"
            })
        }
        const updatedUser = await User.findByIdAndUpdate(userId,{
            profilePic : uploadResponce.secure_url
        },{
            new : true,
        })
        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user : updatedUser
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            failure: "Internal server error",
            message: error.message
        })
    }
}

export const checkAuth = async (req, res) => {
    try {
        const user = req.user
        if(!user){
            return res.status(401).json({
                success: false,
                message: "Not authorized to access this route"
            })
        }
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({
            success: false,
            failure: "Internal server error",
            message: error.message
        })
    }
}