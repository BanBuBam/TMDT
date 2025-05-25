import React, { useEffect, useState } from 'react';
import './UserList.css';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone: '',
        address: '',
        fullName: '',
        password: ''
    });

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:4000/allusers');
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const openModal = (user = null) => {
        if (user) {
            setEditingUser(user);
            setFormData({
                username: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                fullName: user.fullName,
                password: ''
            });
        } else {
            setEditingUser(null);
            setFormData({
                username: '',
                email: '',
                phone: '',
                address: '',
                fullName: '',
                password: ''
            });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingUser(null);
        setFormData({
            username: '',
            email: '',
            phone: '',
            address: '',
            fullName: '',
            password: ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = editingUser 
                ? `http://localhost:4000/admin/updateuser/${editingUser._id}`
                : 'http://localhost:4000/admin/adduser';
            
            const method = editingUser ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            
            if (response.ok) {
                fetchUsers();
                closeModal();
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                const response = await fetch(`http://localhost:4000/deleteuser/${userId}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    fetchUsers();
                }
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    return (
        <div className="user-list">
            <div className="user-list-header">
                <h2>Users List</h2>
                <button className="add-user-btn" onClick={() => openModal()}>Add New User</button>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h2>{editingUser ? 'Edit User Information' : 'Add New User'}</h2>
                            <button className="close-btn" onClick={closeModal}>&times;</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="username">Username</label>
                                <input
                                    id="username"
                                    type="text"
                                    name="username"
                                    placeholder="Enter username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="Enter email address"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            {!editingUser && (
                                <div className="form-group">
                                    <label htmlFor="password">Password</label>
                                    <input
                                        id="password"
                                        type="password"
                                        name="password"
                                        placeholder="Enter password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            )}
                            <div className="form-group">
                                <label htmlFor="phone">Phone Number</label>
                                <input
                                    id="phone"
                                    type="text"
                                    name="phone"
                                    placeholder="Enter phone number"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="address">Address</label>
                                <input
                                    id="address"
                                    type="text"
                                    name="address"
                                    placeholder="Enter address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="fullName">Full Name</label>
                                <input
                                    id="fullName"
                                    type="text"
                                    name="fullName"
                                    placeholder="Enter full name"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="submit">
                                    {editingUser ? 'Save Changes' : 'Add User'}
                                </button>
                                <button type="button" onClick={closeModal}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="users-table">
                <table>
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Address</th>
                            <th>Full Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.phone}</td>
                                <td>{user.address}</td>
                                <td>{user.fullName}</td>
                                <td>
                                    <button onClick={() => openModal(user)}>Edit</button>
                                    <button onClick={() => handleDeleteUser(user._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserList;
