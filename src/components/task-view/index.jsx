import React, { Fragment } from "react";

// Mui
import { Box, Button, Grid, MenuItem, Select, Typography } from "@mui/material";
import AdjustIcon from '@mui/icons-material/Adjust';
import DateRangeIcon from '@mui/icons-material/DateRange';
import EmojiFlagsIcon from '@mui/icons-material/EmojiFlags';

// ckedior
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

// react-router-dom
import { useNavigate } from "react-router-dom";

const TaskView = ({
    isUpdate,
    taskDetail,
    priorityList,
    statusList,
    handleSave,
    cancleUpdateTask,
    handleChange
}) => {
    const navigate = useNavigate();

    return (
        <Fragment>
            <Box>
                <Button variant="contained" sx={{ px: 4, display: "block", my: 2, marginLeft: 'auto' }} onClick={() => navigate(-1)}>Back</Button>
                <h1>{taskDetail.taskName}</h1>
                <Box mt={5}>
                    <Grid container spacing={3} mt={4}>
                        <Grid item xs={12} md={6} lg={4} display={"flex"} alignItems={"center"} gap={5}>
                            <Box display={"flex"} gap={1} alignItems={"center"}>
                                <AdjustIcon fontSize="14" />
                                <Typography component='span' display={"block"} fontSize={14}>Status</Typography>
                            </Box>
                            <Box>
                                <Select
                                    name="status"
                                    value={taskDetail.status}
                                    onChange={handleChange}
                                    displayEmpty
                                >
                                    {
                                        statusList.map((i, index) => {
                                            return <MenuItem key={index} value={i._id}>{i.statusName}</MenuItem>
                                        })
                                    }
                                </Select>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6} lg={4} display={"flex"} alignItems={"center"} gap={5}>
                            <Box display={"flex"} gap={1} alignItems={"center"}>
                                <DateRangeIcon fontSize="14" />
                                <Typography component='span' display={"block"} fontSize={14}>Date</Typography>
                            </Box>
                            <Box>
                                <Typography component='span'>{taskDetail.deadline}</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6} lg={4} display={"flex"} alignItems={"center"} gap={5}>
                            <Box display={"flex"} gap={1} alignItems={"center"}>
                                <EmojiFlagsIcon fontSize="14" />
                                <Typography component='span' display={"block"} fontSize={14}>Priority</Typography>
                            </Box>
                            <Box>
                                <Typography component='span'>
                                    {
                                        priorityList?.map(i => {
                                            if (i._id === taskDetail.priority)
                                                return i.priorityName
                                        })
                                    }
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
                <Box mt={5} p={4} borderRadius={1} border={'1px solid #0000001f'}>
                    <CKEditor
                        editor={ClassicEditor}
                        data={taskDetail.description}
                    />
                </Box>
                {
                    isUpdate ?
                        <Box display={"flex"} gap={2} mt={5} pt={5}>
                            <Button variant="contained" sx={{ px: 4 }} onClick={handleSave}>Save</Button>
                            <Button variant="contained" color="error" sx={{ px: 3 }} onClick={() => cancleUpdateTask()}>Cancel</Button>
                        </Box>
                        : null
                }
            </Box>
        </Fragment>
    )
}

export default TaskView;