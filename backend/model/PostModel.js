import mongoose from "mongoose"

const postSchema = new mongoose.Schema({
    caption: { type: String, required: true },
    image: { type: String, required: true },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true })

const Post = mongoose.model("Post", postSchema)
export default Post