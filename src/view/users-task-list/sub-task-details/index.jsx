import React, { Fragment, useEffect, useState } from "react";

// Mui
import { Badge, Box, Button, Grid, TextField, Typography } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ReplyIcon from '@mui/icons-material/Reply';

// react-router-dom
import { useParams } from "react-router-dom";

// Components and CSS
import { getAllStatus } from "../../../services/status/statusService";
import { getAllPriority } from "../../../services/priority/priorityService";
import { getSubTaskById, updateSubTask } from "../../../services/sub-task/subTaskService";
import TaskView from "../../../components/task-view";
import { createComment, deleteComment, getCommentById, updateComment } from "../../../services/comment/commentService";
import CommentReply from "../../comment-reply";
import { getAllStatusHistory } from "../../../services/status-history/statusHistoryService";

const UserSubTaskDetails = () => {
    const { id } = useParams();
    const [taskDetail, setTaskDetail] = useState({
        status: '',
    })
    const [commentDetail, setCommentDetail] = useState({
        comment: ''
    })
    const [priorityList, setPriorityList] = useState([]);
    const [statusList, setStatusList] = useState([]);
    const [isUpdate, setIsUpdate] = useState(false);
    const [commentId, setCommentId] = useState(null);
    const [isReply, setIsReply] = useState(false);
    const [replyCommentId, setReplyCommentId] = useState(null);
    const [statusHistory, setStatusHistory] = useState([]);

    useEffect(() => {
        getStatus();
        getPriority();
    }, [])

    useEffect(() => {
        if (id) {
            getTask();
            getstatusHistory();
        }
    }, [id, isReply])

    useEffect(() => {
        if (commentId) {
            (async () => {
                const response = await getCommentById(commentId);
                setCommentDetail(response)
            })()
        }
    }, [commentId])

    const getstatusHistory = async () => {
        const response = await getAllStatusHistory({ taskId: id });
        setStatusHistory(response)
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
        const response = await getSubTaskById(id);
        setTaskDetail(response)
    }

    const handleChange = (e) => {
        setTaskDetail({ ...taskDetail, [e.target.name]: e.target.value })
        setIsUpdate(true)
    }

    const cancleUpdateTask = () => {
        setIsUpdate(false);
        getTask();
    }

    const handleSave = async () => {
        delete taskDetail._id
        await updateSubTask(id, taskDetail);
        await getstatusHistory();
        setIsUpdate(false);
    }

    // Comment Section
    const handleCommentChange = (e) => {
        setCommentDetail({ ...commentDetail, [e.target.name]: e.target.value })
    }

    const handleCommentSubmit = async (e) => {
        e.preventDefault();

        if (commentId !== null) {
            delete commentDetail._id
            await updateComment(commentId, commentDetail)
            setCommentId(null)
        } else {
            await createComment({ ...commentDetail, commenter: taskDetail.userId, taskId: id })
        }
        await getTask();
        setCommentDetail({ comment: '' })
    }

    const editComment = (id) => {
        setCommentId(id)
    }

    const deleteCommentById = async (id) => {
        const response = await deleteComment(id)
        if (response.isSuccess) {
            await getTask();
        }
    }

    const commentReply = (id) => {
        setIsReply(true)
        setReplyCommentId(id)
    }

    return (
        <Fragment>
            <Box>
                <Grid container spacing={3}>
                    <Grid item xs={12} lg={8} xl={9} className="content">
                        <TaskView
                            isUpdate={isUpdate}
                            taskDetail={taskDetail}
                            priorityList={priorityList}
                            statusList={statusList}
                            handleSave={handleSave}
                            cancleUpdateTask={cancleUpdateTask}
                            handleChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} lg={4} xl={3}>
                        <Box className="comment-box">
                            {
                                isReply ? <CommentReply
                                    setIsReply={setIsReply}
                                    replyCommentId={replyCommentId}
                                />
                                    : <>
                                        <Box className="comment-box-size">
                                            <Typography component='h3' mb={2} fontWeight={600}>Activity</Typography>
                                            {
                                                taskDetail.comments?.map((comment, index) => {
                                                    return (
                                                        <Typography key={index} mb={2} component={"div"} bgcolor='#fff' p={2} border={'1px solid #0000001f'} borderRadius={1}>
                                                            <Box display={"flex"} justifyContent={"space-between"}>
                                                                <Typography component="p" fontSize={12}>{comment.commenter.firstName}</Typography>
                                                                <Typography component="p" fontSize={12}>{new Date(comment.date).toLocaleString()}</Typography>
                                                            </Box>
                                                            <Typography component="p" mt={2}>{comment.comment}</Typography>
                                                            <Box display={"flex"} mt={3} justifyContent={"space-between"}>
                                                                <Box>
                                                                    <Typography component="span" fontSize={12} sx={{ cursor: "pointer" }} onClick={() => commentReply(comment._id)}>
                                                                        <Badge badgeContent={comment.replies?.length} color="primary">
                                                                            <ReplyIcon sx={{ color: "gray" }} />
                                                                        </Badge>
                                                                    </Typography>
                                                                </Box>
                                                                <Box display={"flex"} gap={2}>
                                                                    <Typography component="span" onClick={() => editComment(comment._id)}>
                                                                        <EditIcon sx={{ cursor: "pointer", fontSize: 18, color: "gray" }} />
                                                                    </Typography>
                                                                    <Typography component="span" onClick={() => deleteCommentById(comment._id)}>
                                                                        <DeleteIcon sx={{ cursor: "pointer", fontSize: 18, color: "gray" }} />
                                                                    </Typography>
                                                                </Box>
                                                            </Box>
                                                        </Typography>
                                                    )
                                                })
                                            }
                                            <Box mt={2}>
                                                {
                                                    statusHistory.map((value, index) => {
                                                        return (
                                                            <Box display={"flex"} gap={2} key={index} mb={2}>
                                                                <Typography component="p" fontSize={12}>{`${value.userDetail.firstName} changed status from ${value.fromDetail.statusName} to ${value.toDetail.statusName}`}</Typography>
                                                                <Typography component="p" fontSize={12}>{new Date(value.time).toLocaleString()}</Typography>
                                                            </Box>
                                                        )
                                                    })
                                                }
                                            </Box>
                                        </Box>
                                        <form autoComplete="off" onSubmit={handleCommentSubmit}>
                                            <Box display={"flex"} gap={2} pt={3}>
                                                <TextField
                                                    variant="outlined"
                                                    name="comment"
                                                    value={commentDetail.comment}
                                                    placeholder="Write a comment..."
                                                    onChange={handleCommentChange}
                                                    fullWidth
                                                    sx={{
                                                        "& .MuiOutlinedInput-input": {
                                                            padding: '9.5px 14px'
                                                        }
                                                    }}
                                                />
                                                <Button variant="contained" type="submit" disabled={commentDetail.comment === ""} sx={{ px: 4 }}>Save</Button>
                                            </Box>
                                        </form>
                                    </>
                            }
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Fragment>
    )
}

export default UserSubTaskDetails;