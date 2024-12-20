import express from "express"
import protectRoute from "../middleware/ProtectRoute.js"
import { BookmarksPost, createPost, DeletePost, GetAllFeedPosts, GetPostById, LikePost } from "../controller/PostController.js"
import upload from "../utils/Multer.js"
const router = express.Router()

router.post("/create" , protectRoute , upload.single("image"),createPost)
router.get("/feed" , protectRoute , GetAllFeedPosts)
router.get("/post/:id" , protectRoute , GetPostById)
router.post("/like/:id" , protectRoute , LikePost)
router.post("/bookmark/:id" , protectRoute , BookmarksPost)
router.post("/delete/:id" , protectRoute , DeletePost)

export default router