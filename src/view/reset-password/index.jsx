import React, { Fragment, useEffect, useState } from "react";

// Mui
import { Box, Button, Container, Grid, InputAdornment, TextField, Typography } from "@mui/material";
import HttpsIcon from '@mui/icons-material/Https';

// react-router-dom
import { Link, useNavigate, useParams } from "react-router-dom";

// Axios
import axios from './../../axios/interceptor'

// Components and CSS
import resetPasswordValidation from "../../utils/validation/reset-password/resetpasswordvalidation";
import SignInImage from './../../assets/backgrounds/signIn.svg';
import Toast from "../../components/tostify";

const ResetPassword = () => {
    const { id, token } = useParams();
    const navigate = useNavigate();
    const [resetPassword, setResetPassword] = useState({
        password: '',
        confirmPassword: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({})

    const handleChange = (e) => {
        setResetPassword({ ...resetPassword, [e.target.name]: e.target.value })
    }
    useEffect(() => {
        if (isSubmitting) {
            if (Object.values(errors).filter(i => i).length > 0) {
                setIsSubmitting(false)
            } else {
                axios.post(`/authentication/reset-password`, { id, token, password: resetPassword.password })
                    .then(response => {
                        if (response?.data?.isSuccess) {
                            Toast(response?.data?.message, 'success');
                            navigate('/login')
                        } else {
                            Toast(response?.data?.message, 'error');
                        }
                    })
                    .catch(err => console.log(err))
                setIsSubmitting(false)
            }
        }
    }, [isSubmitting])

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors(resetPasswordValidation(resetPassword))
        setIsSubmitting(true)
    }

    return (
        <div>
            <Fragment>
                <Container>
                    <Box sx={{ height: '100vh' }} display={"flex"} alignItems={"center"}>
                        <Box width={"100%"} borderRadius={1}>
                            <Grid container spacing={2} alignItems={"center"}>
                                <Grid item xs={12} md={6}>
                                    <Box mb={5}>
                                        <Typography textAlign="center" variant="h4" color="primary">
                                            Reset Password
                                        </Typography>
                                        <Typography textAlign="center" variant="subtitle1" marginTop="5px">
                                            Enter a new password
                                        </Typography>
                                    </Box>
                                    <form autoComplete='off' onSubmit={handleSubmit}>
                                        <Box>
                                            <TextField
                                                fullWidth
                                                name='password'
                                                placeholder='New password'
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
                                                onChange={handleChange}
                                                variant="outlined"
                                            />
                                            {errors.password && <Typography component="small" fontSize={"14px"} color="red">{errors.password}</Typography>}
                                        </Box>
                                        <Box mt={2}>
                                            <TextField
                                                fullWidth
                                                name='confirmPassword'
                                                placeholder='Confirm password'
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
                                                onChange={handleChange}
                                                variant="outlined"
                                            />
                                            {errors.confirmPassword && <Typography component="small" fontSize={"14px"} color="red">{errors.confirmPassword}</Typography>}
                                        </Box>
                                        <Box mt={5} display="flex" justifyContent="center">
                                            <Button
                                                variant="contained"
                                                sx={{ borderRadius: "30px", padding: "8px 40px" }}
                                                type="submit"
                                                className='sign-in'
                                            >
                                                Reset New Password
                                            </Button>
                                        </Box>
                                        <Typography to={'/login'} component={Link} color="primary" textAlign={"center"} display={"block"} mt={3} sx={{ textDecoration: 'none', fontSize: '14px' }}>Back to Sign In</Typography>
                                        <Typography to={'/forgotPassword'} component={Link} color="primary" textAlign={"center"} display={"block"} mt={2} sx={{ textDecoration: 'none', fontSize: '14px' }}>Back to Forgot Password</Typography>
                                    </form>
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
        </div>
    )
}

export default ResetPassword;