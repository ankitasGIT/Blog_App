import {asyncHandler} from "../utils/asyncHandler.js";

const registerUser = asyncHandler( (req, res, next) => {
    res.status(200).json({
        message: "Hello user"
    })
} )

export {registerUser};