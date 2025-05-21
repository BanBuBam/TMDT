import React, { useState, useEffect } from 'react';
import './UserProfile.css';

const UserProfile = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(null);
    const [showNotification, setShowNotification] = useState(false);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const token = localStorage.getItem('auth-token');
                if (!token) {
                    window.location.replace('/login');
                    return;
                }

                const response = await fetch('http://localhost:4000/userinfo', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': token
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }

                const data = await response.json();
                if (data.success) {
                    setUserInfo(data.user);
                } else {
                    throw new Error(data.error || 'Failed to fetch user data');
                }
            } catch (error) {
                console.error('Error fetching user info:', error);
                alert('Could not load user information. Please try logging in again.');
            }
        };

        fetchUserInfo();
    }, []);

    const handleEdit = () => {
        setFormData(userInfo);
        setIsEditing(true);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleUpdate = async () => {
        try {
            const token = localStorage.getItem('auth-token');
            const response = await fetch('http://localhost:4000/updateuser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (data.success) {
                setUserInfo(formData);
                setIsEditing(false);
                setShowNotification(true); // Show notification instead of alert
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile. Please try again.');
        }
    };

    const handleCloseNotification = () => {
        setShowNotification(false);
    };

    if (!userInfo) {
        return <div className="user-profile">Loading...</div>;
    }

    return (
        <div className="user-profile">
            {showNotification && (
                <div className="notification-overlay">
                    <div className="notification-modal">
                        <h2>Thông báo</h2>
                        <p>Cập nhật thành công!</p>
                        <button onClick={handleCloseNotification}>OK</button>
                    </div>
                </div>
            )}
            <div className="profile-container">
                <h1>Profile Information</h1>
                <div className="profile-info">
                    {!isEditing ? (
                        <>
                            <div className="info-group">
                                <label>Full Name</label>
                                <p>{userInfo.fullName}</p>
                            </div>
                            <div className="info-group">
                                <label>Username</label>
                                <p>{userInfo.name}</p>
                            </div>
                            <div className="info-group">
                                <label>Email</label>
                                <p>{userInfo.email}</p>
                            </div>
                            <div className="info-group">
                                <label>Phone Number</label>
                                <p>{userInfo.phone}</p>
                            </div>
                            <div className="info-group">
                                <label>Address</label>
                                <p>{userInfo.address}</p>
                            </div>
                            <button className="edit-button" onClick={handleEdit}>Edit Profile</button>
                        </>
                    ) : (
                        <>
                            <div className="info-group">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="info-group">
                                <label>Username</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="info-group">
                                <label>Phone Number</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="info-group">
                                <label>Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="button-group">
                                <button className="update-button" onClick={handleUpdate}>Update</button>
                                <button className="cancel-button" onClick={() => setIsEditing(false)}>Cancel</button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
