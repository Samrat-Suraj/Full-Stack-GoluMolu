import express from "express"
import { GetMessage, SendMessage } from "../controller/MessageController.js"
import protectRoute from "../middleware/ProtectRoute.js"

const router = express.Router()

router.post("/:id/send", protectRoute, SendMessage) // otherUserId
router.get('/all/:id', protectRoute, GetMessage);

export default router