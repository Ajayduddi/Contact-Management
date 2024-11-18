import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import { Link, useNavigate } from 'react-router-dom'
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import loginServices from './../services/loginServices';
import CloseIcon from '@mui/icons-material/CloseSharp';
import { Alert, IconButton, Snackbar } from '@mui/material';

const Card = styled(MuiCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '30rem',
    padding: theme.spacing(3),
    gap: theme.spacing(2),
    margin: 'auto',
    borderRadius: theme.shape.borderRadius,
    boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.1)',
    [theme.breakpoints.up('xs')]: {
        Width: '100%',
        margin: 'auto',
    },
    [theme.breakpoints.up('sm')]: {
        Width: '450px',
    },
    [theme.breakpoints.up('md')]: {
        Width: '600px',
    },
    [theme.breakpoints.up('lg')]: {
        Width: '700px',
    },
}));

export default function SignIn() {
    const [emailError, setEmailError] = React.useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
    const [passwordError, setPasswordError] = React.useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
    const [alertState, setAlertState] = React.useState({
        open: false,
        message: '',
        severity: 'success',
    });

    const loginService = loginServices;
    const navigate = useNavigate()

    // Function to show alert
    const showAlert = (message, severity) => {
        setAlertState({
            open: true,
            message,
            severity,
        });
    };

    const handleAlertClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAlertState({ ...alertState, open: false });
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
        if (validateInputs()) {
            const data = new FormData(event.currentTarget);
            const send_data = {
                email: data.get('email'),
                password: data.get('password'),
            };
            console.log('Submitted Data:', send_data);

            try {
                const res = await loginService.login(send_data);

                if (res?.result) {
                    console.log('Login Success:', res);
                    localStorage.setItem('token', res.data);

                    navigate("/");

                } else {
                    showAlert(res?.message || 'Invalid login details', 'error');
                    console.error('Login Error:', res?.message);
                }
            } catch (error) {
                showAlert('An error occurred during login. Please try again.', 'error');
                console.error('Login API Error:', error);
            }
        }
    };


    const validateInputs = () => {
        const email = document.getElementById('email');
        const password = document.getElementById('password');

        let isValid = true;

        if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
            setEmailError(true);
            setEmailErrorMessage('Please enter a valid email address.');
            isValid = false;
        } else {
            setEmailError(false);
            setEmailErrorMessage('');
        }

        if (!password.value || password.value.length < 10 || !/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{10,}$/.test(password.value)) {
            setPasswordError(true);
            console.log(password.value)
            setPasswordErrorMessage('Password must be at least 10 characters long include upper & lower Letters, symbol, number');
            isValid = false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage('');
        }

        return isValid;
    };

    return (
        <>
            <CssBaseline enableColorScheme />
            <Snackbar
                open={alertState.open}
                autoHideDuration={4000}
                onClose={handleAlertClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleAlertClose}
                    severity={alertState.severity}
                    sx={{ width: '100%' }}
                    action={
                        <IconButton
                            size="small"
                            aria-label="close"
                            color="inherit"
                            onClick={handleAlertClose}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    }
                >
                    {alertState.message}
                </Alert>
            </Snackbar>
            <Box
                sx={{
                    background: 'url("/path/to/your/image.jpg") no-repeat center center fixed',
                    backgroundSize: 'cover',
                    minHeight: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Card variant="outlined">
                    <Typography
                        component="h1"
                        variant="h4"
                        sx={{ textAlign: 'center', fontWeight: 400, fontFamily: "lucida sans, sans-serif" }}
                    >
                        Sign in
                    </Typography>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        noValidate
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                        }}
                    >
                        <FormControl>
                            <FormLabel htmlFor="email" sx={{
                                textAlign: "start",
                                fontSize: 15,
                                padding: 1,
                                color: "black"
                            }}>Email</FormLabel>
                            <TextField
                                error={emailError}
                                helperText={emailErrorMessage}
                                id="email"
                                type="email"
                                name="email"
                                placeholder="your@email.com"
                                autoComplete="email"
                                autoFocus
                                required
                                fullWidth
                                variant="outlined"
                                color={emailError ? 'error' : 'primary'}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="password" sx={{
                                textAlign: "start",
                                fontSize: 15,
                                padding: 1,
                                color: "black"
                            }}>Password</FormLabel>
                            <TextField
                                error={passwordError}
                                helperText={passwordErrorMessage}
                                name="password"
                                placeholder="••••••••••"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                required
                                fullWidth
                                variant="outlined"
                                color={passwordError ? 'error' : 'primary'}
                            />
                        </FormControl>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            size="large"
                            sx={{
                                textTransform: 'none',
                                fontWeight: 'bold',
                                backgroundColor: '#1976d2',
                                '&:hover': {
                                    backgroundColor: '#1565c0',
                                },
                            }}
                        >
                            Sign in
                        </Button>
                    </Box>
                    <Divider sx={{ margin: '5px 0' }}>or</Divider>
                    <Typography sx={{ textAlign: 'center' }}>
                        Don&apos;t have an account?{' '}
                        <Link
                            to="/signup"
                            variant="body2"
                            underline="hover"
                            color="primary"
                        >
                            Sign up
                        </Link>
                    </Typography>
                </Card>
            </Box>
        </>
    );
}
