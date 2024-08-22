import { Server as SocketIoServer } from "socket.io";
import Message from "./models/MessagesModel.js";

const setupSocket = (server) => {
	const io = new SocketIoServer(server, {
		cors: {
			origin: process.env.ORIGIN,
			methods: ["GET", "POST"],
			credentials: true,
		},
	});

	const userSocketMap = new Map();

	const disconnect = (socket) => {
		console.log(`Client disconnected: ${socket.id}`);
		for (const [userId, socketId] of userSocketMap.entries()) {
			if (socketId === socket.id) {
				userSocketMap.delete(userId);
				break;
			}
		}
	};

	const sendMessage = async (message) => {
		const senderSocketId = userSocketMap.get(message.sender);
		const recipientSocketId = userSocketMap.get(message.recipient);

		const createdMessage = await Message.create(message);

		const messageData = await Message.findById(createdMessage._id)
			.populate("sender", "id email firstName lastName image color")
			.populate("recipient", "id email firstName lastName image color");

		if (recipientSocketId) {
			io.to(recipientSocketId).emit("receiveMessage", messageData);
		}
		if (senderSocketId) {
			io.to(senderSocketId).emit("sendMessage", messageData);
		}
	};

	io.on("connection", (socket) => {
		const userId = socket.handshake.query.userId;

		if (userId) {
			userSocketMap.set(userId, socket.id);
			console.log(`User connected: ${userId} with socket id: ${socket.id}`);
		} else {
			console.log(`User Id not provided during connection.`);
		}

		socket.on("send_message", (message) => {
			console.log("Message received:", message);
		});
		socket.on("disconnect", () => disconnect);
	});
};

export default setupSocket;
