import axios from '../../axios/interceptor'
import Toast from '../../components/tostify/index'

export const getAllTask = async (payload) => {
    try {
        const res = await axios.post('/taskList/get/all', payload)
        return res.data.data
    } catch (err) {
        console.log(err);
    }
}

export const createTask = async (payload, setTaskId) => {
    await axios.post(`/taskList/add`, payload)
        .then(res => {
            if (!res.data.isSuccess) {
                Toast(res?.data?.message, 'error');
            } else {
                console.log(res);
                setTaskId(res?.data?.id)
                Toast(res?.data?.message, 'success');
            }
            getAllTask()
        })
        .catch(err => console.log(err))
}

export const getTaskById = async (id) => {
    try {
        const res = await axios.get(`/taskList/get/${id}`)
        return res.data.data[0]
    } catch (err) {
        console.log(err);
    }
}

export const updateTask = (id, payload) => {
    axios.put(`/taskList/update/${id}`, payload)
        .then(res => {
            if (!res.data.isSuccess) {
                Toast(res?.data?.message, 'error');
            } else {
                Toast(res?.data?.message, 'success');
            }
            getAllTask()
        })
        .catch(err => console.log(err))
}

export const deleteTask = (id) => {
    return axios.delete(`/taskList/delete/${id}`)
        .then(res => {
            if (!res.data.isSuccess) {
                Toast(res?.data?.message, 'error');
            } else {
                Toast(res?.data?.message, 'success');
            }
            return res.data
        })
        .catch(err => console.log(err))
}