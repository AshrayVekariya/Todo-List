import axios from '../../axios/interceptor'
import Toast from '../../components/tostify'

export const createReplyComment = (payload) => {
    return axios.post(`/reply/add`, payload)
        .then(res => {
            return res.data
        })
        .catch(err => console.log(err))
}

export const getReplyById = async (id) => {
    try {
        const res = await axios.get(`/reply/get/${id}`)
        return res.data?.data[0]
    } catch (err) {
        console.log(err);
    }
}

export const updateReply = (id, payload) => {
    console.log(payload);
    return axios.put(`/reply/update/${id}`, payload)
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

export const deleteReply = (id) => {
    return axios.delete(`/reply/delete/${id}`)
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