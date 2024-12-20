import cloudinary from "../config/Cloudinary.js"
import Comment from "../model/CommentModel.js"
import Notification from "../model/NotificationModel.js"
import Post from "../model/PostModel.js"
import User from "../model/UserModel.js"
import { getReceiverSocketId, io } from "../socket/socket.js"
import DataUri from "../utils/DataUri.js"

export const createPost = async (req, res) => {
    try {
        const userId = req.user
        const { caption } = req.body
        let image = req.file

        if (!caption) {
            return res.status(400).json({ success: false, message: "Caption Is Required" })
        }

        const user = await User.findById(userId)
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" })
        }

        const fileUri = DataUri(image)
        let cloudResponse = await cloudinary.uploader.upload(fileUri)

        const newPost = new Post({
            caption,
            image: cloudResponse.secure_url,
            author: user
        })

        await newPost.save()
        await User.findByIdAndUpdate(user._id, { $push: { posts: newPost._id } })
        return res.status(200).json({ success: true, message: "Post Created Successfully", post: newPost })

    } catch (error) {
        console.log("Error In createPost Controller", error.message)
        return res.status(500).json({ success: false, message: "Internal server Error" })
    }
}

export const GetAllFeedPosts = async (req, res) => {
    try {
        const posts = await Post.find({}).populate({ path: "author", select: "username fullname profilePic" })
        if (!posts) {
            return res.status(404).json({ success: false, message: "No Posts !" })
        }
        res.status(200).json({ success: true, posts })
    } catch (error) {
        console.log("Error In GetAllFeedPosts Controller", error.message)
        return res.status(500).json({ success: false, message: "Internal server Error" })
    }
}


export const BookmarksPost = async (req, res) => {
    try {
        const postId = req.params.id
        const userId = req.user
        const post = await Post.findById(postId).populate({ path: "author", select: "username fullname profilePic" })
        if (!post) {
            return res.status(400).json({ success: false, message: "Post Not found" })
        }
        const user = await User.findById(userId)
        if (!user) {
            return res.status(400).json({ success: false, message: "User Not found" })
        }

        let isPostAlreadyBookmarks = user.bookmarks.includes(post._id)
        if (isPostAlreadyBookmarks) {
            await User.findByIdAndUpdate(user._id, { $pull: { bookmarks: post._id } })
            return res.status(200).json({ success: true, type: "Unsave", message: "Post Remove BookMarked Successfully" })
        } else {
            await User.findByIdAndUpdate(user._id, { $push: { bookmarks: post._id } })
            return res.status(200).json({ success: true, type: "Saved", message: "Post BookMarked Successfully" })
        }
    } catch (error) {
        console.log("Error In BookmarksPost Controller", error.message)
        return res.status(500).json({ success: false, message: "Internal server Error" })
    }
}

export const LikePost = async (req, res) => {
    try {
        const postId = req.params.id
        const userId = req.user
        const post = await Post.findById(postId).populate({ path: "author", select: "username fullname profilePic"})
        if (!post) {
            return res.status(400).json({ success: false, message: "Post Not found" })
        }
        const user = await User.findById(userId)
        if (!user) {
            return res.status(400).json({ success: false, message: "User Not found" })
        }

        let isPostAlreadyLiked = post.likes.includes(user._id)
        if (isPostAlreadyLiked) {
            await Post.findByIdAndUpdate(post._id, { $pull: { likes: user._id } })
            return res.status(200).json({ success: true, message: "Like Removed Successfully" })
        } else {
            await Post.findByIdAndUpdate(post._id, { $push: { likes: user._id } })

            const postAuthorId = post.author._id.toString()
            const notification = new Notification({
                from: user,
                to: post.author,
                type: "like",
                post : post
            })
            await notification.save()

            const receiverSocketId = getReceiverSocketId(postAuthorId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("notification", notification);
            } else {
                console.log(`No active socket for author ${postAuthorId}`);
            }

            return res.status(200).json({ success: true, message: "Liked Successfully" , notification })
        }

    } catch (error) {
        console.log("Error In BookmarksPost Controller", error.message)
        return res.status(500).json({ success: false, message: "Internal server Error" })
    }
}

export const SharePost = async (req, res) => {
    try {

    } catch (error) {
        console.log("Error In BookmarksPost Controller", error.message)
        return res.status(500).json({ success: false, message: "Internal server Error" })
    }
}

export const DeletePost = async (req, res) => {
    try {
        const userId = req.user
        const postId = req.params.id
        const user = await User.findById(userId)
        if (!user) {
            return res.status(400).json({ success: false, message: "User Not found" })
        }
        const post = await Post.findById(postId)
        if (!post) {
            return res.status(400).json({ success: false, message: "Post Not found" })
        }

        if (post.image) {
            const oldPublicId = post.image.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(oldPublicId)
        }

        await User.findByIdAndUpdate(user._id, { $pull: { posts: post._id } })
        await Post.findByIdAndDelete(post._id)
        await Comment.deleteMany({ postId: post._id })

        res.status(200).json({ success: true, message: "Post Deleted Successfully" })
    } catch (error) {
        console.log("Error In DeletePost Controller", error.message)
        return res.status(500).json({ success: false, message: "Internal server Error" })
    }
}

export const MakePostPrivate = async (req, res) => {
    try {

    } catch (error) {
        console.log("Error In MakePostPrivate Controller", error.message)
        return res.status(500).json({ success: false, message: "Internal server Error" })
    }
}
export const GetPostById = async (req, res) => {
    try {
        const postId = req.params.id
        const post = await Post.findById(postId)
        .populate({ path: "author", select: "username fullname profilePic" })

        if (!post) {
            return res.status(400).json({ success: false, message: "No Post !" })
        }

        return res.status(200).json({ success: true, post })
    } catch (error) {
        console.log("Error In GetPostById Controller", error.message)
        return res.status(500).json({ success: false, message: "Internal server Error" })
    }
}
