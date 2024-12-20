import express from "express"
import { CreateComment, DeleteComment, GetComment } from "../controller/CommentController.js"
import protectRoute from "../middleware/ProtectRoute.js"
const router = express.Router()

router.post("/:id/create", protectRoute, CreateComment) // post Id
router.get("/:id/get", protectRoute, GetComment) //postId
router.delete("/:id/delete", protectRoute, DeleteComment) //Comment Id


export default router