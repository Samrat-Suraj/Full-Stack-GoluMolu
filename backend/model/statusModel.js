import mongoose from "mongoose"

const statusSchema = new mongoose.Schema({
    text: { type: String, default: "" },
    image: { type: String, default: "" },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    likes : {type : mongoose.Schema.Types.ObjectId , ref : "User"}
}, { timestamps: true })

const Status = new mongoose.model("Status" , statusSchema)
export default Status