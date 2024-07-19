import {asyncHandler} from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import {user} from "../models/user.models.js";
import { ApiResponse } from "../utils/apiResponse.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const registerUser = asyncHandler(async (req, res, next) => {

    const {username, email, password} = req.body;
    console.log(username);
    
    if(username === "" || email === "" || password === "")
    {
        throw new ApiError(400, "All fields are compulsory!");
    }

    const existedUser = await user.findOne({username});
    // const a = user.findOne({email});

    if(existedUser)
    {
        throw new ApiError(409, "Error");
    }

    
    const createdUser = await user.create({
        username: username,
        email: email,
        password: password
    })

    const user_created_or_not = await user.findById(createdUser._id);

    if(!user_created_or_not)
        {
            throw new ApiError(500, "Something went wrong while registering a user")
        }

    return res.status(200).json(
        new ApiResponse(200, user_created_or_not, "Success")
    )
} )

const getAllUsers = asyncHandler( async(req, res, next) => {
    const allusers = await user.find({});

    return res.status(200).json({
        userCount: allusers.length,
        success: true,
        message: "All users data ",
        allusers
    });
})

const generateAccessAndRefreshTokens = async(userId) => {
    try {
        const foundUser = await user.findById(userId);
        const accessToken = foundUser.generateAccessTokens();
        const refreshToken = foundUser.generateAccessTokens();

        foundUser.refreshToken = refreshToken;
        await foundUser.save({vaidateBeforeSave : false})

        return {accessToken, refreshToken};
    } catch (error) {
        throw new ApiError(401, "Something went wrong while generating tokens")
    }
}

const loginUser = asyncHandler(async (req, res) => {
    const {username, email, password} = req.body;

    if(!username && !email)
    {
        throw new ApiError(400, "Username or email required");
    }

    const findUser = await user.findOne({
        $or: [{email}, {username}]
    })

    if(!findUser)
    {
        throw new ApiError(404, "User does not exist");
    }

    // const isValidPassword = await findUser.isPasswordCorrect(password);
    const isValidPassword = await bcrypt.compare(password, findUser.password);

    if(!isValidPassword)
    {
        throw new ApiError(404, "Invalid password");
    }
    
    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(findUser._id);

    const loggedInUser = await user.findById(findUser._id).select(
        "-password -refreshToken" 
    )

    const options = {
        httpOnly: true,
        secure : true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(200, {
            user: loggedInUser, accessToken, refreshToken
        },
        "User logged in successfully"
    )
    )



} )

const logoutUser = asyncHandler(async(req, res) => {
    await user.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure : true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
        new ApiResponse(200, {}, "User logged out successfully")
    )

})


const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingToken = req.cookies.refreshToken || req.body.refreshToken;

    if(!incomingToken)
    {
        throw new ApiError(401, "Unauthorized request")
    }
    try {
        
            const decodedToken = jwt.verify(
                incomingToken,
                process.env.REFRESH_TOKEN_SECRET
            )
        
            const getUser = await user.findById(decodedToken?._id);
        
            if(!getUser)
            {
                throw new ApiError(401, "Invalid refresh token")
            }
        
            if(incomingToken !== user?.refreshToken){
                throw new ApiError(401, "Invalid refresh token")
            }
        
            const options={
                httpOnly: true, 
                secure: true
            }
        
            const {accessToken, newRefreshToken} = await generateAccessAndRefreshTokens(user._id);
        
            return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                200, 
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh Token")
    }
} )
export {registerUser, logoutUser, refreshAccessToken};
export {loginUser};
export {getAllUsers};