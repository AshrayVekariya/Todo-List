import React, { Fragment, useEffect, useState } from "react";

// Mui
import { Box, Grid, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Typography } from "@mui/material";
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// react-data-table-component
import DataTable from "react-data-table-component";

// Jwt-decode
import { jwtDecode } from "jwt-decode";

// Components and CSS
import { getAllTask } from "../../services/task/taskService";
import { useNavigate } from "react-router-dom";

const UserTaskList = () => {
    const navigate = useNavigate();
    const [taskList, setTaskList] = useState([]);
    const [group, setGroup] = useState("status");
    const [expand, setExpand] = useState("collapse")

    useEffect(() => {
        getTask();
    }, [group, expand])

    const getTask = async () => {
        const token = localStorage.getItem('accessToken');
        const decoded = jwtDecode(token);
        const response = await getAllTask({ id: decoded.id, group: group, expand: expand });
        setTaskList(response)
    }

    const handleTask = (id) => {
        navigate(`/myTask/${id}`)
    }

    const columns = [
        {
            name: 'Task',
            selector: row => row.taskName,
            sortable: true,
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
            sortable: true,
        },
        {
            name: 'Assign User',
            selector: row => `${row.userDetail.firstName} ${row.userDetail.lastName}`
        },
        {
            name: 'Action',
            cell: (row) => (
                <Box display={"flex"} gap={2}>
                    <Typography component="span" onClick={() => handleTask(row._id)}>
                        <AutoStoriesIcon color="primary" sx={{ cursor: "pointer" }} />
                    </Typography>
                </Box>
            )
        }
    ]

    const ExpandedComponent = ({ data }) => {
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
                                        <Typography component="span" onClick={() => navigate(`/myTask/subTask/${row._id}`)}>
                                            <AutoStoriesIcon color="primary" sx={{ cursor: "pointer" }} />
                                        </Typography>
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
        <Fragment>
            <Grid container spacing={3} p={3}>
                <Grid item xs={12} mb={1}>
                    <Grid container justifyContent={"space-between"} alignItems={"center"}>
                        <Grid>
                            <h2>User Task List</h2>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} mb={6}>
                    <Grid container spacing={3} display={"flex"} justifyContent="end">
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
                    </Grid>
                </Grid>
                <Grid item xs={12}>
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
                    </Box>
                </Grid>
            </Grid>
        </Fragment>
    )
}

export default UserTaskList;