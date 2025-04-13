import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserProfile.css';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

function UserProfile() {
    const [profiles, setProfiles] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [nameInput, setNameInput] = useState('');
    const navigate = useNavigate();

    const userId = sessionStorage.getItem('userId');
    const tokenFromCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];

    const tokenFromSession = sessionStorage.getItem('token');
    const token = tokenFromCookie || tokenFromSession;

    useEffect(() => {
        const fetchProfiles = async () => {
            try {
                const res = await fetch(`http://localhost:8080/api/profiles/byUser/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await res.json();
                setProfiles(data);
            } catch (err) {
                console.error('Error fetching profiles:', err);
            }
        };

        if (userId) {
            fetchProfiles();
        }
    }, [userId, token]);

    const handleNameClick = (profile) => {
        setEditingId(profile._id);
        setNameInput(profile.name);
    };

    const handleNameChange = (e) => setNameInput(e.target.value);

    const handleNameSave = async (id) => {
        try {
            const res = await fetch(`http://localhost:8080/api/profiles/updateProfile/${id}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: nameInput }),
            });
            const result = await res.json();
            const updatedProfile = result.profile;
            setProfiles(prev => prev.map(p => (p._id === id ? updatedProfile : p)));
            setEditingId(null);
        } catch (err) {
            console.error('Error updating name:', err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await fetch(`http://localhost:8080/api/profiles/deleteProfile/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                method: 'DELETE',
            });
            setProfiles(prev => prev.filter(p => p._id !== id));
        } catch (err) {
            console.error('Error deleting profile:', err);
        }
    };

    const handleProfileClick = (id) => {
        navigate(`/homepage/${id}`);
    };

    const handleAddProfile = async () => {
        if (profiles.length >= 5) return;

        const newProfile = {
            name: 'New User',
            userId
        };

        try {
            const res = await fetch(`http://localhost:8080/api/profiles/addProfile/${userId}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(newProfile)
            });
            const created = await res.json();
            setProfiles(prev => [...prev, created]);
        } catch (err) {
            console.error('Error creating profile:', err);
        }
    };

    return (
        <div className="profile-selection">
            <h2 className="title">Who's watching?</h2>
            <div className="profiles-container">
                {profiles.map(profile => (
                    <div key={profile._id} className="profile-card">
                        <button className="delete-btn" onClick={() => handleDelete(profile._id)}>
                            <DeleteIcon fontSize="small" />
                        </button>
                        <div className="avatar" onClick={() => handleProfileClick(profile._id)}>
                            <img src={`http://localhost:8080/Public/${profile.image}`} alt="avatar" className="avatar-img" />
                        </div>
                        {editingId === profile._id ? (
                            <input
                                type="text"
                                className="name-input"
                                value={nameInput}
                                onChange={handleNameChange}
                                onBlur={() => handleNameSave(profile._id)}
                                onKeyDown={(e) => e.key === 'Enter' && handleNameSave(profile._id)}
                                autoFocus
                            />
                        ) : (
                            <p className="profile-name" onClick={() => handleNameClick(profile)}>
                                {profile.name}
                            </p>
                        )}
                    </div>
                ))}
                {profiles.length < 5 && (
                    <div className="profile-card add-profile" onClick={handleAddProfile}>
                        <AddCircleOutlineIcon fontSize="large" />
                        <p>Add Profile</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default UserProfile;
