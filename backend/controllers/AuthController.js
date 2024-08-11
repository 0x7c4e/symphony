import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";
import { response } from "express";
import { compare } from "bcrypt";

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

		const userExists = await User.findOne({ email });
		if (userExists) {
			return res.status(400).json({
				success: false,
				message: "User with this email has already been registered.",
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

export const login = async (req, res, next) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({
				success: false,
				message: "Email and Password are required",
			});
		}

		const user = await User.findOne({ email });
		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User with given email not found.",
			});
		}
		const auth = await compare(password, user.password);
		if (!auth) {
			return res.status(400).json({
				success: false,
				message: "Email or Password is incorrect, try again.",
			});
		}
		res.cookie("jwt", createToken(email, user.id), {
			maxAge,
			secure: true,
			sameSite: "none",
		});

		return res.status(200).json({
			success: true,
			message: "User Logged in successfully",
			user: {
				id: user.id,
				email: user.email,
				profileSetup: user.profileSetup,
				firstName: user.firstName,
				lastName: user.lastName,
				image: user.image,
				color: user.color,
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
