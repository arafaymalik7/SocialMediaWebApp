import React, { useEffect, useState } from 'react';
import './ChatList.css';
import { userChats, createChat } from '../../api/ChatRequest';
import { getAllUser } from '../../api/UserRequest';
import { useSelector } from 'react-redux';
import Conversation from '../Conversation/Conversation';

const ChatList = ({ setCurrentChat }) => {
    const [chats, setChats] = useState([]);
    const [potentialChats, setPotentialChats] = useState([]);
    const { user } = useSelector((state) => state.authReducer.authData);

    useEffect(() => {
        const getChats = async () => {
            try {
                const { data } = await userChats(user._id);
                setChats(data);
            } catch (error) {
                console.log(error);
            }
        };
        getChats();
    }, [user._id]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await getAllUser();
                // Filter to show only followers and following
                const connectionsOnly = data.filter(person => 
                    person._id !== user._id && 
                    (user.followers.includes(person._id) || user.following.includes(person._id))
                );
                setPotentialChats(connectionsOnly);
            } catch (error) {
                console.log(error);
            }
        };
        fetchUsers();
    }, [user]);

    const checkChatExists = (userId) => {
        return chats.some(chat => chat.members.includes(userId));
    };

    const handleCreateChat = async (receiverId) => {
        try {
            const { data } = await createChat({
                senderId: user._id,
                receiverId: receiverId
            });
            setChats([...chats, data]);
            setCurrentChat(data);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="ChatList">
            <h2>Messages</h2>
            
            {/* Existing Chats */}
            <div className="chat-section">
                <h4>Recent Chats</h4>
                <div className="chats-container">
                    {chats.length > 0 ? (
                        chats.map((chat) => (
                            <div onClick={() => setCurrentChat(chat)} key={chat._id}>
                                <Conversation data={chat} currentUser={user._id} />
                            </div>
                        ))
                    ) : (
                        <span className="no-chats">No conversations yet</span>
                    )}
                </div>
            </div>

            {/* Followers/Following to start chat */}
            <div className="chat-section">
                <h4>Start a conversation</h4>
                <div className="potential-chats">
                    {potentialChats.map((person) => {
                        if (!checkChatExists(person._id)) {
                            return (
                                <div 
                                    key={person._id} 
                                    className="potential-chat"
                                    onClick={() => handleCreateChat(person._id)}
                                >
                                    <img 
                                        src={person.profilePicture ? 
                                            process.env.REACT_APP_PUBLIC_FOLDER + person.profilePicture : 
                                            process.env.REACT_APP_PUBLIC_FOLDER + "defaultProfile.png"} 
                                        alt="" 
                                        className="followerImg"
                                    />
                                    <div className="name">
                                        <span>{person.firstname} {person.lastname}</span>
                                        <span>Click to start chat</span>
                                    </div>
                                </div>
                            );
                        }
                        return null;
                    })}
                </div>
            </div>
        </div>
    );
};

export default ChatList;