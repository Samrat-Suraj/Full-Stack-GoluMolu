import User from "../model/UserModel.js";
import bcrypt from "bcryptjs"
import GenCookieAndSetCookies from "../utils/GenCookieAndSetCookies.js";
import cloudinary from "../config/Cloudinary.js";
import DataUri from "../utils/DataUri.js";
import Notification from "../model/NotificationModel.js";
import Post from "../model/PostModel.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
import Comment from "../model/CommentModel.js";
import Status from "../model/statusModel.js";
import Message from "../model/MessageModel.js";

export const RegisterUser = async (req, res) => {
    try {
        const { email, username, password, fullname } = req.body;

        if (!email || !username || !password || !fullname) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }


        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address. Ensure the format is correct (e.g., user@example.com)."
            });
        }


        if (password.length < 6) {
            return res.status(400).json({ success: false, message: "Password must be at least 6 characters long" });
        }


        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email or Username already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, salt);
        } catch (error) {
            return res.status(500).json({ success: false, message: "Error while hashing password" });
        }


        const newUser = new User({
            username,
            password: hashedPassword,
            email,
            fullname
        });

        await newUser.save();
        GenCookieAndSetCookies(newUser._id, res);

        return res.status(201).json({
            success: true,
            message: "Account created successfully",
            user: {
                ...newUser._doc,
                password: null
            }
        });

    } catch (error) {
        console.error("Error in RegisterUser controller:", error.message);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};
