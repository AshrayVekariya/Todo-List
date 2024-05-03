import React, { useEffect, useState } from "react";

// Mui
import { Box, Button, Grid, InputLabel, Modal, TextField, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// react-data-table-component 
import DataTable from 'react-data-table-component';

// Components and CSS
import statusValidation from "../../utils/validation/status/statusValidation";
import Toast from "../../components/tostify";
import { createStatus, deleteStatus, getAllStatus, getStatusById, updateStatus } from "../../services/status/statusService";

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

const StatusList = () => {
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({})
    const [status, setStatus] = useState([]);
    const [statusDetail, setStatusDetail] = useState({
        statusName: ''
    })
    const [search, setSearch] = useState('');
    const [editId, setEditId] = useState(null);
    const [perPage, setPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        getStatus();
    }, [currentPage, perPage])

    useEffect(() => {
        if (editId !== null) {
            getSingleStatus();
        }
    }, [editId])

    const getStatus = async () => {
        const response = await getAllStatus({ page: currentPage, pageSize: perPage });
        setStatus(response)
    }

    const getSingleStatus = async () => {
        const response = await getStatusById(editId);
        setStatusDetail(response)
    }

    const addStatus = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
        setErrors({})
        setStatusDetail({ statusName: "" })
        setEditId(null)
    };

    const editStatus = (id) => {
        setEditId(id)
        setOpen(true)
    }

    const deleteStatusById = async (id) => {
        const response = await deleteStatus(id)
        if (response.isSuccess) {
            getStatus();
        }
    }

    const handleChange = (e) => {
        setStatusDetail({ ...statusDetail, [e.target.name]: e.target.value })
    }

    useEffect(() => {
        if (isSubmitting) {
            if (Object.values(errors).filter(i => i).length > 0) {
                setIsSubmitting(false)
            } else {
                (async () => {
                    try {
                        if (editId !== null) {
                            delete statusDetail._id
                            const response = await updateStatus(editId, statusDetail)
                            if (response.isSuccess) {
                                getStatus();
                            }
                            setEditId(null)
                        } else {
                            const response = await createStatus(statusDetail)
                            if (response.isSuccess) {
                                getStatus();
                            }
                        }
                        setStatusDetail({ statusName: "" })
                        setOpen(false)
                    } catch (err) {
                        Toast(err?.message, "error")
                    }
                })();
                setIsSubmitting(false)
            }
        }
    }, [isSubmitting])

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors(statusValidation(statusDetail))
        setIsSubmitting(true)
    }

    const columns = [
        {
            name: 'Status',
            selector: row => row.statusName,
        },
        {
            name: 'Action',
            cell: (row) => (
                <Box display={"flex"} gap={2}>
                    <Typography component="span" onClick={() => editStatus(row._id)}>
                        <EditIcon sx={{ cursor: "pointer", color: "green" }} />
                    </Typography>
                    <Typography component="span" onClick={() => deleteStatusById(row._id)}>
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
            <Box>
                <Modal open={open}>
                    <Box sx={style}>
                        <form action="" onSubmit={handleSubmit} autoComplete="off">
                            <Box>
                                <Box>
                                    <Typography component='h4' fontWeight={700}>Add Status</Typography>
                                </Box>
                                <Grid container spacing={3} alignItems={"center"} p={3}>
                                    <Grid item xs={12} md={2}>
                                        <InputLabel>Status</InputLabel>
                                    </Grid>
                                    <Grid item xs={12} md={10}>
                                        <TextField
                                            fullWidth
                                            type='text'
                                            variant="outlined"
                                            placeholder='Enter status name'
                                            name="statusName"
                                            value={statusDetail?.statusName}
                                            onChange={handleChange}
                                        />
                                        {errors.statusName && <Typography component="small" fontSize={"14px"} color="red">{errors.statusName}</Typography>}
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

            {/* Status list table */}
            <Grid container spacing={3} p={3}>
                <Grid item xs={12} mb={1}>
                    <Grid container justifyContent={"space-between"} alignItems={"center"}>
                        <Grid>
                            <h2>Status List</h2>
                        </Grid>
                        <Grid>
                            <Button
                                color="primary"
                                variant="contained"
                                sx={{ padding: "5px 32px" }}
                                startIcon={<AddIcon />}
                                onClick={addStatus}
                            >
                                ADD
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <DataTable
                        columns={columns}
                        data={status?.filter(item => {
                            if (search === '') {
                                return item
                            }
                            else if (item.statusName.toLowerCase().includes(search.toLowerCase())) {
                                return item
                            }
                        })}
                        highlightOnHover
                        pagination
                        paginationPerPage={5}
                        paginationRowsPerPageOptions={[5, 10, 15, 20]}
                        paginationComponentOptions={{
                            rowsPerPageText: 'Records per page:',
                            rangeSeparatorText: 'out of',
                        }}
                        subHeader
                        onChangePage={handlePageChange}
                        onChangeRowsPerPage={handlePerRowsChange}
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

export default StatusList;