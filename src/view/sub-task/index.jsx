import React, { Fragment, useEffect, useState } from "react";

// Mui
import { Box, Grid, Typography } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// react-data-table-component
import DataTable from "react-data-table-component";

// Component and css
import { getAllSubTask } from "../../services/sub-task/subTaskService";
import TaskModal from "../../components/task-modal/TaskModal";

const SubTasks = ({ open, setOpen, parentId }) => {
    const [subTaskList, setSubTaskList] = useState([]);
    const [subTaskId, setSubTaskId] = useState(null)
    const [deleteSubTask, setDeleteSubTask] = useState(null)

    useEffect(() => {
        getTask();
    }, [])

    const getTask = async () => {
        const response = await getAllSubTask(parentId);
        setSubTaskList(response)
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
            selector: row => `${row.userId.firstName} ${row.userId.lastName}`
        },
        {
            name: 'Action',
            cell: (row) => (
                <Box display={"flex"} gap={2}>
                    <Typography component="span" onClick={() => setSubTaskId(row._id)}>
                        <EditIcon sx={{ cursor: "pointer", color: "green" }} />
                    </Typography>
                    <Typography component="span" onClick={() => setDeleteSubTask(row._id)}>
                        <DeleteIcon sx={{ cursor: "pointer", color: "red" }} />
                    </Typography>
                </Box>
            )
        }
    ]

    return (
        <Fragment>

            {/* Sub Task */}
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

            {/* Status list table */}
            {
                subTaskList.length > 0 ?
                    <Grid container spacing={3} p={3}>
                        <Grid item>
                            <h4>Sub Task List</h4>
                        </Grid>
                        <Grid item xs={12}>
                            <DataTable
                                columns={columns}
                                data={subTaskList}
                                highlightOnHover
                                pagination
                                paginationPerPage={5}
                                paginationRowsPerPageOptions={[5, 10, 15, 20]}
                                paginationComponentOptions={{
                                    rowsPerPageText: 'Records per page:',
                                    rangeSeparatorText: 'out of',
                                }}
                            />
                        </Grid>
                    </Grid> : null
            }
        </Fragment>
    )
}

export default SubTasks;