export const LoginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }


        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address. Ensure the format is correct (e.g., user@example.com)."
            });
        }


        if (password.length < 6) {
            return res.status(400).json({ success: false, message: "Password must be at least 6 characters long" });
        }


        const user = await User.findOne({ email: email })
        if (!user) {
            return res.status(400).json({ success: false, message: "Please Register Your Account" });
        }

        const isCorrentPassword = await bcrypt.compare(password, user.password)
        if (!isCorrentPassword) {
            return res.status(400).json({ success: false, message: "Invaild Password Or Email Address" });
        }


        const populatedPosts = await Promise.all(
            user.posts.map(async (postId) => {
                const post = await Post.findById(postId);
                if (post.author.equals(user._id)) {
                    return post;
                }
                return null;
            })
        )

        GenCookieAndSetCookies(user._id, res)
        return res.status(200).json({
            success: true, message: `Welocome Back ${user.fullname}`, user: {
                ...user._doc,
                password: null,
                posts: populatedPosts,
            }
        })

    } catch (error) {
        console.log("Error In LoginUser Controller", error.message)
        return res.status(500).json({ success: false, message: "Internal server Error" })
    }
};
export const LogoutUser = async (req, res) => {
    try {
        res.clearCookie("social")
        return res.status(200).json({ success: true, message: `User Logout Successfully` })
    } catch (error) {
        console.log("Error In LogoutUser Controller", error.message)
        return res.status(500).json({ success: false, message: "Internal server Error" })
    }
};
export const UpdateUserProfile = async (req, res) => {
    try {
        const userId = req.user
        const { bio, fullname, link } = req.body

        const coverImage = req.files && req.files.coverImage ? req.files.coverImage[0] : null
        const profilePic = req.files && req.files.profilePic ? req.files.profilePic[0] : null

        // const isAlreadyUsernameExist = await User.findOne({username : username})
        // if(isAlreadyUsernameExist){
        //     return res.status(400).json({success : false , message : "Please Try Other Username Already Register"})
        // }

        const user = await User.findById(userId)
        if (!user) {
            res.status(400).json({ success: false, message: "User Not Found" })
        }

        if (coverImage) {
            if (user.coverImage) {
                const oldPublicId = user.coverImage.split("/").pop().split(".")[0]
                await cloudinary.uploader.destroy(oldPublicId)
            }
            const fileUri = DataUri(coverImage)
            const cloudResponse = await cloudinary.uploader.upload(fileUri)
            user.coverImage = cloudResponse.secure_url
        }

        if (profilePic) {
            if (user.profilePic) {
                const oldPublicId = user.profilePic.split("/").pop().split(".")[0]
                await cloudinary.uploader.destroy(oldPublicId)
            }
            const fileUri = DataUri(profilePic)
            const cloudResponse = await cloudinary.uploader.upload(fileUri)
            user.profilePic = cloudResponse.secure_url
        }

        user.bio = bio || user.bio
        user.fullname = fullname || user.fullname
        user.link = link || user.link

        await user.save()
        return res.status(200).json({ success: true, message: "Updated Successfully", user })

    } catch (error) {
        console.log("Error In UpdateUserProfile Controller", error.message)
        return res.status(500).json({ success: false, message: "Internal server Error" })
    }
};
export const SuggestedUser = async (req, res) => {
    try {
        const userId = req.user
        const user = await User.findById(userId)
        const isfollowing = user.following

        const users = await User.aggregate([
            { $match: { _id: { $ne: user._id, $nin: isfollowing } } },
            { $project: { password: 0 } },
            { $sample: { size: 14 } }
        ])

        res.status(200).json({ success: true, users })

    } catch (error) {
        console.log("Error In UpdateUserProfile Controller", error.message)
        return res.status(500).json({ success: false, message: "Internal server Error" })
    }
};
export const GetUserProfileById = async (req, res) => {
    try {
        const userId = req.params.id
        const user = await User.findById(userId).populate({ path: "posts followers following bookmarks" })
        if (!user) {
            return res.status(400).json({ success: false, message: "User Not Found" })
        }

        return res.status(200).json({ success: true, user })
    } catch (error) {
        console.log("Error In GetUserProfileById Controller", error.message)
        return res.status(500).json({ success: false, message: "Internal server Error" })
    }
};
export const FollowUnFollowUsers = async (req, res) => {
    try {
        const otherId = req.params.id;
        const userId = req.user;

        const currentUser = await User.findById(userId);
        if (!currentUser) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        const otherUser = await User.findById(otherId);
        if (!otherUser) {
            return res.status(400).json({ success: false, message: "User not found" });
        }


        if (currentUser._id.toString() === otherUser._id.toString()) {
            return res.status(400).json({ success: false, message: "You can't follow/unfollow yourself" });
        }


        const isFollowing = currentUser.following.includes(otherUser._id);

        if (isFollowing) {
            await User.findByIdAndUpdate(currentUser._id, { $pull: { following: otherUser._id } });
            await User.findByIdAndUpdate(otherUser._id, { $pull: { followers: currentUser._id } });
            return res.status(200).json({ success: true, message: "Unfollowed successfully" });
        } else {
            await User.findByIdAndUpdate(currentUser._id, { $push: { following: otherUser._id } });
            await User.findByIdAndUpdate(otherUser._id, { $push: { followers: currentUser._id } });


            const otherUserId = otherUser._id.toString()
            const notification = new Notification({
                from: currentUser,
                to: otherUser,
                type: "follow",
            })

            await notification.save()
            const receiverSocketId = getReceiverSocketId(otherUserId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("notification", notification)
            }

            return res.status(200).json({ success: true, message: "Followed successfully" });
        }

    } catch (error) {
        console.log("Error In FollowUnFollowUsers Controller", error.message);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};
export const BlockUser = async (req, res) => {
    try {
        const otherId = req.params.id;
        const userId = req.user;


        const currentUser = await User.findById(userId);
        if (!currentUser) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        const otherUser = await User.findById(otherId);
        if (!otherUser) {
            return res.status(400).json({ success: false, message: "User not found" });
        }


        if (currentUser._id.toString() === otherUser._id.toString()) {
            return res.status(400).json({ success: false, message: "You can't block/unblock yourself" });
        }


        const isBlocked = currentUser.blocked.includes(otherUser._id);
        if (isBlocked) {
            await User.findByIdAndUpdate(currentUser._id, { $pull: { blocked: otherUser._id } });
            return res.status(200).json({ success: true, message: "Unblocked successfully" });
        } else {
            await User.findByIdAndUpdate(currentUser._id, {
                $push: { blocked: otherUser._id },
                $pull: { followers: otherUser._id, following: otherUser._id }
            });
            return res.status(200).json({ success: true, message: "Blocked successfully" });
        }

    } catch (error) {
        console.log("Error in BlockUser Controller", error.message);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};
export const GetFevPost = async (req, res) => {
    try {
        const userId = req.user;
        const user = await User.findById(userId).populate({ path: "bookmarks posts" })
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({ success: true, user });

    } catch (error) {
        console.log("Error in GetFevPost Controller", error.message);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};
export const GetAllUser = async (req, res) => {
    try {
        const users = await User.find({})
        if (!users) {
            return res.status(400).json({ success: false, message: "No not found" });
        }

        return res.status(200).json({ success: true, users });

    } catch (error) {
        console.log("Error in GetFevPost Controller", error.message);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};
export const ChangeMail = async (req, res) => {
    try {
        const userId = req.user
        const user = await User.findById(userId)
        if (!user) {
            return res.status(400).json({ success: false, message: "User Not Found" });
        }
        const { email } = req.body
        if (!email) {
            return res.status(400).json({ success: false, message: "Email Is Required For Update" });
        }

        const isEmailAlreadyExist = await User.findOne({ email: email })
        if (isEmailAlreadyExist) {
            return res.status(400).json({ success: false, message: "Email Alrady Register Please Another Email" });
        }

        user.email = email || user.email
        await user.save()
        return res.status(200).json({ success: true, message: "Email Updated Successfully" });

    } catch (error) {
        console.log("Error in GetFevPost Controller", error.message);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};
export const ChangePassword = async (req, res) => {
    try {
        const userId = req.user;
        const { oldPassword, newPassword } = req.body;

    
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ success: false, message: "Old password and new password are required" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ success: false, message: "User Not Found" });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Incorrect old password" });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ success: false, message: "New password must be at least 8 characters long" });
        }
        if (oldPassword.length < 6) {
            return res.status(400).json({ success: false, message: "Old password must be at least 8 characters long" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({ success: true, message: "Password updated successfully" });

    } catch (error) {
        console.log("Error in ChangePassword Controller", error.message);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};
export const getFollowers = async (req, res) => {
    try {
        const userId = req.user
        const user = await User.findById(userId).populate({ path: "followers following" })
        if (!user) {
            return res.status(400).json({ success: false, message: "User Not Found" })
        }

        return res.status(200).json({ success: true, followers: user.followers })
    } catch (error) {
        console.log("Error In getFollowers Controller", error.message)
        return res.status(500).json({ success: false, message: "Internal server Error" })   
    }
};
export const getUserByUserName = async (req, res) => {
    try {
        const username = req.params.username;
        const query = {
            $or: [
                { username: { $regex: username, $options: "i" } },
            ]
        };
        const user = await User.findOne(query).select("-password");
        
        if (!user) {
            return res.status(400).json({ success: false, message: "User Not Found" });
        }
        return res.status(200).json({ success: true, user });
    } catch (error) {
        console.log("Error In getUserByUserName Controller", error.message);
        return res.status(500).json({ success: false, message: "Internal server Error" });   
    }
};
export const DeleteAccount = async (req, res) => {
    try {
        const userId = req.user;
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(400).json({ success: false, message: "User Not Found" });
        }

        await Notification.deleteMany({ $or: [{ from: userId }, { to: userId }] });
        await Post.deleteMany({ user: userId });
        await Comment.deleteMany({ user: userId });
        await Status.deleteMany({ user: userId });
        await Message.deleteMany({ user: userId });
        await User.findByIdAndDelete(userId);
        return res.status(200).json({ success: true, message: "Account and associated data deleted successfully" });

    } catch (error) {
        console.log("Error In DeleteAccount Controller", error.message);
        return res.status(500).json({ success: false, message: "Internal server Error" });
    }
};
