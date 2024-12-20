import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

import MongoDbConnection from "./config/MongoDb.js"
import EnvVars from "./config/EnvVars.js"

import UserRouter from "./router/UserRouter.js"
import PostRouter from "./router/PostRouter.js"
import NotificationRouter from "./router/NotificationRouter.js"
import CommentRouter from "./router/CommentRouter.js"
import MessageRouter from "./router/MessageRouter.js"
import StatusRouter from "./router/StatusRouter.js"
import { app, server } from "./socket/socket.js"
import path from 'path';
const _dirname = path.resolve();

app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(cookieParser())
app.use(cors({
    origin : "http://localhost:3000",
    credentials : true
}))


app.use("/api/v1/user", UserRouter)
app.use("/api/v1/post", PostRouter)
app.use("/api/v1/notification", NotificationRouter)
app.use("/api/v1/comment", CommentRouter)
app.use("/api/v1/message", MessageRouter)
app.use("/api/v1/status", StatusRouter)

app.use(express.static(path.join(_dirname, "/frontend/dist")));
app.get("*", (_, res) => {
    res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"));
});

const PORT = 5000 || EnvVars.PORT
server.listen(PORT , ()=>{
    MongoDbConnection()
    console.log("Server Listing On port" , PORT)
})