const fs = require('fs')

const Cryptr = require('cryptr')
const cryptr = new Cryptr('user')

var users = require('../data/users.json')

module.exports = {
    query,
    get,
    remove,
    login,
    signup,
    getLoginToken,
    validateToken
}

function query() {
    return Promise.resolve(users)
}

function get(userId) {
    const user = users.find(user => user._id === userId)
    if (!user) return Promise.reject('User not found')
    return Promise.resolve(user)
}

function remove(userId) {
    const idx = users.findIndex(user => user._id === userId)
    if (idx === -1) return Promise.reject('User not found')
    users.splice(idx, 1)
}

function signup({ fullname, username, password }) {
    const newUser = {_id: _makeId(), fullname, username, password}
    users.push(newUser)
    return _writeUsersToFile().then(() => newUser)
}

function login(credentials) {
    const user = users.find(user => user.username === credentials.username && user.password === credentials.password)
    if (!user) return Promise.reject('Login failed')
    return Promise.resolve(user)
}

function validateToken(loginToken) {
    try {
        const json = cryptr.decrypt(loginToken)
        const logUser = JSON.parse(json)
        return logUser
    } catch (err) {
        console.log('Invalid login token')
    }
    return null
}

function getLoginToken(user) {
    return cryptr.encrypt(JSON.stringify(user))
}

function _makeId(length = 5) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

function _writeUsersToFile() {
    return new Promise((res, rej) => {
        const data = JSON.stringify(users, null, 2)
        fs.writeFile('data/users.json', data, (err) => {
            if (err) return rej(err)
            res()
        })
    })
}