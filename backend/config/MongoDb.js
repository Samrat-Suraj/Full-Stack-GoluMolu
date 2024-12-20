import mongoose from "mongoose";
import EnvVars from "./EnvVars.js";



const MongoDbConnection = async()=>{
    try {
        const conn = await mongoose.connect(EnvVars.MONGO_URI)
        console.log("MongoDb Connected On : ---- ", conn.connection.host)
    } catch (error) {
        console.log("Error In Connection Of MongoDb : ----" , error.message)
        process.exit(1)
    }
}


export default MongoDbConnection