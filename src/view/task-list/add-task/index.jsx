import React, { useEffect, useState } from "react";

// Mui
import { Box, Button, Grid, MenuItem, Select, TextField, Typography } from "@mui/material";

// react-router-dom
import { useNavigate, useParams } from "react-router-dom";

// ckedior
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

// Components and CSS
import taskValidation from "../../../utils/validation/task/taskValidation";
import { getAllUsers } from "../../../services/user/userService";
import { getAllStatus } from "../../../services/status/statusService";
import { getAllPriority } from "../../../services/priority/priorityService";
import { createTask, getTaskById, updateTask } from "../../../services/task/taskService";
import SubTasks from "../../sub-task";
import axios from './../../../axios/interceptor';

export function uploadAdapter(loader) {
    return {
        upload: () => {
            return new Promise((resolve, reject) => {
                const body = new FormData();
                loader.file.then((file) => {
                    body.append('image', file);
                    axios.post("/taskList/upload/image", body, {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    })
                        .then((response) => {
                            resolve({ default: response.data.taskImage.map(i => `http://localhost:8080/${i.path}`) })
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                })
            })
        }
    }
}

export function uploadPlugin(editor) {

    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {

        return new uploadAdapter(loader)

    }

}

const AddTask = () => {
    const { id } = useParams()
    const navigate = useNavigate();
    const [taskDetail, setTaskDetail] = useState({
        taskName: '',
        priority: '',
        deadline: '',
        status: '',
        userId: '',
        description: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [userList, setUserList] = useState([]);
    const [priorityList, setPriorityList] = useState([]);
    const [statusList, setStatusList] = useState([]);
    const [isSubTask, setIsSubTask] = useState(false);
    const [open, setOpen] = useState(false);
    const [addTaskId, setAddTaskId] = useState(null)
    const [textEditor, setTextEditor] = useState('')

    useEffect(() => {
        getUsers();
        getStatus();
        getPriority();
    }, [])

    useEffect(() => {
        if (id) {
            getTask()
            setIsSubTask(true)
        }
    }, [id])

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

    const getTask = async () => {
        const response = await getTaskById(id);
        setTaskDetail(response)
    }

    const handleChange = (e) => {
        if (e?.target?.files) {
            setTaskDetail({ ...taskDetail, taskImage: e.target.files[0] })
        } else {
            setTaskDetail({ ...taskDetail, [e.target.name]: e.target.value })
        }
    }

    useEffect(() => {
        if (isSubmitting) {
            if (Object.values(errors).filter(i => i).length > 0) {
                setIsSubmitting(false)
            } else {
                (async () => {
                    if (id) {
                        delete taskDetail._id
                        taskDetail.description = textEditor
                        updateTask(id, taskDetail)
                    } else {
                        await createTask(taskDetail, setAddTaskId)
                        setIsSubTask(true)
                    }
                }
                )()
                setIsSubmitting(false)
            }
        }
    }, [isSubmitting])

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors(taskValidation(taskDetail))
        setIsSubmitting(true)
    }

    const addSubTask = () => {
        setOpen(true)
    }

    return (
        <div>
            <Box p={3}>
                <Button variant="contained" type="submit" sx={{ px: 4, display: "block", my: 2, marginLeft: 'auto' }} onClick={() => navigate(-1)}>Back</Button>
                <Box mb={5}>
                    <h2>Add Task</h2>
                </Box>
                <form action="" onSubmit={handleSubmit} autoComplete="off">
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography component="span" mb={1} display={"block"}>Task Name*</Typography>
                            <TextField
                                variant="outlined"
                                name="taskName"
                                value={taskDetail.taskName}
                                onChange={handleChange}
                                placeholder="First name"
                                fullWidth
                            />
                            {errors.taskName && <Typography component="small" fontSize={"14px"} color="red">{errors.taskName}</Typography>}
                        </Grid>
                        <Grid item xs={12} md={6} lg={4}>
                            <Typography component="span" mb={1} display={"block"}>Priority*</Typography>
                            <Select
                                name="priority"
                                value={taskDetail.priority}
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
                        <Grid item xs={12} md={5} lg={4}>
                            <Typography component="span" mb={1} display={"block"}>Status*</Typography>
                            <Select
                                name="status"
                                value={taskDetail.status}
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
                        <Grid item xs={12} md={7} lg={4}>
                            <Typography component="span" mb={1} display={"block"}>Assign User*</Typography>
                            <Select
                                name="userId"
                                value={taskDetail.userId}
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
                        <Grid item xs={12} md={6} lg={3}>
                            <Typography component="span" mb={1} display={"block"}>Deadline*</Typography>
                            <TextField
                                type="date"
                                name="deadline"
                                value={taskDetail.deadline}
                                variant="outlined"
                                onChange={handleChange}
                                fullWidth
                            />
                            {errors.deadline && <Typography component="small" fontSize={"14px"} color="red">{errors.deadline}</Typography>}
                        </Grid>
                        <Grid item xs={12} md={6} lg={9}>
                            <Typography component="span" mb={1} display={"block"}>Description</Typography>
                            <CKEditor
                                editor={ClassicEditor}
                                data={taskDetail.description}
                                config={{
                                    extraPlugins: [uploadPlugin]
                                }}
                                onChange={(event, editor) => {
                                    setTextEditor(editor.getData())
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} mt={3}>
                            <Box display={"flex"} gap={2} flexDirection={{ xs: "column", md: 'row' }}>
                                <Button variant="contained" type="submit" sx={{ px: 4 }}>Save</Button>
                                <Button variant="contained" color="error" sx={{ px: 3 }} onClick={() => navigate(-1)}>Cancel</Button>
                                {
                                    isSubTask ? <Button variant="contained" sx={{ px: 4, display: "block", marginLeft: { xs: "none", md: 'auto' } }} onClick={addSubTask}>Add Sub Task</Button> : null
                                }
                            </Box>
                        </Grid>
                    </Grid>
                </form>
                <Box mt={3}>
                    <SubTasks
                        open={open}
                        setOpen={setOpen}
                        userList={userList}
                        statusList={statusList}
                        priorityList={priorityList}
                        parentId={addTaskId ? addTaskId : id} />
                </Box>
            </Box >
        </div>
    )
}

export default AddTask;