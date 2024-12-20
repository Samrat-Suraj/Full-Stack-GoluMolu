import express from "express"
import protectRoute from "../middleware/ProtectRoute.js"
import { CreateStatus, DeleteStatus, GetMyAllStatus, GetStatusByFollowedUser } from "../controller/StatusController.js"
import upload from "../utils/Multer.js"
const router = express.Router()

router.post("/create", protectRoute, upload.single("image"), CreateStatus)
router.post("/delete", protectRoute, DeleteStatus)
router.get("/get", protectRoute, GetMyAllStatus)
router.get("/userstatus", protectRoute, GetStatusByFollowedUser)

export default router