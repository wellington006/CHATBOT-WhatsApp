
const axios = require('axios')
const baseApiUrl = 'http://localhost:500'

// API Queries

const getUserData = async (idUser) => {
    return axios.get(`${baseApiUrl}/user/${idUser}`)
        .then(res => {
            return res.data
        })
        .catch(err => console.log(err))
}

const addNewUser = async (user) => {
    let newUser = {
        ...user,
        step: 0,
        order: [],
        address: ''
    }

    axios.post(`${baseApiUrl}/user`, newUser)
        .then(res => {
            return res.data
        })
        .catch(err => console.log(err))

    return newUser
}

const userIsRegistred = async (idUser) => {
    return await axios.get(`${baseApiUrl}/user/aready-registred/${idUser}`)
        .then(res => res.data)
        .catch(err => console.log(err))
}

const updateUser = async (user) => {
    return await axios.put(`${baseApiUrl}/user`, user) //Id goes in user
        .then(_ => console.log('User updated!'))
        .catch(err => console.log(err))
}

const getMenu = async () => {
    return await axios.get(`${baseApiUrl}/menu`)
        .then(res => res.data)
        .catch(err => console.log(err))
}

/* const saveAddress = (address, idUser) => {// Atualizar diretamente user.js reinicia a aplicação
    users[idUser].address = address
    return users
} */


module.exports = { getUserData, addNewUser, userIsRegistred, updateUser, getMenu }