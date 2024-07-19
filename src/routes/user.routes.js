import { Router } from "express";
import { getAllUsers, loginUser, logoutUser, registerUser, refreshAccessToken } from "../controller/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/all-users").get(verifyJWT, getAllUsers);


router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);



export default router;