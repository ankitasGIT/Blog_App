//Will verify if user is actually exists or not

import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { user } from "../models/user.models.js";
import { ApiError } from "../utils/apiError.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        console.log(token);
        
        if(!token)
        {
            throw new ApiError(401, "Unauthorized access");
        }
    
        //if token is present ask jwt is it valid or not
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
        const checkUser = await user.findById(decodedToken?._id).select("-password -refreshToken");
    
        if(!checkUser)
        {
            throw new ApiError(401, "Invalid access token");
        }
    
        req.user = checkUser;
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }    
} )