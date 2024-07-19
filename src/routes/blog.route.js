import { Router } from "express";
import { createBlog, deleteBlog, getAllBlogs, getBlogById, updateBlog, userBlog } from "../controller/blog.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/all-blog").get(verifyJWT , getAllBlogs)

router.route("/create-blog").post(verifyJWT, upload.fields(
    [{
        name: "image",
        maxCount: 1
    }]
),
    createBlog)
    
router.route("/update-blog").post(verifyJWT,
    upload.fields(
        [{
            name: "image",
            maxCount: 1
        }]
    ),
    updateBlog)

    //get current logged in user
router.route("/get-blog").post(verifyJWT, getBlogById)

router.route("/delete-blog").delete(verifyJWT, deleteBlog)

//get user blogs
router.route("/user-blog").get( verifyJWT, userBlog);

export default router;