
import {Router} from "express"
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import {  
    changeCurrentPassword, 
    getCurrentUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    updateAccountDetails,
    updateAvator,
   updateBudget,
   userRegister
         } from "../controllers/user.controller.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const router=Router();

//  register route
router.route("/register").post(
    upload.fields([{
        name:"avatar",
        maxCount:1
    }]),
    userRegister);

// login route
router.route("/login").post(loginUser)

// logout route
router.route("/logout").post(verifyJWT,logoutUser)

// refresh token route
router.route("/refresh-token").post(refreshAccessToken)

// change password route
router.route("/change-password").post(verifyJWT, changeCurrentPassword)

// get current user route
router.route("/current-user").get(verifyJWT, getCurrentUser)

// update user detail route
router.route("/update-details").patch(verifyJWT, updateAccountDetails)

// update avator route
router.route("/update-avatar").patch(verifyJWT, upload.single("avatar"), updateAvator);

// update budget route
router.route("/update-budget").patch(verifyJWT, updateBudget)

// for authentication , is user logged in or not !
router.route("/dashboard").get(verifyJWT,(req, res) => {
    if(!req.user){
        return res.json(new ApiResponse(400,req.user,"User unauthorised ! "))
    }
    res.json(new ApiResponse(200,req.user,"User is logged In !"));
});
export default router