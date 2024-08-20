import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store";
import { HOST, LOGOUT_ROUTE } from "@/utils/constants";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { FiEdit2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { TbLogout } from "react-icons/tb";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";

const ProfileInfoComponent = () => {
	const { userInfo, setUserInfo } = useAppStore();
	const navigate = useNavigate();

	const logOut = async () => {
		try {
			const response = await apiClient.post(
				LOGOUT_ROUTE,
				{},
				{ withCredentials: true }
			);

			if (response.status === 200) {
				toast.success("You have been logged out.");
				navigate("/auth");
				setUserInfo(null);
			}
		} catch (error) {
			console.log(error);
			toast.error(error.message);
		}
	};
	return (
		<div className="absolute bottom-0 h-24 flex items-center justify-between px-10 w-full bg-[#2a2b33]">
			<div className="flex gap-3 items-center justify-center">
				<div className="w-12 h-12 relative">
					<Avatar className="h-12 w-12 rounded-full overflow-hidden">
						{userInfo.image ? (
							<AvatarImage
								src={`${HOST}/${userInfo.image}`}
								alt="profile"
								className="object-cover w-full h-full bg-black"
							/>
						) : (
							<div
								className={`uppercase h-full w-full text-lg flex items-center justify-center rounded-full ${getColor(
									userInfo.color
								)}`}
							>
								{userInfo.firstName
									? userInfo.firstName.charAt(0)
									: userInfo?.email.charAt(0)}
							</div>
						)}
					</Avatar>
				</div>
				<div>
					{userInfo.firstName && userInfo.lastName
						? `${userInfo.firstName} ${userInfo.lastName}`
						: ""}
				</div>
			</div>
			<div className="flex gap-5">
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger>
							<FiEdit2
								className="text-purple-500 text-xl font-medium"
								onClick={() => navigate("/profile")}
							/>
						</TooltipTrigger>
						<TooltipContent className="bg-[#1c1b1e] border-none text-white">
							<p>Edit Profile</p>
						</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger>
							<TbLogout
								className="text-red-500 text-2xl font-medium"
								onClick={logOut}
							/>
						</TooltipTrigger>
						<TooltipContent className="bg-[#1c1b1e] border-none text-white">
							<p>Logout</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>
		</div>
	);
};

export default ProfileInfoComponent;