import React, { useEffect, useState, useRef } from 'react';
import './ChatBox.css';
import { getUser } from '../../api/UserRequest';
import { addMessage, getMessages } from '../../api/MessageRequest';
import { format } from 'timeago.js';

const ChatBox = ({ chat, currentUser, setSendMessage, receiveMessage }) => {
    const [userData, setUserData] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const scroll = useRef();

    // Fetch user data for chat header
    useEffect(() => {
        const userId = chat?.members?.find((id) => id !== currentUser);
        const getUserData = async () => {
            try {
                const { data } = await getUser(userId);
                setUserData(data);
            } catch (error) {
                console.log(error);
            }
        };
        if (chat !== null) getUserData();
    }, [chat, currentUser]);

    // Fetch messages
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const { data } = await getMessages(chat._id);
                setMessages(data);
            } catch (error) {
                console.log(error);
            }
        };
        if (chat !== null) fetchMessages();
    }, [chat]);

    const handleChange = (e) => {
        setNewMessage(e.target.value);
    };

    const handleSend = async (e) => {
        e.preventDefault();
        
        const message = {
            senderId: currentUser,
            text: newMessage,
            chatId: chat._id,
        };

        try {
            const { data } = await addMessage(message);
            setMessages([...messages, data]);
            setNewMessage("");
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        scroll.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="ChatBox-container">
            {chat ? (
                <>
                    <div className="chat-header">
                        <div className="follower">
                            <div>
                                <img
                                    src={userData?.profilePicture ? 
                                        process.env.REACT_APP_PUBLIC_FOLDER + userData.profilePicture : 
                                        process.env.REACT_APP_PUBLIC_FOLDER + "defaultProfile.png"}
                                    alt="Profile"
                                    className="followerImg"
                                />
                                <div className="name">
                                    <span>{userData?.firstname} {userData?.lastname}</span>
                                </div>
                            </div>
                        </div>
                        <hr />
                    </div>

                    <div className="chat-body">
                        {messages.map((message) => (
                            <div
                                key={message._id}
                                className={message.senderId === currentUser ? "message own" : "message"}
                            >
                                <span>{message.text}</span>
                                <span>{format(message.createdAt)}</span>
                            </div>
                        ))}
                        <div ref={scroll}></div>
                    </div>

                    <div className="chat-sender">
                        <div>+</div>
                        <input 
                            type="text"
                            placeholder="Type a message..."
                            value={newMessage}
                            onChange={handleChange}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend(e)}
                        />
                        <div className="send-button button" onClick={handleSend}>
                            Send
                        </div>
                    </div>
                </>
            ) : (
                <span className="chatbox-empty-message">
                    Tap on a chat to start conversation...
                </span>
            )}
        </div>
    );
};

export default ChatBox;