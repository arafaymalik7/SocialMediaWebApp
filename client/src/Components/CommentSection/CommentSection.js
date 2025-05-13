import React, { useState, useEffect } from 'react';
import './CommentSection.css';
import Comment from '../Comment/Comment';
import { createComment, getComments } from '../../api/PostRequest';
import { useSelector } from 'react-redux';

const CommentSection = ({ postId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useSelector((state) => state.authReducer.authData);

    useEffect(() => {
        fetchComments();
    }, [postId]);

    const fetchComments = async () => {
        try {
            const { data } = await getComments(postId);
            setComments(data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        
        setLoading(true);
        try {
            const { data } = await createComment({
                postId,
                userId: user._id,
                desc: newComment
            });
            setComments([...comments, data]);
            setNewComment('');
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const handleDelete = (commentId) => {
        setComments(comments.filter(comment => comment._id !== commentId));
    };

    return (
        <div className="CommentSection">
            <div className="comment-input">
                <img
                    src={user.profilePicture ? 
                        process.env.REACT_APP_PUBLIC_FOLDER + user.profilePicture : 
                        process.env.REACT_APP_PUBLIC_FOLDER + "defaultProfile.png"}
                    alt=""
                />
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Write a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button 
                        type="submit" 
                        className="button comment-button"
                        disabled={loading || !newComment.trim()}
                    >
                        {loading ? 'Posting...' : 'Post'}
                    </button>
                </form>
            </div>
            <div className="comments-list">
                {comments.map((comment) => (
                    <Comment 
                        key={comment._id} 
                        data={comment} 
                        postId={postId}
                        onDelete={handleDelete}
                    />
                ))}
            </div>
        </div>
    );
};

export default CommentSection;