import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../Footer/Footer';
import backgroundImage from '../../assets/netflix.png'
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Checkbox,
    FormControlLabel
} from '@mui/material';
import { styled } from '@mui/material/styles';

const SignInContainer = styled('div')({
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
});

const SignInWrapper = styled(Container)({
    marginTop: '60px',
    marginBottom: '30px',
});

const FormBox = styled(Box)({
    backgroundColor: 'rgba(0,0,0,0.75)',
    padding: '20px',
    borderRadius: '8px',
    color: 'white',
    boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
});

const Heading = styled(Typography)({
    fontSize: '2rem',
    marginBottom: '16px',
    color: 'white',
});

const StyledTextField = styled(TextField)({
    backgroundColor: '#333',
    marginBottom: '16px',
    borderRadius: '4px',
    '& .MuiInputLabel-root': {
        color: '#aaa',
    },
    '& .MuiInputBase-root': {
        color: 'white',
    },
});

const StyledButton = styled(Button)({
    marginTop: '16px',
    backgroundColor: '#e50914',
    '&:hover': {
        backgroundColor: '#f6121d',
    },
});

const StyledFormControlLabel = styled(FormControlLabel)({
    color: 'white',
});

const SignUpText = styled(Typography)({
    marginTop: '16px',
    color: 'white',
});

const SignUpLink = styled('span')({
    color: '#e50914',
    cursor: 'pointer',
});


function SignIn() {
    const [emailOrPhone, setEmailOrPhone] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:8080/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ emailOrPhone, password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Login failed');
            sessionStorage.setItem('userId', data.user.id);
            if (remember) {
                document.cookie = `token=${data.token}; path=/; max-age=3600`;
            }
            navigate(`/userprofile/${data.user.id}`);
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <SignInContainer>
            <header>
                <div className="logo"></div>
            </header>
            <SignInWrapper maxWidth="xs">
                <FormBox>
                    <Heading variant="h4" gutterBottom>
                        Sign In
                    </Heading>
                    <form onSubmit={handleLogin}>
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
                        <StyledFormControlLabel
                            control={
                                <Checkbox
                                    checked={remember}
                                    onChange={(e) => setRemember(e.target.checked)}
                                    sx={{ color: '#e50914' }}
                                />
                            }
                            label="Remember me"
                        />
                        <StyledButton
                            type="submit"
                            fullWidth
                            variant="contained"
                        >
                            Sign In
                        </StyledButton>
                        <SignUpText variant="body2">
                            New to Netflix?{' '}
                            <SignUpLink onClick={() => navigate('/signup')}>
                                Sign up now.
                            </SignUpLink>
                        </SignUpText>
                    </form>
                </FormBox>
            </SignInWrapper>
            <Footer />
        </SignInContainer>
    );
}

export default SignIn;
