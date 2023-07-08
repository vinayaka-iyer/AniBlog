const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/User");
const bcrypt = require("bcryptjs");
const app = express();
const jwt = require("jsonwebtoken");

const salt = bcrypt.genSaltSync(10);
const secret = "asdf43q5421gretgadfag34t";

app.use(cors({ credentials: true, origin: "http://127.0.0.1:5173" }));
app.use(express.json());

mongoose.connect(
	"mongodb+srv://vinayakaiyer999:vinayaka999@cluster0.rtiethf.mongodb.net/"
);

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

app.post("/login", async (req, res) => {
	const { username, password } = req.body;
	const userDoc = await User.findOne({ username });
	const passOk = bcrypt.compareSync(password, userDoc.password);
	if (passOk) {
		//logged in
		jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
			if (err) throw err;
			res.cookie("token", token).json("ok");
		});
	} else {
		res.status(400).json("Wrong Credentials");
	}
});

app.listen(4000);
