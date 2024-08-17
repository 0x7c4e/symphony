import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";
import { response } from "express";
import { compare } from "bcrypt";
import { renameSync, unlinkSync } from "fs";
import { request } from "http";

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

export const getUserInfo = async (req, res, next) => {
	try {
		const userData = await User.findById(req.userId);
		if (!userData) {
			return res.status(404).json({
				success: false,
				message: "User not found.",
			});
		}

		return res.status(200).json({
			success: true,
			message: "User Logged in successfully",
			user: {
				id: userData.id,
				email: userData.email,
				profileSetup: userData.profileSetup,
				firstName: userData.firstName,
				lastName: userData.lastName,
				image: userData.image,
				color: userData.color,
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

export const updateProfile = async (req, res, next) => {
	try {
		const { userId } = req;

		const { firstName, lastName, color } = req.body;

		if (!firstName || !lastName) {
			return res.status(400).json({
				success: false,
				message: "Firstname and last name are required.",
			});
		}

		const userData = await User.findByIdAndUpdate(
			userId,
			{
				firstName,
				lastName,
				color,
				profileSetup: true,
			},
			{ new: true }
		);

		return res.status(200).json({
			success: true,
			message: "User Logged in successfully",
			user: {
				id: userData.id,
				email: userData.email,
				profileSetup: userData.profileSetup,
				firstName: userData.firstName,
				lastName: userData.lastName,
				image: userData.image,
				color: userData.color,
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

export const addProfileImage = async (req, res, next) => {
	try {
		if (!req.file) {
			return res.status(400).json({
				success: false,
				message: "File is required",
			});
		}

		const date = Date.now();

		let fileName = "uploads/profiles/" + date + req.file.originalname;
		renameSync(req.file.path, fileName);

		const updatedUser = await User.findByIdAndUpdate(
			req.userId,
			{
				image: fileName,
			},
			{ new: true }
		);

		return res.status(200).json({
			success: true,
			message: "User Logged in successfully",
			image: updatedUser.image,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};

export const removeProfileImage = async (req, res, next) => {
	try {
		const { userId } = req;

		const user = await User.findById(userId);

		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User not found.",
			});
		}

		if (user.image) {
			unlinkSync(user.image);
		}

		user.image = null;

		await user.save();

		return res.status(200).json({
			success: true,
			message: "Profile image removed successfully",
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};
