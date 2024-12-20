import express from "express"
import http from "http"
import { Server } from "socket.io"

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["POST", "GET"]
    }
})

const userSocketMap = {}
export const getReceiverSocketId = (receiverId) => userSocketMap[receiverId]

io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId
    if (userId) {
        userSocketMap[userId] = socket.id
        console.log(`Connected On User Id : ${userId} And ${socket.id}`)
    }

    io.emit("GetUserOnline", Object.keys(userSocketMap))

    socket.on("disconnect", () => {
        if (userId) {
            console.log(`Disconnected On User Id : ${userId} And ${socket.id}`)
            delete userSocketMap[userId]
        }
        io.emit("GetUserOnline", Object.keys(userSocketMap))
    })
})

export { app, server, io };