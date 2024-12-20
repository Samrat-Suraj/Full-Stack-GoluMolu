import Notification from "../model/NotificationModel.js"
import User from "../model/UserModel.js"

export const GetAllNotification = async (req, res) => {
    try {
        const notifications = await Notification.find({}).populate("from to post")
        if (notifications.length === 0) {
            return res.status(400).json({ success: false, message: "No Notification" })
        }
        return res.status(200).json({ success: true, notifications })
    } catch (error) {
        console.log("Error In GetAllNotification Controller", error.message)
        return res.status(500).json({ success: false, message: "Internal server Error" })
    }
}

export const DeleteAllNotification = async (req, res) => {
    try {
        const userId = req.user
        if (!userId) {
            return res.status(401).json({ success: false, message: "User not authenticated" })
        }

        const user = await User.findById(userId)
        if (!user) {
            return res.status(400).json({ success: false, message: "User Not Found" })
        }
        
        await Notification.deleteMany({ to: userId })
        return res.status(200).json({ success: true , message : "All Notication Delete Successfully" })
    } catch (error) {
        console.log("Error In DeleteAllNotification Controller", error.message)
        return res.status(500).json({ success: false, message: "Internal server Error" })
    }
}


export const DeleteNotificationById = async (req, res) => {
    try {
        const notiId = req.params.id
        if (!notiId) {
            return res.status(400).json({ success: false, message: "Notification Id Not Found" })
        }

        const notification = await Notification.findById(notiId)
        if (!notification) {
            return res.status(404).json({ success: false, message: "Notification not found" })
        }

        await Notification.findByIdAndDelete(notiId)
        return res.status(200).json({ success: true , message : "Notication Delete Successfully" })
    } catch (error) {
        console.log("Error In DeleteNotificationById Controller", error.message)
        return res.status(500).json({ success: false, message: "Internal server Error" })
    }
}
