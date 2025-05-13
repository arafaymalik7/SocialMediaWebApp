import React, { useState, useEffect } from 'react';
import './NotificationPanel.css';
import { useSelector } from 'react-redux';
import { getUserNotifications, markAllAsRead } from '../../api/NotificationRequest';
import Notification from '../Notification/Notification';

const NotificationPanel = ({ isOpen, onClose }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user } = useSelector((state) => state.authReducer.authData);

    useEffect(() => {
        if (isOpen) {
            fetchNotifications();
        }
    }, [isOpen]);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const { data } = await getUserNotifications(user._id);
            setNotifications(data);
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const handleMarkAllRead = async () => {
        await markAllAsRead(user._id);
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const handleRead = (id) => {
        setNotifications(notifications.map(n => 
            n._id === id ? { ...n, read: true } : n
        ));
    };

    const handleDelete = (id) => {
        setNotifications(notifications.filter(n => n._id !== id));
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    if (!isOpen) return null;

    return (
        <div className="NotificationPanel">
            <div className="notification-header">
                <h3>Notifications</h3>
                {unreadCount > 0 && (
                    <button 
                        className="mark-all-read"
                        onClick={handleMarkAllRead}
                    >
                        Mark all as read
                    </button>
                )}
                <span className="close-panel" onClick={onClose}>×</span>
            </div>
            
            <div className="notification-list">
                {loading ? (
                    <div className="loading">Loading notifications...</div>
                ) : notifications.length === 0 ? (
                    <div className="no-notifications">No notifications yet</div>
                ) : (
                    notifications.map(notification => (
                        <Notification
                            key={notification._id}
                            data={notification}
                            onRead={handleRead}
                            onDelete={handleDelete}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default NotificationPanel;