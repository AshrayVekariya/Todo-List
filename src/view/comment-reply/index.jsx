import React, { Fragment, useEffect, useState } from "react";

// Mui
import { Box, Button, TextField, Typography } from "@mui/material";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

// Jwt decode
import { jwtDecode } from "jwt-decode";

// Components and CSS
import { getCommentById } from "../../services/comment/commentService";
import { createReplyComment, deleteReply, getReplyById, updateReply } from "../../services/reply-comment/replyCommentService";

const CommentReply = ({ setIsReply, replyCommentId }) => {
    const [commentDetail, setCommentDetail] = useState([]);
    const [replyDetail, setReplyDetail] = useState({
        comment: ''
    });
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        if (replyCommentId) {
            getComment()
        }
    }, [replyCommentId])

    useEffect(() => {
        getReplyComment()
    }, [editId])

    const getReplyComment = async () => {
        const response = await getReplyById(editId);
        setReplyDetail(response)
    }

    const getComment = async () => {
        const response = await getCommentById(replyCommentId);
        setCommentDetail(response)
    }

    const backComment = () => {
        setIsReply(false)
    }

    const handleCommentChange = (e) => {
        setReplyDetail({ ...replyDetail, [e.target.name]: e.target.value })
    }

    const handleCommentSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('accessToken');
        const decoded = jwtDecode(token);

        if (editId !== null) {
            delete replyDetail._id
            await updateReply(editId, replyDetail)
            setEditId(null)
        } else {
            await createReplyComment({ ...replyDetail, commenter: decoded.id, commentId: replyCommentId })
        }
        await getComment()
        setReplyDetail({ comment: '' })
    }

    const editReplyById = (id) => {
        setEditId(id)
    }

    const deleteReplyById = async (id) => {
        const response = await deleteReply(id)
        if (response.isSuccess) {
            await getComment();
        }
    }

    return (
        <Fragment>
            <Box className="comment-box-size">
                <Box mb={1}>
                    <Typography component="span" sx={{ cursor: "pointer" }} onClick={backComment}><KeyboardBackspaceIcon /></Typography>
                </Box>
                <Typography component='h3' mb={2} fontWeight={600}>Activity</Typography>
                <Typography mb={2} component={"div"} bgcolor='#fff' p={2} border={'1px solid #0000001f'} borderRadius={1}>
                    <Box display={"flex"} justifyContent={"space-between"}>
                        <Typography component="p" fontSize={12}>{commentDetail.userDetail?.firstName}</Typography>
                        <Typography component="p" fontSize={12}>{new Date(commentDetail.date).toLocaleString()}</Typography>
                    </Box>
                    <Typography component="p" mt={2}>{commentDetail.comment}</Typography>
                </Typography>
                {
                    commentDetail.allReply?.map((comment, index) => {
                        return (
                            <Typography mb={2} component={"div"} bgcolor='#fff' p={2} border={'1px solid #0000001f'} borderRadius={1}>
                                <Box display={"flex"} justifyContent={"space-between"}>
                                    <Typography component="p" fontSize={12}>{comment.userDetail?.firstName}</Typography>
                                    <Typography component="p" fontSize={12}>{new Date(comment.date).toLocaleString()}</Typography>
                                </Box>
                                <Typography component="p" mt={2}>{comment.comment}</Typography>
                                <Box display={"flex"} justifyContent={"end"}>
                                    <Box display={"flex"} gap={2}>
                                        <Typography component="span" onClick={() => editReplyById(comment._id)}>
                                            <EditIcon sx={{ cursor: "pointer", fontSize: 18, color: "gray" }} />
                                        </Typography>
                                        <Typography component="span" onClick={() => deleteReplyById(comment._id)}>
                                            <DeleteIcon sx={{ cursor: "pointer", fontSize: 18, color: "gray" }} />
                                        </Typography>
                                    </Box>
                                </Box>
                            </Typography>
                        )
                    })
                }
            </Box>
            <form autoComplete="off" onSubmit={handleCommentSubmit}>
                <Box display={"flex"} gap={2} pt={3}>
                    <TextField
                        variant="outlined"
                        name="comment"
                        value={replyDetail?.comment}
                        placeholder="Write a comment..."
                        onChange={handleCommentChange}
                        fullWidth
                        sx={{
                            "& .MuiOutlinedInput-input": {
                                padding: '9.5px 14px'
                            }
                        }}
                    />
                    <Button variant="contained" type="submit" disabled={replyDetail?.comment === ""} sx={{ px: 4 }}>Save</Button>
                </Box>
            </form>
        </Fragment>
    )
}

export default CommentReply