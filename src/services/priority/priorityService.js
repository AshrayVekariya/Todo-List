import Toast from '../../components/tostify';
import axios from '../../axios/interceptor'

export const getAllPriority = async (payload) => {
    try {
        const res = await axios.post('/priority/get/all', payload)
        return res.data.data
    } catch (err) {
        console.log(err);
    }
}

export const createPriority = (payload) => {
    return axios.post(`/priority/add`, payload)
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

export const getPriorityById = async (id) => {
    try {
        const res = await axios.get(`/priority/get/${id}`)
        return res.data.data[0]
    } catch (err) {
        console.log(err);
    }
}


export const updatePriority = (id, payload) => {
    return axios.put(`/priority/update/${id}`, payload)
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

export const deletePriority = (id) => {
    return axios.delete(`/priority/delete/${id}`)
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