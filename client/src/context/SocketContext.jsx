import { useAppStore } from "@/store";
import { HOST } from "@/utils/constants";
import { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
	const socket = useRef();
	const { userInfo } = useAppStore();

	useEffect(() => {
		if (userInfo) {
			socket.current = io(HOST, {
				withCredentials: true,
				query: { userId: userInfo.id },
			});
			socket.current.on("connect", () => {
				console.log("connected to socket server");
			});

			return () => {
				socket.current.disconnect();
			};
		}
	}, [userInfo]);

	const handleReceiveMessage = (message) => {
		const { selectedChatType, selectedChatData, addMessage } =
			useAppStore.getState();
		if (
			selectedChatType !== undefined &&
			selectedChatData._id === message.recipient._id
		) {
			addMessage(message);
		}
	};

	socket.current.on("receiveMessage", handleReceiveMessage);

	return (
		<SocketContext.Provider value={socket.current}>
			{children}
		</SocketContext.Provider>
	);
};
