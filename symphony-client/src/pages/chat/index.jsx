import { useAppStore } from "@/store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Chat = () => {
	const { userInfo } = useAppStore();
	const navigate = useNavigate();

	useEffect(() => {
		if (!userInfo.profileSetup) {
			toast("Please complete profile setup to continue.");
			navigate("/profile");
		}
	}, [userInfo, navigate]); //run this useeffect whenever there's a change in uerinfo or navigate route.

	return <div>Chat</div>;
};

export default Chat;
