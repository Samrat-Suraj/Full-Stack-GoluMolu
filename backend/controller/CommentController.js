import Comment from "../model/CommentModel.js"
import Post from "../model/PostModel.js"
import User from "../model/UserModel.js"

export const CreateComment = async (req, res) => {
    try {
        const userId = req.user
        const { text } = req.body
        const postId = req.params.id

        if (!text) {
            return res.status(400).json({ success: false, message: "Text is required" })
        }
        const user = await User.findById(userId)
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" })
        }
        const post = await Post.findById(postId)
        if (!post) {
            return res.status(400).json({ success: false, message: "Post not found" })
        }


        const newComment = new Comment({
            author: user,
            postId: post._id,
            text
        })

        await newComment.save()
        await Post.findByIdAndUpdate(post._id, { $push: { comments: newComment._id } })
        return res.status(200).json({ success: true, message: "Commented Successfully", comment: newComment })

    } catch (error) {
        console.log("Error In CreateComment Controller", error.message)
        return res.status(500).json({ success: false, message: "Internal server Error" })
    }
}

export const GetComment = async (req, res) => {
    try {
        const postId = req.params.id
        const post = await Post.findById(postId)
        const comments = await Comment.find({ postId: post._id }).populate({ path: "author", select: "username fullname profilePic" })
        if (!comments) {
            return res.status(400).json({ success: false, message: "No Comment" })
        }

        return res.status(200).json({ success: true, comments })
    } catch (error) {
        console.log("Error In GetComment Controller", error.message)
        return res.status(500).json({ success: false, message: "Internal server Error" })
    }
}
export const DeleteComment = async (req, res) => {
    try {
        const userId = req.user
        const commentId = req.params.id
        const comment = await Comment.findById(commentId).populate("author")
        if (!comment) {
            return res.status(400).json({ success: false, message: "Comment Not Found" })
        }
        const user = await User.findById(userId)
        if (!user) {
            return res.status(400).json({ success: false, message: "User Not Found" })
        }
        if(user?._id.toString() !== comment.author._id.toString()){
            return res.status(400).json({ success: false, message: "You Are The Not Author of This Comment" })
        }

        await Comment.findByIdAndDelete(commentId)
        return res.status(200).json({ success: true , message: "Comment Deleted Successfully" })
        
    } catch (error) {
        console.log("Error In DeleteComment Controller", error.message)
        return res.status(500).json({ success: false, message: "Internal server Error" })
    }
}