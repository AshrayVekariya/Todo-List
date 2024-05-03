import React, { useEffect, useState } from "react";

// Mui
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// react-data-table-components
import DataTable from 'react-data-table-component'

// react-router-dom
import { useNavigate } from "react-router-dom";

// COmponents and CSS
import { deleteUser, getAllUsers } from "../../services/user/userService";

const UserList = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState([]);
    const [search, setSearch] = useState('');
    const [perPage, setPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        getUsers();
    }, [currentPage, perPage])

    const getUsers = async () => {
        const response = await getAllUsers({ page: currentPage, pageSize: perPage });
        setUser(response)
    }

    const handleAddUser = () => {
        navigate('/add/user')
    }

    const handleUpdateUser = (id) => {
        navigate(`/user/edit/${id}`)
    }

    const handleDeleteUser = async (id) => {
        const response = await deleteUser(id)
        if (response.isSuccess) {
            getUsers();
        }
    }

    const columns = [
        {
            name: 'First Name',
            selector: row => row.firstName,
        },
        {
            name: 'Last Name',
            selector: row => row.lastName,
        },
        {
            name: 'Username',
            selector: row => row.username,
            sortable: true,
        },
        {
            name: 'Email',
            selector: row => row.email,
            sortable: true,
        },
        {
            name: 'Date of Birth',
            selector: row => row.dob,
        },
        {
            name: 'Role',
            cell: row => row.role,
        },
        {
            name: 'Action',
            cell: (row) => (
                <Box display={"flex"} gap={2}>
                    <Typography component="span" onClick={() => handleUpdateUser(row._id)}>
                        <EditIcon sx={{ cursor: "pointer", color: "green" }} />
                    </Typography>
                    <Typography component="span" onClick={() => handleDeleteUser(row._id)}>
                        <DeleteIcon sx={{ cursor: "pointer", color: "red" }} />
                    </Typography>
                </Box>
            )
        }
    ]

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handlePerRowsChange = async (newPerPage, page) => {
        setPerPage(newPerPage);
    };

    return (
        <div>
            <Grid container spacing={3} p={3}>
                <Grid item xs={12} mb={1}>
                    <Grid container justifyContent={"space-between"} alignItems={"center"}>
                        <Grid>
                            <h2>User List</h2>
                        </Grid>
                        <Grid>
                            <Button
                                color="primary"
                                variant="contained"
                                sx={{ padding: "5px 32px" }}
                                startIcon={<AddIcon />}
                                onClick={handleAddUser}
                            >
                                ADD
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <DataTable
                        columns={columns}
                        data={user?.filter(item => {
                            if (search === '') {
                                return item
                            }
                            else if (item.firstName.toLowerCase().includes(search.toLowerCase()) || item.username.toLowerCase().includes(search.toLowerCase()) || item.email.toLowerCase().includes(search.toLowerCase())) {
                                return item
                            }
                        })}
                        highlightOnHover
                        pagination
                        paginationPerPage={5}
                        paginationRowsPerPageOptions={[5, 10, 15, 20]}
                        onChangePage={handlePageChange}
                        onChangeRowsPerPage={handlePerRowsChange}
                        paginationComponentOptions={{
                            rowsPerPageText: 'Records per page:',
                            rangeSeparatorText: 'out of',
                        }}
                        subHeader
                        subHeaderComponent={
                            <Grid container display={"flex"} justifyContent="end" mb={6}>
                                <Grid item xs={12} md={8} lg={3}>
                                    <TextField
                                        fullWidth
                                        type='text'
                                        variant="outlined"
                                        placeholder='Search...'
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        sx={{
                                            "& .MuiOutlinedInput-input": {
                                                py: 1.5
                                            }
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        }
                    />
                </Grid>
            </Grid>
        </div>
    )
}

export default UserList;