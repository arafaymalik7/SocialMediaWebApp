import postModel from '../Models/postModel.js';
import mongoose from 'mongoose';
import UserModel from "../Models/userModel.js";
import CommentModel from '../Models/CommentModel.js';
import NotificationModel from '../Models/NotificationModel.js';


export const createPost = async (req, res) => {
    const newPost = new postModel(req.body);

    try {
        // Get user information
        const user = await UserModel.findById(req.body.userId);
        newPost.name = `${user.firstname} ${user.lastname}`;
        
        await newPost.save();
        res.status(200).json(newPost)
    } catch (error) {
        res.status(500).json(error)
    }
}

// get a post
export const getPost = async (req, res) => {
    const id = req.params.id

    try {
        const post = await postModel.findById(id)
        res.status(200).json(post)
    } catch (error) {
        res.status(500).json(error)
    }
}


//Update a Post
export const updatePost = async (req, res) => {
    const postId = req.params.id

    const { userId } = req.body

    try {
        const post = await postModel.findById(postId)
        if (post.userId === userId) {
            await post.updateOne({ $set: req.body })
            res.status(200).json("Post Updated Successfully!")
        } else {
            res.status(403).json("Action forbidden")
        }
    } catch (error) {
        res.status(500).json(error)
    }
}



// delete a post
export const deletePost = async (req, res) => {
    const id = req.params.id;

    const { userId } = req.body;

    try {
        const post = await postModel.findById(id);
        if (post.userId === userId) {
            await post.deleteOne();
            res.status(200).json("Post deleted Successfully!")
        } else {
            res.status(403).json("Action forbidden")
        }

    } catch (error) {
        res.status(500).json(error)
    }
}


// Like/Dislike a Post

export const like_dislike_Post = async (req, res) => {
    const id = req.params.id;
    const { userId } = req.body;

    try {
        const post = await postModel.findById(id);
        if (!post.likes.includes(userId)) {
            await post.updateOne({ $push: { likes: userId } })
            
            // Create notification
            if (post.userId !== userId) {
                const notification = new NotificationModel({
                    userId: post.userId,
                    senderId: userId,
                    type: 'like',
                    postId: id,
                    desc: 'liked your post'
                });
                await notification.save();
            }
            
            res.status(200).json("Post liked.")
        } else {
            await post.updateOne({ $pull: { likes: userId } })
            res.status(200).json("Post unliked.")
        }
    } catch (error) {
        res.status(500).json(error)
    }
}


// Get timeline a Posts
export const timeline = async (req, res) => {
    const userId = req.params.id;

    try {
        const currenUserPosts = await postModel.find({ userId: userId });
        const followingUserPosts = await UserModel.aggregate(
            [
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(userId)
                    }
                },
                {
                    $lookup: {
                        from: "posts",
                        localField: "following",
                        foreignField: "userId",
                        as: "followingUserPosts"
                    }
                },
                {
                    $project: {
                        followingUserPosts: 1,
                        _id: 0
                    }
                }
            ]
        )

        res.status(200).json(currenUserPosts.concat(...followingUserPosts[0].followingUserPosts).sort((a, b) => {
            return b.createdAt - a.createdAt;
        })
        );


    } catch (error) {
        res.status(500).json(error)
    }
}

// Create new comment
export const createComment = async (req, res) => {
    const newComment = new CommentModel(req.body);

    try {
        await newComment.save();
        
        // Get post to find owner
        const post = await postModel.findById(req.body.postId);
        
        // Create notification if commenter is not post owner
        if (post.userId !== req.body.userId) {
            const notification = new NotificationModel({
                userId: post.userId,
                senderId: req.body.userId,
                type: 'comment',
                postId: req.body.postId,
                desc: 'commented on your post'
            });
            await notification.save();
        }
        
        res.status(200).json(newComment);
    } catch (error) {
        res.status(500).json(error);
    }
};

// Get comments for a post
export const getComments = async (req, res) => {
    const { postId } = req.params;

    try {
        const comments = await CommentModel.find({ postId });
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json(error);
    }
};

// Delete a comment
export const deleteComment = async (req, res) => {
    const id = req.params.id;
    const { userId } = req.body;

    try {
        const comment = await CommentModel.findById(id);
        if (comment.userId === userId) {
            await comment.deleteOne();
            res.status(200).json("Comment deleted Successfully!");
        } else {
            res.status(403).json("Action forbidden");
        }
    } catch (error) {
        res.status(500).json(error);
    }
};

