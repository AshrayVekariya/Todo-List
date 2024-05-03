import React, { useEffect, useState } from "react";

// Mui
import { Box, Button, Grid, MenuItem, Select, TextField, Typography } from "@mui/material";

// react-router-dom
import { useNavigate, useParams } from 'react-router-dom'

// Components and CSS
import { createUser, getUserById, updateUser } from "../../../services/user/userService";
import userValidation from "../../../utils/validation/user/uservalidation";

const AddUser = () => {
    const { id } = useParams()
    const navigate = useNavigate();
    const [userDetails, setUserDetails] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        role: '',
        dob: null,
        profilePicture: null,
        password: '',
        confirmPassword: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({})
    const [updatePassword, setUpdatePassword] = useState(true)

    useEffect(() => {
        if (id) {
            getUser()
        }
    }, [id])

    useEffect(() => {
        if (id) {
            setUpdatePassword(false)
        } else {
            setUpdatePassword(true)
        }
    }, [id])

    const getUser = async () => {
        const response = await getUserById(id);
        setUserDetails(response)
    }

    const handleChange = (e) => {
        if (e?.target?.files) {
            setUserDetails({ ...userDetails, profilePicture: e.target.files[0] })
        } else {
            setUserDetails({ ...userDetails, [e?.target?.name]: e.target.value })
        }
    }

    useEffect(() => {
        if (isSubmitting) {
            if (Object.values(errors).filter(i => i).length > 0) {
                setIsSubmitting(false)
            } else {
                delete userDetails.confirmPassword
                const userData = new FormData()
                userData.append('firstName', userDetails.firstName)
                userData.append('lastName', userDetails.lastName)
                userData.append('username', userDetails.username)
                userData.append('email', userDetails.email)
                userData.append('role', userDetails.role)
                userData.append('dob', userDetails.dob)
                userData.append('profilePicture', userDetails.profilePicture)
                userData.append('password', userDetails.password)
                if (id) {
                    delete userDetails._id
                    updateUser(id, { userData, contentType: 'multipart/form-data' })
                    navigate('/user')
                } else {
                    createUser({ userData, contentType: 'multipart/form-data' })
                    navigate('/user')
                }
                setIsSubmitting(false)
            }
        }
    }, [isSubmitting])

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors(userValidation(userDetails, updatePassword))
        setIsSubmitting(true)
    }

    return (
        <Box p={3}>
            <Box mb={5}>
                <h2>Add User</h2>
            </Box>
            <form action="" onSubmit={handleSubmit} autoComplete="off">
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6} lg={4}>
                        <Typography component="span" mb={1} display={"block"}>First Name*</Typography>
                        <TextField
                            variant="outlined"
                            name="firstName"
                            value={userDetails?.firstName}
                            placeholder="First name"
                            onChange={handleChange}
                            fullWidth
                        />
                        {errors.firstName && <Typography component="small" fontSize={"14px"} color="red">{errors.firstName}</Typography>}
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                        <Typography component="span" mb={1} display={"block"}>Last Name*</Typography>
                        <TextField
                            placeholder="Last name"
                            name="lastName"
                            value={userDetails?.lastName}
                            variant="outlined"
                            onChange={handleChange}
                            fullWidth
                        />
                        {errors.lastName && <Typography component="small" fontSize={"14px"} color="red">{errors.lastName}</Typography>}
                    </Grid>
                    <Grid item xs={12} md={5} lg={4}>
                        <Typography component="span" mb={1} display={"block"}>Username*</Typography>
                        <TextField
                            placeholder="username"
                            name="username"
                            value={userDetails?.username}
                            variant="outlined"
                            onChange={handleChange}
                            fullWidth
                        />
                        {errors.username && <Typography component="small" fontSize={"14px"} color="red">{errors.username}</Typography>}
                    </Grid>
                    <Grid item xs={12} md={7} lg={6}>
                        <Typography component="span" mb={1} display={"block"}>Email*</Typography>
                        <TextField
                            placeholder="Email"
                            name="email"
                            value={userDetails?.email}
                            variant="outlined"
                            onChange={handleChange}
                            fullWidth
                        />
                        {errors.email && <Typography component="small" fontSize={"14px"} color="red">{errors.email}</Typography>}
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <Typography component="span" mb={1} display={"block"}>Role*</Typography>
                        <Select
                            name="role"
                            value={userDetails?.role}
                            onChange={handleChange}
                            fullWidth
                            displayEmpty
                        >
                            <MenuItem selected disabled value="">Select Role</MenuItem>
                            <MenuItem value={"Admin"}>Admin</MenuItem>
                            <MenuItem value={"User"}>User</MenuItem>
                        </Select>
                        {errors.role && <Typography component="small" fontSize={"14px"} color="red">{errors.role}</Typography>}
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <Typography component="span" mb={1} display={"block"}>Date of Birth*</Typography>
                        <TextField
                            type="date"
                            name="dob"
                            value={userDetails.dob}
                            variant="outlined"
                            onChange={handleChange}
                            fullWidth
                        />
                        {errors.dob && <Typography component="small" fontSize={"14px"} color="red">{errors.dob}</Typography>}
                    </Grid>
                    <Grid item xs={12} md={12} lg={6}>
                        <Typography component="span" mb={1} display={"block"}>Profile Picture</Typography>
                        <TextField
                            type="file"
                            name="profilePicture"
                            variant="outlined"
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>
                    {
                        !id && <>
                            <Grid item xs={12} md={6} lg={3}>
                                <Typography component="span" mb={1} display={"block"}>Password*</Typography>
                                <TextField
                                    type="password"
                                    name="password"
                                    placeholder="Enter password"
                                    value={userDetails?.password}
                                    variant="outlined"
                                    onChange={handleChange}
                                    fullWidth
                                />
                                {errors.password && <Typography component="small" fontSize={"14px"} color="red">{errors.password}</Typography>}
                            </Grid>
                            <Grid item xs={12} md={6} lg={3}>
                                <Typography component="span" mb={1} display={"block"}>Confirm Password*</Typography>
                                <TextField
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Enter confirm password"
                                    variant="outlined"
                                    onChange={handleChange}
                                    fullWidth
                                />
                                {errors.confirmPassword && <Typography component="small" fontSize={"14px"} color="red">{errors.confirmPassword}</Typography>}
                            </Grid>
                        </>
                    }
                    <Grid item xs={12} mt={3}>
                        <Box display={"flex"} gap={2}>
                            <Button variant="contained" type="submit" sx={{ px: 4 }}>Save</Button>
                            <Button variant="contained" color="error" sx={{ px: 3 }} onClick={() => navigate(-1)}>Cancel</Button>
                        </Box>
                    </Grid>
                </Grid>
            </form>
        </Box >
    )
}

export default AddUser;