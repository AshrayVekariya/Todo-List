import axios from '../../axios/interceptor';

export const getAllStatusHistory = (payload) => {
    return axios.post(`/statusHistory/get/all`, payload)
        .then(res => {
            return res.data.data
        })
        .catch(err => console.log(err))
}