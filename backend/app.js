import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/AuthRoutes.js";
import contactsRoutes from "./routes/ContactsRoutes.js";
import setupSocket from "./socket.js";
dotenv.config();

const app = express();

const port = process.env.PORT || 3001;
const databaseuRL = process.env.DATABASE_URL;

app.use(
	cors({
		origin: [process.env.ORIGIN],
		methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
		credentials: true,
	})
);
app.use(cookieParser());
app.use(express.json());

app.use("/uploads/profiles", express.static("uploads/profiles"));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactsRoutes);

const server = app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});

setupSocket(server);

mongoose
	.connect(databaseuRL)
	.then(() => {
		console.log("Database connected");
	})
	.catch((err) => {
		console.log(err.message);
	});
