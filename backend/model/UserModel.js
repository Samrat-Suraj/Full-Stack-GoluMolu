import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    fullname: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    profilePic: { type: String, default: "" },
    coverImage: { type: String, default: "" },
    link : { type: String, default: "" },
    bio: { type: String, default: "" },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    blocked : [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    status : [{type : mongoose.Schema.Types.ObjectId , ref : "Status"}]
    
}, { timestamps: true })

const User = mongoose.model("User", userSchema)
export default User
