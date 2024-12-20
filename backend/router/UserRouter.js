import express from "express"
import { BlockUser, ChangeMail, ChangePassword, DeleteAccount, FollowUnFollowUsers, GetAllUser, GetFevPost, getFollowers, getUserByUserName, GetUserProfileById, LoginUser, LogoutUser, RegisterUser, SuggestedUser, UpdateUserProfile } from "../controller/UserController.js"
import protectRoute from "../middleware/ProtectRoute.js"
import upload from "../utils/Multer.js"
const router = express.Router()

router.post("/singup", RegisterUser)
router.post("/login", LoginUser)
router.post("/logout", LogoutUser)

router.get("/suggested", protectRoute, SuggestedUser)
router.get("/alluser", protectRoute, GetAllUser)
router.get("/:id", protectRoute, GetUserProfileById)
router.get("/post/fav", protectRoute, GetFevPost)
router.post("/follow/:id", protectRoute, FollowUnFollowUsers)
router.post("/block/:id", protectRoute, BlockUser)
router.post("/changemail", protectRoute, ChangeMail)
router.post("/changepas", protectRoute, ChangePassword)
router.get("/follow/get", protectRoute, getFollowers)
router.get("/users/:username", protectRoute, getUserByUserName)
router.delete("/delete", protectRoute, DeleteAccount)
router.post("/update", protectRoute, upload.fields([{ name: "coverImage" }, { name: "profilePic" }]), UpdateUserProfile)

export default router