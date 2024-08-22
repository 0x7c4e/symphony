import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store";
import { HOST } from "@/utils/constants";
import { FaPlus } from "react-icons/fa";
import { RiCloseFill } from "react-icons/ri";

const ChatHeader = () => {
	const { closeChat, selectedChatData, selectedChatType } = useAppStore();
	return (
		<div className="h-[7vh] border-b-2 border-[#2f303b] flex items-center justify-between px-20">
			<div className="flex gap-5 items-center w-full justify-between">
				<div className="flex gap-3 items-center justify-center">
					<div className="w-12 h-12 relative">
						<Avatar className="h-12 w-12 rounded-full overflow-hidden">
							{selectedChatData.image ? (
								<AvatarImage
									src={`${HOST}/${selectedChatData.image}`}
									alt="profile"
									className="object-cover w-full h-full bg-black"
								/>
							) : (
								<div
									className={`uppercase h-full w-full text-lg flex items-center justify-center rounded-full ${getColor(
										selectedChatData.color
									)}`}
								>
									{selectedChatData.firstName
										? selectedChatData.firstName.charAt(0)
										: selectedChatData?.email.charAt(0)}
								</div>
							)}
						</Avatar>
					</div>
					<div className="flex flex-col">
						{selectedChatType === "contact" && selectedChatData.firstName
							? `${selectedChatData.firstName} ${selectedChatData.lastName}`
							: selectedChatData.email}
					</div>
				</div>
				<div className="flex items-center justify-center gap-5">
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger>
								<RiCloseFill className="text-3xl" onClick={closeChat} />
							</TooltipTrigger>
							<TooltipContent className=" border-none text-white">
								<p>Close Chat</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
					{/* <button className="text-neutral-500 focus:border-none focus:outline-none focus:text-white rounded-lg duration-300 transition-all">
					</button> */}
				</div>
			</div>
		</div>
	);
};

export default ChatHeader;
