import React, { useState, useEffect } from 'react';
import './Notification.css';
import { getUser } from '../../api/UserRequest';
import { markAsRead, deleteNotification } from '../../api/NotificationRequest';
import { format } from 'timeago.js';
import { Link } from 'react-router-dom';

const Notification = ({ data, onRead, onDelete }) => {
    const [sender, setSender] = useState(null);

    useEffect(() => {
        const fetchSender = async () => {
            const response = await getUser(data.senderId);
            setSender(response.data);
        };
        fetchSender();
    }, [data.senderId]);

    const handleRead = async () => {
        if (!data.read) {
            await markAsRead(data._id);
            onRead(data._id);
        }
    };

    const handleDelete = async () => {
        await deleteNotification(data._id);
        onDelete(data._id);
    };

    const getNotificationLink = () => {
        if (data.type === 'follow') {
            return `/profile/${data.senderId}`;
        } else {
            return `/post/${data.postId}`;
        }
    };

    return (
        <div 
            className={`Notification ${!data.read ? 'unread' : ''}`}
            onClick={handleRead}
        >
            <Link to={getNotificationLink()} className="notification-content">
                <img
                    src={sender?.profilePicture ? 
                        process.env.REACT_APP_PUBLIC_FOLDER + sender.profilePicture : 
                        process.env.REACT_APP_PUBLIC_FOLDER + "defaultProfile.png"}
                    alt=""
                    className="notification-avatar"
                />
                <div className="notification-info">
                    <span className="notification-text">
                        <strong>{sender?.firstname} {sender?.lastname}</strong> {data.desc}
                    </span>
                    <span className="notification-time">{format(data.createdAt)}</span>
                </div>
            </Link>
            {!data.read && <div className="notification-dot"></div>}
            <span className="delete-notification" onClick={handleDelete}>×</span>
        </div>
    );
};

export default Notification;