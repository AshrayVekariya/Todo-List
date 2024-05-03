import React, { Fragment, useState } from "react";
import SignInImage from './../../assets/backgrounds/signIn.svg';
import { Box, Button, Container, Grid, Typography } from "@mui/material";
import OTPInput from "otp-input-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from './../../axios/interceptor'
import Toast from "../../components/tostify";

const VerifyOTP = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [otp, setOTP] = useState('');
    const [error, setError] = useState(null)

    const handleVerify = () => {
        if (otp.length !== 4) {
            setError("Please enter OTP!")
        } else {
            setError(null)
            axios.post(`/authentication/verify-otp`, { id: id, resetPasswordOTP: Number(otp) })
                .then(response => {
                    if (response?.data?.isSuccess) {
                        navigate(`/resetPassword/${id}/${response?.data.resetPasswordToken}`)
                    } else {
                        Toast(response?.data?.message, 'error');
                    }
                })
                .catch(err => console.log(err))
        }
    }

    return (
        <Fragment>
            <Container>
                <Box sx={{ height: '100vh' }} display={"flex"} alignItems={"center"}>
                    <Box width={"100%"} borderRadius={1}>
                        <Grid container spacing={2} alignItems={"center"}>
                            <Grid item xs={12} md={6}>
                                <Box mb={5}>
                                    <Typography textAlign="center" variant="h5" color="primary">Verification</Typography>
                                    <Typography textAlign="center" variant="subtitle1" marginTop="5px">
                                        An OTP has been sent to your email address, kindly enter them here
                                    </Typography>
                                </Box>
                                <Box display={"flex"} justifyContent={"center"}>
                                    <Box>
                                        <OTPInput value={otp} onChange={setOTP} autoFocus OTPLength={4} otpType="number" disabled={false} />
                                        {error && <Typography component="small" fontSize={"14px"} color="red">{error}</Typography>}
                                    </Box>
                                </Box>
                                <Box mt={5} display="flex" justifyContent="center">
                                    <Button
                                        variant="contained"
                                        sx={{ borderRadius: "30px", padding: "8px 60px" }}
                                        className='sign-in'
                                        onClick={handleVerify}
                                    >
                                        Verify
                                    </Button>
                                </Box>
                                <Typography to={'/login'} component={Link} color="primary" textAlign={"center"} display={"block"} mt={3} sx={{ textDecoration: 'none', fontSize: '14px' }}>Back to Sign In</Typography>
                                <Typography to={'/forgotPassword'} component={Link} color="primary" textAlign={"center"} display={"block"} mt={2} sx={{ textDecoration: 'none', fontSize: '14px' }}>Back to Forgot Password</Typography>
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

export default VerifyOTP;