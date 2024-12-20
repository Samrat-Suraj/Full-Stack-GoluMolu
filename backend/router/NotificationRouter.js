import express from "express"
import protectRoute from "../middleware/ProtectRoute.js"
import { DeleteAllNotification, DeleteNotificationById, GetAllNotification } from "../controller/NotificationController.js"
const router = express.Router()

router.get("/get" , protectRoute, GetAllNotification)
router.delete("/delete" , protectRoute, DeleteAllNotification)
router.delete("/delete/:id" , protectRoute, DeleteNotificationById)

export default router