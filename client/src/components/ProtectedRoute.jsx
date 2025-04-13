import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ProtectedRoute({ children, allowedRoles }) {
    const navigate = useNavigate();
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
                if (!allowedRoles || allowedRoles.includes(userRole)) {
                    setAuthorized(true);
                } else {
                    if (userRole === 'admin') {
                        navigate('/admin-dashboard');
                    } else {
                        navigate('/user-home');
                    }
                }
            } catch (error) {
                navigate('/');
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [navigate, allowedRoles]);


    if (loading) return <div>Loading...</div>;

    return authorized ? children : null;
}

export default ProtectedRoute;
