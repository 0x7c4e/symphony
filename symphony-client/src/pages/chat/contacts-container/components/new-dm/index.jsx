import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Lottie from "lottie-react";
import { animationDefaultOptions, getColor } from "@/lib/utils";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { HOST, SEARCH_CONTACTS_ROUTES } from "@/utils/constants";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAppStore } from "@/store";

const NewDm = () => {
	const { setSelectedChatType, setSelectedChatData } = useAppStore();
	const [openNewContactModal, setOpenNewContactModal] = useState(false);
	const [searchedContacts, setSearchedContacts] = useState([]);

	const searchContacts = async (searchTerm) => {
		try {
			if (searchTerm.length > 0) {
				const response = await apiClient.post(
					SEARCH_CONTACTS_ROUTES,
					{ searchTerm },
					{ withCredentials: true }
				);
				if (response.status === 200 && response.data.contacts) {
					setSearchedContacts(response.data.contacts);
				}
			} else {
				setSearchedContacts([]);
			}
		} catch (error) {
			console.log(error);
			toast.error(error.message);
		}
	};

	const selectNewContact = (contact) => {
		setOpenNewContactModal(false);
		setSearchedContacts([]);
		setSelectedChatType("contact");
		setSelectedChatData(contact);
	};

	return (
		<>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger>
						<FaPlus
							className="text-neutral-400 font-light text-opacity-90 text-sm hover:text-neutral-100 cursor-pointer transition-all duration-300 "
							onClick={() => setOpenNewContactModal(true)}
						/>
					</TooltipTrigger>
					<TooltipContent className=" border-none text-white">
						<p>Select new contact</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>

			<Dialog open={openNewContactModal} onOpenChange={setOpenNewContactModal}>
				<DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
					<DialogHeader>
						<DialogTitle>Select Contact</DialogTitle>
						<DialogDescription></DialogDescription>
					</DialogHeader>
					<div>
						<Input
							placeholder="Search Contacts"
							className="rounded-lg p-5 bg-[#2c2e3b] border-none"
							onChange={(e) => searchContacts(e.target.value)}
						/>
					</div>
					{searchedContacts.length > 0 && (
						<ScrollArea className="h-[250px] ">
							<div className="flex flex-col gap-5">
								{searchedContacts.map((contact) => (
									<div
										key={contact._id}
										className="flex gap-3 items-center cursor-pointer hover:bg-[#282b356a] p-3 rounded-lg transition-all duration-200"
										onClick={() => selectNewContact(contact)}
									>
										<div className="w-12 h-12 relative">
											<Avatar className="h-12 w-12 rounded-full overflow-hidden">
												{contact.image ? (
													<AvatarImage
														src={`${HOST}/${contact.image}`}
														alt="profile"
														className="object-cover w-full h-full bg-black"
													/>
												) : (
													<div
														className={`uppercase h-full w-full text-lg flex items-center justify-center rounded-full ${getColor(
															contact.color
														)}`}
													>
														{contact.firstName
															? contact.firstName.charAt(0)
															: contact?.email.charAt(0)}
													</div>
												)}
											</Avatar>
										</div>
										<div className="flex flex-col">
											<span>
												{contact.firstName && contact.lastName
													? `${contact.firstName} ${contact.lastName}`
													: contact.email}
											</span>
											<span className="text-xs">{contact.email}</span>
										</div>
									</div>
								))}
							</div>
						</ScrollArea>
					)}

					{searchedContacts.length <= 0 && (
						<div className="flex-1 flex flex-col justify-center items-center duration-1000 transition-all">
							<Lottie
								animationData={animationDefaultOptions.animationData}
								loop={animationDefaultOptions.loop}
								autoplay={animationDefaultOptions.autoplay}
								style={{ height: 100, width: 100 }}
							/>
							<div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-5 lg:text-4xl text-3xl transition-all duration-300 text-center">
								<h3 className="grotesk-medium">
									Search new <span className="text-purple-500">contact</span>
								</h3>
							</div>
						</div>
					)}
				</DialogContent>
			</Dialog>
		</>
	);
};

export default NewDm;
