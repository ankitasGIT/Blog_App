import {blog} from "../models/blog.models.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import {ApiResponse} from "../utils/apiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";
import { user } from "../models/user.models.js";

const getAllBlogs = asyncHandler( async(req, res) => {
    const allBlogs = await blog.find({}).populate('user_id');

    if(!allBlogs)
    {
        throw new ApiError(401, "No blogs found");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200, 
            {
                BlogCount : allBlogs.length,
                allBlogs
            },
        "All Blogs fetched!"
    )
    )
} )

const createBlog = asyncHandler( async(req, res) => {
    const {title, description, user_id} = req.body 

    if(!title || !description || !user_id)
    {
        throw new ApiError(400, "All fields are required")
    }


    const imageLocalPath = req.files?.image[0]?.path;
    if(!imageLocalPath)
    {
        throw new ApiError(400, "Error while fetching link of image uploaded")
    }

    const img = await uploadOnCloudinary(imageLocalPath);
    
    if(!img)
    {
        throw new ApiError(400, "Image is required")       

    }

    const existingUser = await user.findById(user_id)
    if(!existingUser)
    {
        throw new ApiError(404, "User does not exist")
    }

    // const createdBlog = await blog.create({
    //     title, 
    //     description,
    //     image : img.url
    // })



    const createdBlog = new blog({
        title, 
        description,
        image: img.url,
        user_id: user_id
    });

    const session = await mongoose.startSession()
    session.startTransaction()
    await createdBlog.save({session})
    existingUser.blogs.push(createdBlog)
    await existingUser.save({session})
    await session.commitTransaction()

    await createdBlog.save();

    if(!createdBlog)
        {
            throw new ApiError(500, "Something went wrong while registering a user")
        }


        return res.status(201).json(
            new ApiResponse(200, createdBlog, "Blog posted successfully")
        )
} )

const updateBlog = asyncHandler( async(req, res) => {
    const {title, description, id} = req.body;
    // console.log(req.body._id);

    // console.log(req.user);
    // console.log(blog);
    if(!title || !description)
    {
        throw new ApiError(401, "Some fields are missing check again")
    }

    const imgPath = req.files?.image[0]?.path;

    if(!imgPath)
        {
            throw new ApiError(400, "Image is missing")
        }

    const img = await uploadOnCloudinary(imgPath);

    if(!img.url)
        {
            throw new ApiError(400, "Error while uploading on cloudinary")
        }

    const updatedBlog = await blog.findByIdAndUpdate(
        id,
        {
            $set: {
                title : title,
                description : description,
                image: img.url,
            }
        },
        {new: true}
    )

    return res
    .status(200)
    .json(
        new ApiResponse(201, updatedBlog, "Blog updated successfully")
    )
} )

const getBlogById = asyncHandler( async(req, res) => {
    const id = req.user;
    if(!id)
    {
        throw new ApiError(401, "Blog does not exist");
    }

    return res.status(200)
    .json(
        new ApiResponse(201, id,
        "Blog fetched success")
    )
} )

const deleteBlog = asyncHandler( async(req, res) => {
    const {id} = req.body;
    const deletedBlog = await blog.findByIdAndDelete(id,
        {
            $set:{
                title: undefined,
                description: undefined,
                image: undefined,
                user_id:undefined
            }
        },
        {new: true}
    ).populate("user_id");


    if(!deletedBlog)
    {
        throw new ApiError("Error in deleting blog")
    }

    await deletedBlog.user_id.blogs.pull(deletedBlog);
    await deletedBlog.user_id.save();

    return res.status(201)
    .json(
        new ApiResponse(201, deletedBlog, "Blog deleted successfully")
    )
} )

const userBlog = asyncHandler( async(req, res) => {
    const id = req.user._id;

    const idString = id.toString();
    if(!idString)
    {
        throw new ApiError(400, "User id not fetched")
    }
    
    const fetchUserBlog = await user.findById(idString).populate("blogs");

    if(!fetchUserBlog)
    {
        throw new ApiError(404, "Blog not fetched error")
    }

    return res.status(201)
    .json(
        new ApiResponse(201, 
            {
                fetchUserBlog
            },
            "User blogs fetched successfully"
        )
    );
} )

export {
    getAllBlogs,
    createBlog,
    updateBlog,
    getBlogById,
    deleteBlog,
    userBlog
}