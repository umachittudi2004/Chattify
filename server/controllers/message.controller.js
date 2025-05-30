import { User } from "../Models/user.model.js"
import messageModel from '../Models/message.model.js'
import cloudinary from "../lib/cloudinary.js"
import { getRecevierSocketId, io } from "../lib/socket.js"

export const getUsersForSideBar = async (req,res) => {
    try {
        const loggedInUser = req.user._id
        const filteredUsers = await User.find({_id : {$ne : loggedInUser}}).select("-password -__v -createdAt -updatedAt")
        if(filteredUsers.length === 0){
            return res.status(404).json({
                success: false,
                failure: "No users found",
            })
        }
        res.status(200).json({
            success: true,
            message: "Users found",
            data : filteredUsers
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            failure: "Internal server error",
            message: error.message
        })
        
    }
}

export const getMessages = async (req,res) => {
    try {
        const {id:receiverId} = req.params
        const senderId = req.user._id
        const messages = await messageModel.find({
            $or : [
                {senderId:senderId,receiverId:receiverId},
                {senderId:receiverId,receiverId:senderId}
            ]
        })
        res.status(201).json(messages)
    } catch (error) {
        return res.status(500).json({
            message : error.message,
            success : false
        })
    }
}

export const sendMessage = async (req,res) => {
    try {
        const {text,image} = req.body;
        const {id:receiverId} = req.params
        const senderId = req.user._id
        let imageUrl;
        if(image){
            const uploadResponce = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponce.secure_url;
        }
        const newMessage = new messageModel({
            senderId,
            receiverId,
            text,
            image : imageUrl
        })
        await newMessage.save();
        const reseverSocketId = getRecevierSocketId(receiverId); // Get the receiver's socket ID
        if(reseverSocketId){
            io.to(reseverSocketId).emit('newMessage',newMessage)
        }
        res.status(201).json(newMessage)
    } catch (error) {
        return res.status(500).json({
            message : error.message,
            success : false
        })
    }
}