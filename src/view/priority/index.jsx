import React, { useEffect, useState } from "react";

// Mui
import { Box, Button, Grid, InputLabel, Modal, TextField, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// react-data-table-component
import DataTable from 'react-data-table-component'

// Components and CSS
import Toast from "../../components/tostify";
import priorityValidation from "../../utils/validation/priority/priorityValidation";
import { createPriority, deletePriority, getAllPriority, getPriorityById, updatePriority } from "../../services/priority/priorityService";

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

const PriorityList = () => {
    const [priority, setPriority] = useState([]);
    const [priorityDetail, setPriorityDetail] = useState({
        priorityName: ''
    })
    const [search, setSearch] = useState('');
    const [open, setOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({})
    const [perPage, setPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        getPriority();
    }, [perPage,currentPage])

    useEffect(() => {
        if (editId !== null) {
            getSinglePriority();
        }
    }, [editId])

    const getPriority = async () => {
        const response = await getAllPriority({ page: currentPage, pageSize: perPage });
        setPriority(response)
    }

    const getSinglePriority = async () => {
        const response = await getPriorityById(editId);
        setPriorityDetail(response)
    }

    const addPriority = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
        setErrors({})
        setEditId(null)
        setPriorityDetail({ priorityName: "" })
    };

    const editPriority = (id) => {
        setEditId(id)
        setOpen(true)
    }

    const handleDeletePriority = async (id) => {
        const response = await deletePriority(id)
        if (response.isSuccess) {
            getPriority();
        }
    }

    const handleChange = (e) => {
        setPriorityDetail({ ...priorityDetail, [e.target.name]: e.target.value })
    }

    useEffect(() => {
        if (isSubmitting) {
            if (Object.values(errors).filter(i => i).length > 0) {
                setIsSubmitting(false)
            } else {
                (async () => {
                    try {
                        if (editId !== null) {
                            delete priorityDetail._id
                            const response = await updatePriority(editId, priorityDetail)
                            if (response.isSuccess) {
                                getPriority();
                            }
                            setEditId(null)
                        } else {
                            const response = await createPriority(priorityDetail)
                            if (response.isSuccess) {
                                getPriority();
                            }
                        }
                        setPriorityDetail({ priorityName: "" })
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
        setErrors(priorityValidation(priorityDetail))
        setIsSubmitting(true)
    }

    const columns = [
        {
            name: 'Priority',
            selector: row => row.priorityName,
        },
        {
            name: 'Action',
            cell: (row) => (
                <Box display={"flex"} gap={2}>
                    <Typography component="span" onClick={() => editPriority(row._id)}>
                        <EditIcon sx={{ cursor: "pointer", color: "green" }} />
                    </Typography>
                    <Typography component="span" onClick={() => handleDeletePriority(row._id)}>
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
                                    <Typography component='h4' fontWeight={700}>Add Priority</Typography>
                                </Box>
                                <Grid container spacing={3} alignItems={"center"} p={3}>
                                    <Grid item xs={12} md={2}>
                                        <InputLabel>Priority</InputLabel>
                                    </Grid>
                                    <Grid item xs={12} md={10}>
                                        <TextField
                                            fullWidth
                                            type='text'
                                            variant="outlined"
                                            placeholder='Enter priority'
                                            name="priorityName"
                                            value={priorityDetail.priorityName}
                                            onChange={handleChange}
                                        />
                                        {errors.priorityName && <Typography component="small" fontSize={"14px"} color="red">{errors.priorityName}</Typography>}
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

            {/* Priority List */}
            <Grid container spacing={3} p={3}>
                <Grid item xs={12} mb={1}>
                    <Grid container justifyContent={"space-between"} alignItems={"center"}>
                        <Grid>
                            <h2>Priority List</h2>
                        </Grid>
                        <Grid>
                            <Button
                                color="primary"
                                variant="contained"
                                sx={{ padding: "5px 32px" }}
                                startIcon={<AddIcon />}
                                onClick={addPriority}
                            >
                                ADD
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <DataTable
                        columns={columns}
                        data={priority?.filter(item => {
                            if (search === '') {
                                return item
                            }
                            else if (item.priorityName.toLowerCase().includes(search.toLowerCase())) {
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

export default PriorityList;