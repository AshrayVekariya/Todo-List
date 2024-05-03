import React, { Fragment, useEffect, useState } from "react";

// Mui
import { Badge, Box, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Tooltip, Typography } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';

// react-router-dom
import { useNavigate } from 'react-router-dom';

// Jwt-decode
import { jwtDecode } from "jwt-decode";

// Component and css
import { deleteInbox, getAllInbox, updateInbox } from "../../services/inbox/inboxService";
import './../../style/inbox.css';

const Inbox = () => {
    const navigate = useNavigate();
    const [Notification, setNotification] = useState([]);

    useEffect(() => {
        getInbox();
    }, [])

    const getInbox = async () => {
        const token = localStorage.getItem('accessToken');
        const decoded = jwtDecode(token);
        const response = await getAllInbox({ userId: decoded.id })
        setNotification(response)
    }

    const readMessage = async (row) => {
        await updateInbox(row._id);
        if (row.isSubTask) {
            navigate(`/myTask/subTask/${row.taskId._id}`);
        } else {
            navigate(`/myTask/${row.taskId._id}`);
        }
        await getInbox();
    }

    const deleteMessage = async (id) => {
        await deleteInbox(id);
        await getInbox();
    }

    return (
        <Fragment>
            <Box my={3}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableBody>
                            {Notification.map((row) => (
                                <TableRow
                                    key={row.name}
                                    hover
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {!row.isRead ? <Badge color="primary" variant="dot"></Badge> : null}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {row.taskId.taskName}
                                    </TableCell>
                                    <TableCell align="left" dangerouslySetInnerHTML={{ __html: row.message }}></TableCell>
                                    <TableCell align="right">{new Date(row.date).toDateString()}</TableCell>
                                    <TableCell align="right">
                                        <Box display={"flex"} gap={2} justifyContent={"end"}>
                                            <Typography component="span" onClick={() => readMessage(row)}>
                                                <Tooltip title="Read">
                                                    <AutoStoriesIcon color="primary" sx={{ cursor: "pointer" }} />
                                                </Tooltip>
                                            </Typography>
                                            <Typography component="span" onClick={() => deleteMessage(row._id)}>
                                                <Tooltip title="Delete">
                                                    <DeleteIcon color="error" sx={{ cursor: "pointer" }} />
                                                </Tooltip>
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Fragment>
    )
}

export default Inbox;