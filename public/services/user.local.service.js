import { storageService } from "./async-storage.service.js";
import { utilService } from "./util.service.js";

const USER_KEY = 'userDB'
_createUsers()

export const userService = {
    get,
    signup,
    login,
    logout,
    getEmptyCredentials,
    getLoggedInUser,
}

function get(userId) {
    return storageService.get(USER_KEY, userId)
}

function signup(credentials) {
    return storageService.post(USER_KEY, credentials)
        .then((user) => {
            _saveLoggedInUser(user)
            return user
        })
}

function login(credentials) {
    return storageService.query(USER_KEY)
        .then(users => {
            const user = users.find(user => user.username === credentials.username && user.password === credentials.password)
            if (!user) return Promise.reject('Login failed')
            _saveLoggedInUser(user)
            return user
        })
}

function getEmptyCredentials(fullname = '', username = '', password = '') {
    return { fullname, username, password }
}

function getLoggedInUser() {
    return JSON.parse(sessionStorage.getItem('logInUser') || null)
}

function logout() {
    sessionStorage.removeItem('logInUser')
    return Promise.resolve()
}

function _saveLoggedInUser(user) {
    sessionStorage.setItem('logInUser', JSON.stringify(user))
}

function _createUsers() {
    let users = utilService.loadFromStorage(USER_KEY)
    if (!users || !users.length) {
        users = []
        users.push(_createUser('Idan david', 'Idan1', 'idan'))
        users.push(_createUser('Dan dan', 'Dan1', 'Dan'))
        utilService.saveToStorage(USER_KEY, users)
    }
}

function _createUser(fullname, username, password) {
    const user = getEmptyCredentials(fullname, username, password)
    user._id = utilService.makeId()
    return user
}