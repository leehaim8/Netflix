import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function ProtectedRoute({ children, allowedRoles }) {
    const navigate = useNavigate();
    const { id, userId, profileId } = useParams();

    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const tokenFromCookie = document.cookie
                .split('; ')
                .find(row => row.startsWith('token='))
                ?.split('=')[1];

            const tokenFromSession = sessionStorage.getItem('token');
            const token = tokenFromCookie || tokenFromSession;

            if (!token) {
                navigate('/');
                return;
            }

            try {
                const res = await fetch('http://localhost:8080/api/users/verify', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const data = await res.json();
                if (!res.ok) throw new Error();

                const userRole = data.user.role;
                const userIdFromToken = data.user.id;

                const urlId = id || userId || profileId;

                const isRoleAllowed = allowedRoles?.includes(userRole);
                const isCorrectId = !urlId || urlId === userIdFromToken;

                if (isRoleAllowed && isCorrectId) {
                    setAuthorized(true);
                } else {
                    if (userRole === 'admin') {
                        navigate(`/adminHomePage/${userIdFromToken}`);
                    } else {
                        // navigate(`//${userIdFromToken}`);
                    }
                }
            } catch (error) {
                navigate('/');
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [navigate, allowedRoles, id, userId, profileId]);

    if (loading) return <div>Loading...</div>;

    return authorized ? children : null;
}

export default ProtectedRoute;
