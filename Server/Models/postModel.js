import mongoose from "mongoose";

const postSchema = mongoose.Schema(
    {
        userId: { type: String, required: true },
        name: String,
        desc: String,
        likes: [],
        image: String
    },
    {
        timestamps: true,
    }
)

const postModel = mongoose.model("Posts", postSchema);

export default postModel