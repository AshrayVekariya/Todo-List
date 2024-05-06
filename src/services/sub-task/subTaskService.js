import { jwtDecode } from 'jwt-decode'
import axios from '../../axios/interceptor'
import Toast from '../../components/tostify/index'

export const getAllSubTask = async (payload) => {
    try {
        const res = await axios.post('/subTask/get/all', { id: payload })
        return res.data.data
    } catch (err) {
        console.log(err);
    }
}

export const createSubTask = (payload) => {
    return axios.post(`/subTask/add`, payload)
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

export const getSubTaskById = async (id) => {
    try {
        const res = await axios.get(`/subTask/get/${id}`)
        return res.data.data[0]
    } catch (err) {
        console.log(err);
    }
}

export const updateSubTask = (id, payload) => {
    const token = localStorage.getItem('accessToken');
    const decoded = jwtDecode(token);
    return axios.put(`/subTask/update/${id}`, { ...payload, loggedUser: decoded.id })
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

export const deleteSubTask = (id) => {
    return axios.delete(`/subTask/delete/${id}`)
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
