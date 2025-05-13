import React, { useState } from 'react';
import './Chat.css';
import LogoSearch from '../../Components/LogoSearch/LogoSearch';
import ChatList from '../../Components/ChatList/ChatList';
import ChatBox from '../../Components/ChatBox/ChatBox';
import { useSelector } from 'react-redux';

const Chat = () => {
    const [currentChat, setCurrentChat] = useState(null);
    const [sendMessage, setSendMessage] = useState(null);
    const [receiveMessage, setReceiveMessage] = useState(null);
    const { user } = useSelector((state) => state.authReducer.authData);

    return (
        <div className="Chat">
            <div className="Left-side-chat">
                <LogoSearch />
                <ChatList setCurrentChat={setCurrentChat} />
            </div>

            <div className="Right-side-chat">
                <ChatBox
                    chat={currentChat}
                    currentUser={user._id}  // Pass user ID, not the chat
                    setSendMessage={setSendMessage}
                    receiveMessage={receiveMessage}
                />
            </div>
        </div>
    );
};

export default Chat;