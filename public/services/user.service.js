import { bugService } from "./bug.service.js"

const BASE_URL = '/api/user/'

export const userService = {
    get,
    signup,
    login,
    logout,
    getLogUser,
    getEmptyCredentials,
    getUserBug
}

function getUserBug(filter) {
    return bugService.query(filter)
    .then(bugs => {
        filter.userId = ''
        console.log('bugs:', bugs)
        return bugs
    })
}

function get(userId) {
    return axios.get(BASE_URL + userId).then(res => res.data)
}

function login(credentials) {
    console.log('credentials:', credentials)
    return axios.post(BASE_URL + 'login', credentials)
        .then(res => res.data)
        .then((user) => {
            _saveLogUser(user)
            return user
        })
}

function signup(credentials) {
    return axios.post(BASE_URL + 'signup', credentials)
        .then(res => res.data)
        .then((user) => {
            _saveLogUser(user)
            return user
        })
}

function logout() {
    return axios.post(BASE_URL + 'logout')
        .then(() => {
            sessionStorage.removeItem('logUser')
        })
}

function getEmptyCredentials(fullname = '', username = '', password = '') {
    return { fullname, username, password }
}

function _saveLogUser(user) {
    sessionStorage.setItem('logUser', JSON.stringify(user))
}

function getLogUser() {
    return JSON.parse(sessionStorage.getItem('logUser') || null)
}