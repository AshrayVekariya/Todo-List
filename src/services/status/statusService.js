import Toast from '../../components/tostify';
import axios from '../../axios/interceptor';

export const getAllStatus = async (payload) => {
    try {
        const res = await axios.post('/status/get/all', payload)
        return res.data.data
    } catch (err) {
        console.log(err);
    }
}

export const createStatus = (payload) => {
    return axios.post(`/status/add`, payload)
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

export const getStatusById = async (id) => {
    try {
        const res = await axios.get(`/status/get/${id}`)
        return res.data.data[0]
    } catch (err) {
        console.log(err);
    }
}

export const updateStatus = (id, payload) => {
    return axios.put(`/status/update/${id}`, payload)
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

export const deleteStatus = (id) => {
    return axios.delete(`/status/delete/${id}`)
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