import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, MenuItem } from '@mui/material';
import { styled } from '@mui/material/styles';
import Footer from '../Footer/Footer';
import backgroundImage from '../../assets/netflix.png';
import './SingUp.css'

const PageWrapper = styled(Box)({
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
});

const FormContainer = styled(Container)({
    marginTop: '60px',
    marginBottom: '30px',
});

const FormBox = styled(Box)({
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    padding: '32px',
    borderRadius: '16px',
    color: 'white',
    boxShadow: '0px 3px 6px rgba(0,0,0,0.3)',
});

const StyledTextField = styled(TextField)({
    '& .MuiFilledInput-root': {
        backgroundColor: '#333',
        color: 'white',
    },
    '& .MuiInputLabel-root': {
        color: '#aaa',
    },
});

const SubmitButton = styled(Button)({
    marginTop: '16px',
    backgroundColor: '#e50914',
    '&:hover': {
        backgroundColor: '#f6121d',
    },
});

const SignInLink = styled('span')({
    color: '#e50914',
    cursor: 'pointer',
});

function SingUp() {
    const [emailOrPhone, setEmailOrPhone] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        if (password.length < 8 || !/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
            alert('Password must have at least 8 characters, one letter, and one number');
            return;
        }

        try {
            const res = await fetch('http://localhost:8080/api/users/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ emailOrPhone, password, role }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Registration failed');

            navigate('/');
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <PageWrapper>
            <header>
                <div className="logo"></div>
            </header>
            <FormContainer maxWidth="xs">
                <FormBox>
                    <Typography variant="h4" gutterBottom>
                        Sign Up
                    </Typography>
                    <form onSubmit={handleRegister}>
                        <StyledTextField
                            label="Email or Phone"
                            variant="filled"
                            fullWidth
                            required
                            margin="normal"
                            value={emailOrPhone}
                            onChange={(e) => setEmailOrPhone(e.target.value)}
                        />
                        <StyledTextField
                            label="Password"
                            variant="filled"
                            type="password"
                            fullWidth
                            required
                            margin="normal"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <StyledTextField
                            label="Role"
                            select
                            variant="filled"
                            fullWidth
                            margin="normal"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <MenuItem value="user">User</MenuItem>
                            <MenuItem value="admin">Admin</MenuItem>
                        </StyledTextField>
                        <SubmitButton type="submit" fullWidth variant="contained">
                            Sign Up
                        </SubmitButton>
                        <Typography variant="body2" sx={{ mt: 2 }}>
                            Already have an account?{' '}
                            <SignInLink onClick={() => navigate('/')}>
                                Sign in.
                            </SignInLink>
                        </Typography>
                    </form>
                </FormBox>
            </FormContainer>
            <Footer />
        </PageWrapper>
    );
};

export default SingUp;

