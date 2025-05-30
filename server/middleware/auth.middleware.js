import jwt from 'jsonwebtoken';
import { User } from '../Models/user.model.js';


export const protectRoute = async (req,res,next) => {
    try {
       const token = req.cookies.access_token 
       if(!token){
            return res.status(401).json({
                success: false,
                message: "Not authorized to access this route"
            })
       }
        const decoded = jwt.verify(token,process.env.JWT_SECRETKEY)
        if(!decoded){
            return res.status(401).json({
                success: false,
                message: "Not authorized to access Invalid token"
            })
        }
        // console.log(decoded)
        const user = await User.findById(decoded.userId).select("-password")
        if(!user){
            return res.status(401).json({
                success: false,
                message: "User not found"
            })
        }
        req.user = user
        next()
    } catch (error) {
        res.status(500).json({
            success: false,
            failure: "Internal server error",
            message: error.message
        })
        
    }
}