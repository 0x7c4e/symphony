import { useAppStore } from "@/store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ContactsContainer from "./contacts-container";
import EmptyChatContainer from "./empty-chat-container";
import ChatContainer from "./chat-container";

const Chat = () => {
	const { userInfo, selectedChatType } = useAppStore();
	const navigate = useNavigate();

	useEffect(() => {
		if (!userInfo.profileSetup) {
			toast("Please complete profile setup to continue.");
			navigate("/profile");
		}
	}, [userInfo, navigate]); //run this useeffect whenever there's a change in uerinfo or navigate route.

	return (
		<div className="flex h-[100vh] text-white overflow-hidden">
			<ContactsContainer />
			{selectedChatType === undefined ? (
				<EmptyChatContainer />
			) : (
				<ChatContainer />
			)}
		</div>
	);
};

export default Chat;
