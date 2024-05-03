import axios from '../../axios/interceptor'
import Toast from '../../components/tostify'

export const createComment = (payload) => {
    return axios.post(`/comment/add`, payload)
        .then(res => {
            return res.data
        })
        .catch(err => console.log(err))
}

export const getCommentById = async (id) => {
    try {
        const res = await axios.get(`/comment/get/${id}`)
        return res.data.data[0]
    } catch (err) {
        console.log(err);
    }
}

export const updateComment = (id, payload) => {
    return axios.put(`/comment/update/${id}`, payload)
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

export const deleteComment = (id) => {
    return axios.delete(`/comment/delete/${id}`)
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