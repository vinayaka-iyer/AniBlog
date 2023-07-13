const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const PostSchema = new Schema(
	{
		title: { type: String, require: true },
		summary: { type: String, require: true },
		content: { type: String, require: true },
		cover: { type: String, require: true },
	},
	{
		timestamps: true,
	}
);

const PostModel = model("Post", PostSchema);

module.exports = PostModel;
