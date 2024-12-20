import mongoose from "mongoose";

const noticationSchema = new mongoose.Schema({
    from : {type : mongoose.Schema.Types.ObjectId , ref : "User"},  
    to : {type : mongoose.Schema.Types.ObjectId , ref : "User"},  
    type : {type : String , enum : ["follow" , "like"]},
    read : {type : Boolean , default : false},
    post : {type : mongoose.Types.ObjectId , ref : "Post"}
},{timestamps : true})

const Notification = mongoose.model("Notification" , noticationSchema)
export default Notification