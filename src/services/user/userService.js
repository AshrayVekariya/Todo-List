import axios from '../../axios/interceptor'
import Toast from '../../components/tostify/index'

export const getAllUsers = async (payload) => {
    try {
        const res = await axios.post('/user/get/all', payload)
        return res.data.data
    } catch (err) {
        console.log(err);
    }
}

// Add User
export const createUser = (payload) => {
    const headers = {
        'Content-Type': payload.contentType,
    };
    axios.post(`/user/create`, payload.userData, { headers })
        .then(res => {
            if (!res.data.isSuccess) {
                Toast(res?.data?.message, 'error');
            } else {
                Toast(res?.data?.message, 'success');
            }
            getAllUsers()
        })
        .catch(err => console.log(err))
}

// getUserById
export const getUserById = async (id) => {
    try {
        const res = await axios.get(`/user/get/${id}`)
        return res.data.data[0]
    } catch (err) {
        console.log(err);
    }
}

// Update User
export const updateUser = (id, payload) => {
    const headers = {
        'Content-Type': payload.contentType,
    };
    axios.put(`/user/update/${id}`, payload.userData, { headers })
        .then(res => {
            if (!res.data.isSuccess) {
                Toast(res?.data?.message, 'error');
            } else {
                Toast(res?.data?.message, 'success');
            }
            getAllUsers()
        })
        .catch(err => console.log(err))
}

export const deleteUser = (id) => {
    return axios.delete(`/user/delete/${id}`)
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