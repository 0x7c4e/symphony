import User from "../models/UserModel.js";

export const searchContacts = async (req, res, next) => {
	try {
		const { searchTerm } = req.body;

		if (!searchTerm) {
			return res.status(400).json({
				success: false,
				message: "searchTerm is required",
			});
		}

		const sanitizedSearchTerm = searchTerm.replace(
			/[.*+?^${}()|[\]\\]/g,
			"\\$&"
		);

		const regex = new RegExp(sanitizedSearchTerm, "i");

		const contacts = await User.find({
			// show all results excludng the current logged in user
			$and: [
				{ _id: { $ne: req.userId } },
				{
					$or: [{ firstName: regex }, { lastName: regex }, { email: regex }],
				},
			],
		});

		return res.status(200).json({
			success: true,
			contacts,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};
