import React, { useEffect, useState } from "react";

// Mui
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Checkbox, Grid, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// react-data-table-component
import DataTable from 'react-data-table-component';

// react-router-dom
import { useNavigate } from "react-router-dom";

// Components and CSS
import { deleteTask, getAllTask } from "../../services/task/taskService";
import { getAllUsers } from "../../services/user/userService";
import TaskModal from "../../components/task-modal/TaskModal";

const TaskList = () => {
    const navigate = useNavigate();
    const [taskList, setTaskList] = useState([]);
    const [userList, setUserList] = useState([]);
    const [assigness, setAssigness] = useState('')
    const [group, setGroup] = useState("status");
    const [expand, setExpand] = useState("collapse");
    const [deadline, setDeadline] = useState(false);
    const [open, setOpen] = useState(false);
    const [subTaskId, setSubTaskId] = useState(null)
    const [deleteSubTask, setDeleteSubTask] = useState(null)
    const [parentId, setParentId] = useState(null)

    useEffect(() => {
        getUsers();
    }, [])

    useEffect(() => {
        getTask();
    }, [assigness, group, expand, deadline])

    const getUsers = async () => {
        const response = await getAllUsers();
        setUserList(response)
    }

    const getTask = async () => {
        const response = await getAllTask({ assigness: assigness, group: group, expand: expand, deadline: deadline });
        setTaskList(response)
    }

    const addNewTask = () => {
        navigate('/taskList/add')
    }

    const editTask = (id) => {
        navigate(`/taskList/edit/${id}`)
    }

    const deleteTaskList = async (id) => {
        const response = await deleteTask(id)
        if (response.isSuccess) {
            getTask();
        }
    }

    const columns = [
        {
            name: 'Task',
            selector: row => row.taskName,
        },
        {
            name: 'Status',
            selector: row => row.status.statusName
        },
        {
            name: 'Priority',
            selector: row => row.priority.priorityName
        },
        {
            name: 'Deadline',
            selector: row => row.deadline,
        },
        {
            name: 'Assign User',
            selector: row => `${row.userDetail.firstName} ${row.userDetail.lastName}`
        },
        {
            name: 'Action',
            cell: (row) => (
                <Box display={"flex"} gap={2}>
                    <Typography component="span" onClick={() => editTask(row._id)}>
                        <EditIcon sx={{ cursor: "pointer", color: "green" }} />
                    </Typography>
                    <Typography component="span" onClick={() => deleteTaskList(row._id)}>
                        <DeleteIcon sx={{ cursor: "pointer", color: "red" }} />
                    </Typography>
                </Box>
            )
        }
    ]

    const ExpandedComponent = ({ data }) => {
        useEffect(() => {
            setParentId(data._id)
        }, [])
        return (
            <Box px={4} py={2}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableBody>
                            {data.subTasks.map((row) => (
                                <TableRow
                                    key={row.name}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {row.taskName}
                                    </TableCell>
                                    <TableCell align="right">{row.status.statusName}</TableCell>
                                    <TableCell align="right">{row.priority.priorityName}</TableCell>
                                    <TableCell align="right">{row.deadline}</TableCell>
                                    <TableCell align="right">{`${row.userDetail.firstName} ${row.userDetail.lastName}`}</TableCell>
                                    <TableCell align="right">
                                        <Box display={"flex"} gap={2} justifyContent={'end'}>
                                            <Typography component="span" onClick={() => setSubTaskId(row._id)}>
                                                <EditIcon sx={{ cursor: "pointer", color: "green" }} />
                                            </Typography>
                                            <Typography component="span" onClick={() => setDeleteSubTask(row._id)}>
                                                <DeleteIcon sx={{ cursor: "pointer", color: "red" }} />
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        )
    };

    return (
        <div>
            {/* Update Sub Task */}
            <TaskModal
                open={open}
                setOpen={setOpen}
                subTaskId={subTaskId}
                setSubTaskId={setSubTaskId}
                deleteSubTaskId={deleteSubTask}
                setDeleteSubTask={setDeleteSubTask}
                getTask={getTask}
                parentId={parentId}
            />

            {/* Task list table */}
            <Grid container spacing={3} p={3}>
                <Grid item xs={12} mb={1}>
                    <Grid container justifyContent={"space-between"} alignItems={"center"}>
                        <Grid>
                            <h2>Task List</h2>
                        </Grid>
                        <Grid>
                            <Button
                                color="primary"
                                variant="contained"
                                sx={{ padding: "5px 32px" }}
                                startIcon={<AddIcon />}
                                onClick={addNewTask}
                            >
                                ADD
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} mb={6}>
                    <Grid container spacing={3} display={"flex"} justifyContent="end">
                        <Grid item xs={12} md={6} lg={3} xl={2}>
                            <Select
                                name="userId"
                                value={assigness}
                                onChange={(e) => setAssigness(e.target.value)}
                                fullWidth
                                displayEmpty
                            >
                                <MenuItem selected value="">All User</MenuItem>
                                {
                                    userList?.map((i, index) => {
                                        return <MenuItem key={index} value={i._id}>{`${i.firstName} ${i.lastName}`}</MenuItem>
                                    })
                                }
                            </Select>
                        </Grid>
                        <Grid item xs={12} md={6} lg={3} xl={2}>
                            <Select
                                value={expand}
                                onChange={(e) => setExpand(e.target.value)}
                                fullWidth
                            >
                                <MenuItem selected value="collapse">Collapse All</MenuItem>
                                <MenuItem selected value="expand">Expand All</MenuItem>
                            </Select>
                        </Grid>
                        <Grid item xs={12} md={6} lg={3} xl={2}>
                            <Select
                                value={group}
                                onChange={(e) => setGroup(e.target.value)}
                                fullWidth
                            >
                                <MenuItem selected value="status">Status</MenuItem>
                                <MenuItem selected value="priority">Priority</MenuItem>
                            </Select>
                        </Grid>
                        <Grid item xs={12} md={6} lg={3} xl={2}>
                            <Checkbox
                                onChange={(e) => setDeadline(e.target.checked)}
                                id="deadline"
                                sx={{ display: "none" }}
                                inputProps={{ 'aria-label': 'controlled' }}
                            />
                            <Box display={'flex'} justifyContent={'center'}>
                                <InputLabel htmlFor="deadline" sx={{ width: '100%', backgroundColor: deadline ? "#c0c0c0" : null, border: '1px solid #c0c0c0', cursor: "pointer", height: '100%', px: 3, py: 2, borderRadius: 1 }}>Dedline</InputLabel>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    {
                        taskList.length > 0 ?
                            <Box>
                                {
                                    taskList?.map((value) => {
                                        return (
                                            <Box mb={3}>
                                                <Accordion sx={{ border: '1px solid #0000004a', py: 1, boxShadow: 'none' }}>
                                                    <AccordionSummary
                                                        expandIcon={<ExpandMoreIcon />}
                                                        aria-controls="panel1-content"
                                                        id="panel1-header"
                                                    >
                                                        {
                                                            group === "status" ? <b>{value._id.statusName}</b> : <b>{value._id.priorityName}</b>
                                                        }
                                                    </AccordionSummary>
                                                    <AccordionDetails>
                                                        <DataTable
                                                            columns={columns}
                                                            data={value?.details}
                                                            highlightOnHover
                                                            expandableRows
                                                            expandableRowDisabled={row => !row.subTasks.length > 0}
                                                            expandableRowExpanded={row => row.isExpand}
                                                            expandableRowsComponent={ExpandedComponent}
                                                            paginationComponentOptions={{
                                                                rowsPerPageText: 'Records per page:',
                                                                rangeSeparatorText: 'out of',
                                                            }}
                                                            subHeader
                                                        />
                                                    </AccordionDetails>
                                                </Accordion>
                                            </Box>
                                        )
                                    })
                                }
                            </Box> :
                            <Typography component="p" textAlign={"center"}>No Record</Typography>
                    }
                </Grid>
            </Grid>
        </div>
    )
}

export default TaskList;


