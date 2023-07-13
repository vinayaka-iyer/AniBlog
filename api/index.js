const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/User");
const Post = require("./models/Post");
const bcrypt = require("bcryptjs");
const app = express();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const uploadMiddleware = multer({ dest: "uploads/" });
const fs = require("fs");

const salt = bcrypt.genSaltSync(10);
const secret = "asdf43q5421gretgadfag34t";

app.use(cors({ credentials: true, origin: "http://127.0.0.1:5173" }));
app.use(express.json());
app.use(cookieParser());
//to statically serve images in our uploads folder
app.use("/uploads", express.static(__dirname + "/uploads"));

mongoose.connect(
	"mongodb+srv://vinayakaiyer999:vinayaka999@cluster0.rtiethf.mongodb.net/"
);

//Register user
app.post("/register", async (req, res) => {
	const { username, password } = req.body;
	try {
		const userDoc = await User.create({
			username,
			password: bcrypt.hashSync(password, salt),
		});
		res.json(userDoc);
	} catch (e) {
		res.status(400).json(e);
	}
});

//Login user
app.post("/login", async (req, res) => {
	const { username, password } = req.body;
	const userDoc = await User.findOne({ username });
	const passOk = bcrypt.compareSync(password, userDoc.password);
	if (passOk) {
		// logged in
		jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
			if (err) throw err;
			res.cookie("token", token, {
				httpOnly: true,
				sameSite: "none",
				secure: true,
			}).json({
				id: userDoc._id,
				username,
			});
		});
	} else {
		res.status(400).json("wrong credentials");
	}
});

// Verify login and create session using jwt cookie
app.get("/profile", (req, res) => {
	const { token } = req.cookies;
	jwt.verify(token, secret, {}, (err, info) => {
		if (err) throw err;
		res.json(info);
	});
});

// Logout user and reset token
app.post("/logout", (req, res) => {
	res.cookie("token", "", {
		httpOnly: true,
		sameSite: "none",
		secure: true,
	}).json("ok");
});

// Create Post after verifying token
app.post("/post", uploadMiddleware.single("file"), async (req, res) => {
	const { originalname, path } = req.file;
	const parts = originalname.split(".");
	const ext = parts[parts.length - 1];
	const newPath = path + "." + ext;
	fs.renameSync(path, newPath);

	const { token } = req.cookies;
	jwt.verify(token, secret, {}, async (err, info) => {
		if (err) throw err;
		const { title, summary, content } = req.body;
		const PostDoc = await Post.create({
			title,
			summary,
			content,
			cover: newPath,
			author: info.id,
		});
		res.json(PostDoc);
	});
});

app.put("/post", uploadMiddleware.single("file"), async (req, res) => {
	let newPath = null;
	if (req.file) {
		const { originalname, path } = req.file;
		const parts = originalname.split(".");
		const ext = parts[parts.length - 1];
		newPath = path + "." + ext;
		fs.renameSync(path, newPath);
	}
	const { token } = req.cookies;
	jwt.verify(token, secret, {}, async (err, info) => {
		if (err) throw err;
		const { id, title, summary, content } = req.body;
		const postDoc = await Post.findById(id);
		const isAuthor =
			JSON.stringify(postDoc.author) === JSON.stringify(info.id);
		if (!isAuthor) {
			return res.status(400).json("You are not the author");
		}
		await postDoc.updateOne({
			title,
			summary,
			content,
			cover: newPath ? newPath : postDoc.cover,
		});
		res.json(postDoc);
	});
});

// Get All Posts
app.get("/post", async (req, res) => {
	res.json(
		await Post.find()
			.populate("author", ["username"])
			.sort({ createdAt: -1 })
			.limit(20)
	);
});

// Get Single Post
app.get("/post/:id", async (req, res) => {
	const { id } = req.params;
	const postDoc = await Post.findById(id).populate("author", ["username"]);
	res.json(postDoc);
});

app.listen(4000);
