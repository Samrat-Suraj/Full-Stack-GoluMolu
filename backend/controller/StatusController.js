import cloudinary from "../config/Cloudinary.js";
import Status from "../model/statusModel.js";
import User from "../model/UserModel.js";
import DataUri from "../utils/DataUri.js";

export const CreateStatus = async (req, res) => {
    try {
        const { text } = req.body;
        const image = req.file;
        const userId = req.user;

        if (!image) {
            return res.status(400).json({ success: false, message: "No image uploaded" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        const fileUri = DataUri(image);
        if (!fileUri) {
            return res.status(400).json({ success: false, message: "Invalid image file" });
        }

        const cloudResponse = await cloudinary.uploader.upload(fileUri);
        const newStatus = new Status({
            text,
            image: cloudResponse.secure_url,
            author: user
        });

        await newStatus.save();
        await User.findByIdAndUpdate(user._id, { $push: { status: newStatus._id } })
        return res.status(200).json({ success: true, message: "Status created successfully", status: newStatus });
    } catch (error) {
        console.log("Error in CreateStatus Controller", error.message);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};
export const DeleteStatus = async (req, res) => {
    try {
        const userId = req.user;
        const statusId = req.params.id;

        const user = await User.findById(userId)
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        const status = await Status.findById(statusId);
        if (!status) {
            return res.status(400).json({ success: false, message: "Status not found" });
        }

        await Status.findByIdAndDelete(statusId);
        return res.status(200).json({ success: true, message: "Status deleted successfully" });
    } catch (error) {
        console.log("Error in DeleteStatus Controller", error.message);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};
export const GetMyAllStatus = async (req, res) => {
    try {
        const userId = req.user; 
        const statuses = await User.findById(userId).populate("status");
        
        if (statuses.length === 0) {
            return res.status(400).json({ success: false, message: "No Status found" });
        }

        return res.status(200).json({ success: true, statuses: statuses });
    } catch (error) {
        console.log("Error in GetMyAllStatus Controller", error.message);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const GetStatusByFollowedUser = async (req, res) => {
    try {
        const userId = req.user; 
        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is missing" });
        }
        const user = await User.findById(userId)
            .populate('following')
            .populate('followers')
            .populate('status');

        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        const mutualUsers = user.following.filter(followedUser =>
            user.followers.some(follower => follower._id.toString() === followedUser._id.toString())
        );
        const mutualUsersWithStatus = await Promise.all(mutualUsers.map(async (mutualUser) => {
            const mutualUserWithStatus = await User.findById(mutualUser._id).populate('status').exec();
            const mutualUserStatus = mutualUserWithStatus.status || null;

            return {
                ...mutualUser.toObject(),
                status: mutualUserStatus
            };
        }));

        return res.status(200).json({
            success: true,
            mutualUsersWithStatus
        });

    } catch (error) {
        console.error("Error in GetStatusByFollowedUser Controller", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};
