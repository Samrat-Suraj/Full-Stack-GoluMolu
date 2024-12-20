
import Conversation from "../model/ConvarsationModel.js";
import Message from "../model/MessageModel.js";
import User from "../model/UserModel.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const SendMessage = async (req, res) => {
    try {
        const senderId = req.user;
        const receiverId = req.params.id;
        const { message } = req.body;

        const user = await User.findById(senderId)

        if (!message || message.trim().length === 0) {
            return res.status(400).json({ success: false, message: "Message content cannot be empty" });
        }

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });

        if (!conversation) {
            conversation = new Conversation({
                participants: [senderId, receiverId],
                messages: [],
            });
            await conversation.save();
        }

        const newMessage = new Message({
            receiverId,
            senderId: user?._id,
            message,
        });


        await newMessage.save();
        conversation.messages.push(newMessage._id);
        await conversation.save();

        const receiverSocketId = getReceiverSocketId(receiverId)
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage)
        }

        res.status(200).json({ success: true, message: "Message sent successfully", newMessage });

    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ success: false, message: "Failed to send message", error: error.message });
    }
};

export const GetMessage = async (req, res) => {
    try {
        const senderId = req.user;
        const receiverId = req.params.id;

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        }).populate('messages');

        if (!conversation) {
            return res.status(200).json({ messages: [], success: true });
        }

        return res.status(200).json({ messages: conversation.messages, success: true });

    } catch (error) {
        console.log("Error In GetMessage Controller", error.message);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};
