import React, { Fragment, useEffect, useState } from "react";

// Mui
import { Container, Box, Grid, TextField, Button, InputAdornment, Typography, Modal, InputLabel } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import HttpsIcon from '@mui/icons-material/Https';

// Jwt-decode
import { jwtDecode } from "jwt-decode";

// Axios
import axios from './../../axios/interceptor';

// google login
import { GoogleLogin } from '@react-oauth/google';

// react-router-dom 
import { Link, useNavigate } from 'react-router-dom'

// Components and CSS
import Toast from "../../components/tostify/index";
import signInValidation from "../../utils/validation/sign-in/signInValidation";
import SignInImage from './../../assets/backgrounds/signIn.svg';
import signUpValidation from "../../utils/validation/sign-up/signUpValidation";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: 300, sm: 400, md: 600 },
    bgcolor: 'background.paper',
    borderRadius: '5px',
    boxShadow: 24,
    p: 4,
};

const SignInPage = () => {
    const navigate = useNavigate()
    const [sigin, setSignIn] = useState({
        username: '',
        password: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({})
    const [signUpDetail, setSignUpdetail] = useState({
        password: "",
        confirmPassword: ''
    })
    const [open, setOpen] = useState(false);
    const [isCreateUser, setIsCreateUser] = useState(false)
    const [signUpError, setSignUpError] = useState({})
    const [credential, setCredential] = useState(null)

    useEffect(() => {
        if (isSubmitting) {
            if (Object.values(errors).filter(i => i).length > 0) {
                setIsSubmitting(false)
            } else {
                axios.post(`/authentication/sign-in`, sigin)
                    .then(response => {
                        if (response?.data?.isSuccess) {
                            localStorage.setItem("accessToken", response?.data?.token);
                            Toast(response?.data?.message, 'success');
                            const token = localStorage.getItem('accessToken')
                            const decode = jwtDecode(token);
                            if (decode.role === "Admin") {
                                navigate('/taskList')
                            } else {
                                navigate('/myTask')
                            }
                        } else {
                            Toast(response?.data?.message, 'error');
                        }
                    })
                    .catch(err => console.log(err))
                setIsSubmitting(false)
            }
        }
    }, [isSubmitting])

    const handleChange = (event) => {
        setSignIn({ ...sigin, [event.target.name]: event.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors(signInValidation(sigin))
        setIsSubmitting(true)
    }

    const signUpChange = (e) => {
        setSignUpdetail({ ...signUpDetail, [e.target.name]: e.target.value })
    }

    useEffect(() => {
        if (isCreateUser) {
            if (Object.values(signUpError).filter(i => i).length > 0) {
                setIsCreateUser(false)
            } else {
                delete signUpDetail.confirmPassword
                axios.post(`/authentication/sign-up`, { ...signUpDetail, credential })
                    .then(response => {
                        if (response?.data?.isSuccess) {
                            Toast(response?.data?.message, 'success');
                            setOpen(false)
                            setSignUpdetail({})
                        } else {
                            Toast(response?.data?.message, 'error');
                        }
                    })
                    .catch(err => console.log(err))
                setIsCreateUser(false)
            }
        }
    }, [isCreateUser])

    const signUp = (e) => {
        e.preventDefault();
        setSignUpError(signUpValidation(signUpDetail));
        setIsCreateUser(true);
    }

    const handleClose = () => {
        setOpen(false)
    }

    return (
        <Fragment>
            {/* Modal */}
            <Box>
                <Modal open={open}>
                    <Box sx={style}>
                        <form action="" onSubmit={signUp} autoComplete="off">
                            <Box>
                                <Box>
                                    <Typography component='h4' fontWeight={700}>Sign Up</Typography>
                                </Box>
                                <Grid container p={3}>
                                    <Grid item xs={12} md={10}>
                                        <Box>
                                            <Typography component="span" mb={1} display={"block"}>Password*</Typography>
                                            <TextField
                                                type="password"
                                                name="password"
                                                placeholder="Enter password"
                                                variant="outlined"
                                                onChange={signUpChange}
                                                fullWidth
                                            />
                                            {signUpError.password && <Typography component="small" fontSize={"14px"} color="red">{signUpError.password}</Typography>}
                                        </Box>
                                        <Box mt={2}>
                                            <Typography component="span" mb={1} display={"block"}>Confirm Password*</Typography>
                                            <TextField
                                                type="password"
                                                name="confirmPassword"
                                                placeholder="Enter confirm password"
                                                variant="outlined"
                                                onChange={signUpChange}
                                                fullWidth
                                            />
                                            {signUpError.confirmPassword && <Typography component="small" fontSize={"14px"} color="red">{signUpError.confirmPassword}</Typography>}
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} mt={3}>
                                        <Box display={"flex"} gap={2}>
                                            <Button variant="contained" type="submit" sx={{ px: 4 }}>Save</Button>
                                            <Button variant="contained" color="error" sx={{ px: 3 }} onClick={handleClose}>Cancel</Button>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>
                        </form>
                    </Box>
                </Modal>
            </Box>

            <Container>
                <Box sx={{ height: '100vh' }} display={"flex"} alignItems={"center"}>
                    <Box width={"100%"} borderRadius={1}>
                        <Grid container spacing={2} alignItems={"center"}>
                            <Grid item xs={12} md={6}>
                                <Box mb={5}>
                                    <Typography textAlign="center" variant="h4" color="primary">
                                        Welcome
                                    </Typography>
                                    <Typography textAlign="center" variant="subtitle1" marginTop="5px">
                                        Sign in to continue using this app.
                                    </Typography>
                                </Box>
                                <form autoComplete='off' onSubmit={handleSubmit}>
                                    <Box>
                                        <TextField
                                            fullWidth
                                            name='username'
                                            placeholder='Username'
                                            InputProps={{
                                                sx: {
                                                    ".css-1o9s3wi-MuiInputBase-input-MuiOutlinedInput-input": {
                                                        padding: "8.5px 14px"
                                                    }
                                                },
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <PersonIcon height="20px" width="20px" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            variant="outlined"
                                            onChange={handleChange}
                                        />
                                        {errors.username && <Typography component="small" fontSize={"14px"} color="red">{errors.username}</Typography>}
                                    </Box>
                                    <Box mt={2}>
                                        <TextField
                                            fullWidth
                                            name='password'
                                            placeholder='Password'
                                            type='password'
                                            InputProps={{
                                                sx: {
                                                    ".css-1o9s3wi-MuiInputBase-input-MuiOutlinedInput-input": {
                                                        padding: "8.5px 14px"
                                                    }
                                                },
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <HttpsIcon height="20px" width="20px" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            variant="outlined"
                                            onChange={handleChange}
                                        />
                                        {errors.password && <Typography component="small" fontSize={"14px"} color="red">{errors.password}</Typography>}
                                    </Box>
                                    <Box display={"flex"} justifyContent={"end"} mt={1}>
                                        <Typography to={'/forgotPassword'} component={Link} color="primary" sx={{ textDecoration: 'none', fontSize: '14px' }}>Forgot password?</Typography>
                                    </Box>
                                    <Box mt={5} display="flex" justifyContent="center">
                                        <Button
                                            variant="contained"
                                            sx={{ borderRadius: "30px", padding: "8px 60px" }}
                                            type="submit"
                                            className='sign-in'
                                        >
                                            Sign In
                                        </Button>
                                    </Box>
                                </form>
                                <Box mt={5} display="flex" justifyContent="center">
                                    <GoogleLogin
                                        onSuccess={credentialResponse => {
                                            setOpen(true)
                                            setCredential(credentialResponse)
                                            console.log(credentialResponse);
                                        }}
                                        onError={() => {
                                            console.log('Login Failed');
                                        }}
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={6} display={{ xs: "none", md: "block" }}>
                                <Box p={5}>
                                    <img src={SignInImage} alt="sign-in" />
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </Fragment>
    )
}

export default SignInPage;