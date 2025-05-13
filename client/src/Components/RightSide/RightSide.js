import React, { useState, useEffect } from 'react';
import './RightSide.css';
import Home from '../../Img/home.png';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import Noti from '../../Img/noti.png';
import Comment from '../../Img/comment.png';
import TrendCard from '../TrendCard/TrendCard';
import ShareModal from '../ShareModal/ShareModal';
import { Link } from 'react-router-dom';
import NotificationPanel from '../NotificationPanel/NotificationPanel';
import { useSelector } from 'react-redux';
import { getUserNotifications } from '../../api/NotificationRequest';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';

const RightSide = () => {
    const [modalOpened, setModalOpened] = useState(false);
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const { user } = useSelector((state) => state.authReducer.authData);

    useEffect(() => {
        const fetchUnreadCount = async () => {
            try {
                const { data } = await getUserNotifications(user._id);
                const unread = data.filter(n => !n.read).length;
                setUnreadCount(unread);
            } catch (error) {
                console.log(error);
            }
        };
        
        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 30000); // Check every 30 seconds
        
        return () => clearInterval(interval);
    }, [user._id]);
return (
    <div className='RightSide'>
        <div className="navIcons">
            <Link to='../home'>
                <img src={Home} alt="" />
            </Link>

            <SettingsOutlinedIcon />
            
            <div className="notification-icon" onClick={() => setNotificationOpen(!notificationOpen)}>
                <img src={Noti} alt="" />
                {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount}</span>
                )}
                <NotificationPanel 
                    isOpen={notificationOpen} 
                    onClose={() => setNotificationOpen(false)}
                />
            </div>
            
            <Link to='../chat'>
                <ChatOutlinedIcon />
            </Link>
        </div>

        <TrendCard />

        <div className="button rg-button" onClick={() => setModalOpened(true)}>
            Share
        </div>
        <ShareModal modalOpened={modalOpened} setModalOpened={setModalOpened} />
    </div>
);
};

export default RightSide;