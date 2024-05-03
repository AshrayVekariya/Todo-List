import axios from '../../axios/interceptor';

export const getAllInbox = (payload) => {
    return axios.post(`/inbox/get/all`, payload)
        .then(res => {
            return res.data.data
        })
        .catch(err => console.log(err))
}

export const updateInbox = (id) => {
    return axios.put(`/inbox/update/${id}`)
        .then(res => {
            return res.data
        })
        .catch(err => console.log(err))
}

export const deleteInbox = (id) => {
    return axios.delete(`/inbox/delete/${id}`)
        .then(res => {
            return res.data
        })
        .catch(err => console.log(err))
}