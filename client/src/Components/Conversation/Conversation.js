import React, { useState, useEffect } from 'react';
import './Conversation.css';
import { getUser } from '../../api/UserRequest';

const Conversation = ({ data, currentUser }) => {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const userId = data.members.find((id) => id !== currentUser);
        const getUserData = async () => {
            try {
                const { data } = await getUser(userId);
                setUserData(data);
            } catch (error) {
                console.log(error);
            }
        };
        getUserData();
    }, [currentUser, data]);

    return (
        <div className="Conversation">
            <div className="follower">
                <div>
                    {userData && (
                        <>
                            <img src={userData.profilePicture ? 
                                process.env.REACT_APP_PUBLIC_FOLDER + userData.profilePicture : 
                                process.env.REACT_APP_PUBLIC_FOLDER + "defaultProfile.png"} 
                                alt="Profile" 
                                className="followerImg" 
                            />
                            <div className="name">
                                <span>{userData.firstname} {userData.lastname}</span>
                                <span>Online</span>
                            </div>
                        </>
                    )}
                </div>
            </div>
            <hr />
        </div>
    );
};

export default Conversation;