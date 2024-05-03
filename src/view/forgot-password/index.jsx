import React, { Fragment, useEffect, useState } from "react";

// Mui
import { Box, Button, Container, Grid, InputAdornment, TextField, Typography } from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';

// react-router-dom
import { Link } from "react-router-dom";

// Axios
import axios from './../../axios/interceptor'

// Components and CSS
import Toast from "../../components/tostify";
import SignInImage from './../../assets/backgrounds/signIn.svg';
import forgotPasswordValidation from "../../utils/validation/forgot-password/forgotPasswordValidation";

const ForgotPassword = () => {
    const [resetPasswordDetail, setResetPasswordDetail] = useState({});
    const [sendOtp, setSendOtp] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({})

    const handleChnage = (e) => {
        setResetPasswordDetail({ ...resetPasswordDetail, [e.target.name]: e.target.value })
    }

    useEffect(() => {
        if (isSubmitting) {
            if (Object.values(errors).filter(i => i).length > 0) {
                setIsSubmitting(false)
            } else {
                (async () => {
                    await axios.post(`/authentication/forgot-password`, resetPasswordDetail)
                        .then(response => {
                            if (response?.data?.isSuccess) {
                                setSendOtp(true)
                                Toast(response?.data?.message, 'success');
                            } else {
                                Toast(response?.data?.message, 'error');
                            }
                        })
                        .catch(err => console.log(err))
                })()
                setIsSubmitting(false)
                setResetPasswordDetail({})
            }
        }
    }, [isSubmitting])

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors(forgotPasswordValidation(resetPasswordDetail))
        setIsSubmitting(true)
    }

    return (
        <Fragment>
            <Container>
                <Box sx={{ height: '100vh' }} display={"flex"} alignItems={"center"}>
                    <Box width={"100%"} borderRadius={1}>
                        <Grid container spacing={2} alignItems={"center"}>
                            <Grid item xs={12} md={6}>
                                {
                                    sendOtp ?
                                        <>
                                            <Typography textAlign="center" variant="h5" color="primary" mb={5}>Please Chek your email</Typography>
                                            <Box my={3}>
                                                <Typography component='small' display={"block"} textAlign={"center"}>Didn’t receive the email?</Typography>
                                                <Button
                                                    variant="contained"
                                                    sx={{ borderRadius: "30px", padding: "8px 60px", my: 2, display: 'block', mx: 'auto' }}
                                                    onClick={() => setSendOtp(false)}
                                                    className='sign-in'
                                                >
                                                    Resend Otp
                                                </Button>
                                            </Box>
                                            <Box display={"flex"} flexDirection={{ xs: "column", sm: "row" }} textAlign={"center"} gap={2} justifyContent={"center"} mt={4}>
                                                <Typography to={'/login'} component={Link} color="primary" sx={{ textDecoration: 'none' }}>Back to Sign In</Typography>
                                                <Typography to={'/forgotPassword'} component={Link} color="primary" sx={{ textDecoration: 'none' }} onClick={() => setSendOtp(false)}>Back to Forgot Password</Typography>
                                            </Box>
                                        </> :
                                        <>
                                            <Box mb={5}>
                                                <Typography textAlign="center" variant="h5" color="primary">Forgot Password</Typography>
                                                <Typography textAlign="center" variant="subtitle1" marginTop="5px">
                                                    You can reset your password here
                                                </Typography>
                                            </Box>
                                            <form autoComplete='off' onSubmit={handleSubmit}>
                                                <Box>
                                                    <TextField
                                                        fullWidth
                                                        name='username'
                                                        value={resetPasswordDetail.username}
                                                        placeholder='Enter username or email address'
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
                                                        onChange={handleChnage}
                                                        variant="outlined"
                                                    />
                                                    {errors.username && <Typography component="small" fontSize={"14px"} color="red">{errors.username}</Typography>}
                                                </Box>
                                                <Box display={"flex"} justifyContent={"end"} mt={1}>
                                                    <Typography to={'/login'} component={Link} color="primary" sx={{ textDecoration: 'none', fontSize: '14px' }}>Back to Sign In</Typography>
                                                </Box>
                                                <Box mt={5} display="flex" justifyContent="center">
                                                    <Button
                                                        variant="contained"
                                                        sx={{ borderRadius: "30px", padding: "8px 60px" }}
                                                        type="submit"
                                                        className='sign-in'
                                                    >
                                                        Send Otp
                                                    </Button>
                                                </Box>
                                            </form>
                                        </>
                                }
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

export default ForgotPassword;