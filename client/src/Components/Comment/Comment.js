import React, { useState, useEffect } from 'react';
import './Comment.css';
import { getUser } from '../../api/UserRequest';
import { deleteComment } from '../../api/PostRequest';
import { useSelector } from 'react-redux';
import { format } from 'timeago.js';

const Comment = ({ data, postId, onDelete }) => {
    const [userData, setUserData] = useState(null);
    const { user } = useSelector((state) => state.authReducer.authData);

    useEffect(() => {
        const fetchUser = async () => {
            const response = await getUser(data.userId);
            setUserData(response.data);
        };
        fetchUser();
    }, [data.userId]);

    const handleDelete = async () => {
        try {
            await deleteComment(data._id, user._id);
            onDelete(data._id);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="Comment">
            <img
                src={userData?.profilePicture ? 
                    process.env.REACT_APP_PUBLIC_FOLDER + userData.profilePicture : 
                    process.env.REACT_APP_PUBLIC_FOLDER + "defaultProfile.png"}
                alt=""
            />
            <div className="comment-content">
                <div className="comment-header">
                    <span className="comment-author">
                        {userData?.firstname} {userData?.lastname}
                    </span>
                    <span className="comment-time">{format(data.createdAt)}</span>
                </div>
                <span className="comment-text">{data.desc}</span>
                {data.userId === user._id && (
                    <span className="delete-comment" onClick={handleDelete}>
                        Delete
                    </span>
                )}
            </div>
        </div>
    );
};

export default Comment;