import React, { Fragment, useEffect, useState } from "react";

// Mui
import { Box, Button, Grid, MenuItem, Modal, Select, TextField, Typography } from "@mui/material";

// ckedior
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

// Components and css
import taskValidation from "../../utils/validation/task/taskValidation";
import { uploadPlugin } from './../../view/task-list/add-task/index';
import Toast from "../tostify";
import { getAllUsers } from "../../services/user/userService";
import { getAllStatus } from "../../services/status/statusService";
import { getAllPriority } from "../../services/priority/priorityService";
import { createSubTask, deleteSubTask, getSubTaskById, updateSubTask } from "../../services/sub-task/subTaskService";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: 300, sm: 400, md: 600 },
    bgcolor: 'background.paper',
    overflow: 'Hidden',
    overflowY: 'auto',
    height: 'calc(100vh - 195px)',
    borderRadius: '5px',
    boxShadow: 24,
    p: 4,
};

const TaskModal = ({ open, setOpen, parentId, getTask, subTaskId, setSubTaskId, deleteSubTaskId, setDeleteSubTask }) => {
    const [subTaskDetail, setSubTaskDetail] = useState({
        taskName: '',
        priority: '',
        deadline: '',
        status: '',
        userId: '',
        description: '',
    })
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [editId, setEditId] = useState(null);
    const [textEditor, setTextEditor] = useState('');
    const [userList, setUserList] = useState([]);
    const [priorityList, setPriorityList] = useState([]);
    const [statusList, setStatusList] = useState([]);

    useEffect(() => {
        getUsers();
        getStatus();
        getPriority();
    }, [])

    useEffect(() => {
        if (subTaskId) {
            setEditId(subTaskId)
            setOpen(true)
        }
    }, [subTaskId])

    useEffect(() => {
        if (deleteSubTaskId) {
            (async () => {
                const response = await deleteSubTask(deleteSubTaskId)
                if (response.isSuccess) {
                    getTask();
                    setDeleteSubTask(null)
                }
            })()
        }
    }, [deleteSubTaskId])

    const getUsers = async () => {
        const response = await getAllUsers();
        setUserList(response)
    }

    const getStatus = async () => {
        const response = await getAllStatus();
        setStatusList(response)
    }

    const getPriority = async () => {
        const response = await getAllPriority();
        setPriorityList(response)
    }

    useEffect(() => {
        if (editId !== null) {
            getSingleSubTask();
        }
    }, [editId])

    useEffect(() => {
        getTask();
    }, [])

    const resetForm = () => {
        setSubTaskDetail({
            taskName: '',
            priority: '',
            deadline: '',
            status: '',
            userId: '',
            description: '',
        })
    }

    const getSingleSubTask = async () => {
        const response = await getSubTaskById(editId);
        setSubTaskDetail(response)
    }

    const handleClose = () => {
        setOpen(false);
        resetForm()
        setEditId(null)
        setSubTaskId(null)
        setErrors({})
    };

    const handleChange = (e) => {
        if (e?.target?.files) {
            setSubTaskDetail({ ...subTaskDetail, taskImage: e.target.files[0] })
        } else {
            setSubTaskDetail({ ...subTaskDetail, [e.target.name]: e.target.value })
        }
    }

    useEffect(() => {
        if (isSubmitting) {
            if (Object.values(errors).filter(i => i).length > 0) {
                setIsSubmitting(false)
            } else {
                (async () => {
                    try {
                        if (editId !== null) {
                            delete subTaskDetail._id
                            subTaskDetail.description = textEditor
                            const response = await updateSubTask(editId, subTaskDetail)
                            if (response.isSuccess) {
                                getTask();
                            }
                            setEditId(null)
                            setSubTaskId(null)
                        } else {
                            const response = await createSubTask(subTaskDetail)
                            if (response.isSuccess) {
                                getTask();
                            }
                        }
                        setOpen(false)
                    } catch (err) {
                        Toast(err?.message, "error")
                    }
                })();
                resetForm()
                setIsSubmitting(false)
            }
        }
    }, [isSubmitting])

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors(taskValidation(subTaskDetail))
        setIsSubmitting(true)
    }

    return (
        <Fragment>
            <Box>
                <Modal open={open}>
                    <Box sx={style}>
                        <form onSubmit={handleSubmit} autoComplete="off">
                            <Box>
                                <Box>
                                    <Typography component='h4' fontWeight={700}>{editId ? "Edit Sub Task" : "Add Sub Task"}</Typography>
                                </Box>
                                <Grid container spacing={3} alignItems={"center"} p={3}>
                                    <Grid item xs={12}>
                                        <Typography component="span" mb={1} display={"block"}>Task Name*</Typography>
                                        <TextField
                                            variant="outlined"
                                            name="taskName"
                                            value={subTaskDetail.taskName}
                                            onChange={handleChange}
                                            placeholder="First name"
                                            fullWidth
                                        />
                                        {errors.taskName && <Typography component="small" fontSize={"14px"} color="red">{errors.taskName}</Typography>}
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography component="span" mb={1} display={"block"}>Priority*</Typography>
                                        <Select
                                            name="priority"
                                            value={subTaskDetail.priority}
                                            onChange={handleChange}
                                            fullWidth
                                            displayEmpty
                                        >
                                            <MenuItem selected disabled value="">Select Priority</MenuItem>
                                            {
                                                priorityList?.map((i, index) => {
                                                    return <MenuItem key={index} value={i._id}>{i.priorityName}</MenuItem>
                                                })
                                            }
                                        </Select>
                                        {errors.priority && <Typography component="small" fontSize={"14px"} color="red">{errors.priority}</Typography>}
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography component="span" mb={1} display={"block"}>Status*</Typography>
                                        <Select
                                            name="status"
                                            value={subTaskDetail.status}
                                            onChange={handleChange}
                                            fullWidth
                                            displayEmpty
                                        >
                                            <MenuItem selected disabled value="">Select Status</MenuItem>
                                            {
                                                statusList?.map((i, index) => {
                                                    return <MenuItem key={index} value={i._id}>{i.statusName}</MenuItem>
                                                })
                                            }
                                        </Select>
                                        {errors.status && <Typography component="small" fontSize={"14px"} color="red">{errors.status}</Typography>}
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography component="span" mb={1} display={"block"}>Assign User*</Typography>
                                        <Select
                                            name="userId"
                                            value={subTaskDetail.userId}
                                            onChange={handleChange}
                                            fullWidth
                                            displayEmpty
                                        >
                                            <MenuItem selected disabled value="">Select User</MenuItem>
                                            {
                                                userList?.map((i, index) => {
                                                    return <MenuItem key={index} value={i._id}>{`${i.firstName} ${i.lastName}`}</MenuItem>
                                                })
                                            }
                                        </Select>
                                        {errors.userId && <Typography component="small" fontSize={"14px"} color="red">{errors.userId}</Typography>}
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography component="span" mb={1} display={"block"}>Deadline*</Typography>
                                        <TextField
                                            type="date"
                                            name="deadline"
                                            value={subTaskDetail.deadline}
                                            variant="outlined"
                                            onChange={handleChange}
                                            fullWidth
                                        />
                                        {errors.deadline && <Typography component="small" fontSize={"14px"} color="red">{errors.deadline}</Typography>}
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography component="span" mb={1} display={"block"}>Description*</Typography>
                                        <CKEditor
                                            editor={ClassicEditor}
                                            data={subTaskDetail.description}
                                            config={{
                                                extraPlugins: [uploadPlugin]
                                            }}
                                            onChange={(event, editor) => {
                                                setTextEditor(editor.getData())
                                            }}
                                        />
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
        </Fragment>
    )
}

export default React.memo(TaskModal);