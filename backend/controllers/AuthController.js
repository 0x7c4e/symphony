import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";
import { response } from "express";

const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (email, userId) => {
	return jwt.sign({ email, userId }, process.env.JWT_KEY, {
		expiresIn: maxAge,
	});
};

export const signup = async (req, res, next) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({
				success: false,
				message: "Email and Password are required",
			});
		}

		const user = await User.create({ email, password });
		res.cookie("jwt", createToken(email, user.id), {
			maxAge,
			secure: true,
			sameSite: "none",
		});

		return res.status(201).json({
			success: true,
			message: "user created successfully",
			user: {
				id: user.id,
				email: user.email,
				profileSetup: user.profileSetup,
			},
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};
