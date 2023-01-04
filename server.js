const express = require('express')
const cookieParser = require('cookie-parser')
const bugService = require('./services/bug.service.js')
const userService = require('./services/user.service.js')

const app = express()
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

app.get('/api/bug', (req, res) => {
    bugService.query(req.query).then((bugs) => {
        res.send(bugs)
    })
})

app.post('/api/bug', (req, res) => {
    const logUser = userService.validateToken(req.cookies.loginToken)
    if (!logUser) return res.status(401).send('Cannot create car')

    bugService.save(req.body, logUser)
    .then((bug) => res.send(bug))
    .catch(err => {
        console.log('Error:', err)
        res.status(400).send('Cannot create car')
    })
})

app.put('/api/bug/:bugId', (req, res) => {
    const logUser = userService.validateToken(req.cookies.loginToken)
    if (!logUser) return res.status(401).send('Cannot update car')

    console.log('req.body:', req.body)
    bugService.save(req.body, logUser)
    .then((bug) => res.send(bug))
    .catch(err => {
        console.log('Error:', err)
        res.status(400).send('Cannot update car')
    })
})

app.get('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
    if(!_cookies(bugId, res, req)) return res.status(401).send('Wait for a bit')
    bugService.get(bugId)
    .then((bug) => res.send(bug))
    .catch(err => {
        console.log('Error:', err)
        res.status(400).send('Cannot update car')
    })
})

app.delete('/api/bug/:bugId', (req, res) => {
    const logUser = userService.validateToken(req.cookies.loginToken)
    if (!logUser) return res.status(401).send('Cannot delete car')

    const { bugId } = req.params
    bugService.remove(bugId, logUser)
    .then((bugs) => res.send(bugs))
    .catch(err => {
        console.log('Error:', err)
        res.status(400).send('Cannot delete car')
    })
})

function _cookies(bugId, res, req) {
    var visitedBugs = req.cookies.visitedBugs || []
    if(!visitedBugs.includes(bugId)) visitedBugs.push(bugId)
    
    if(visitedBugs.length > 3) return false
    console.log('visitedBugs:', visitedBugs)
    res.cookie('visitedBugs', visitedBugs, {maxAge: 1000 * 50})
    return true
}





// use

app.get('/api/user', (req, res) => {
    userService.query(req.query)
    .then((bugs) => {
        res.send(bugs)
    })
    .catch(err => {
        console.log('Error:', err)
        res.status(400).send('Cannot get users')
    })
})

app.get('/api/user/:userId', (req, res) => {
    const { userId } = req.params
    userService.get(userId)
    .then((user) => {
        res.send(user)
    })
    .catch(err => {
        console.log('Error:', err)
        res.status(400).send('Cannot get user')
    })
})

app.post('/api/user/login', (req, res) => {
    userService.login(req.body)
        .then((user) => {
            const loginToken = userService.getLoginToken(user)
            res.cookie('loginToken', loginToken)
            res.send(user)
        })
        .catch(err => {
            console.log('Error:', err)
            res.status(400).send('Cannot login')
        })
})

app.post('/api/user/signup', (req, res) => {
    userService.signup(req.body)
        .then((user) => {
            const loginToken = userService.getLoginToken(user)
            res.cookie('loginToken', loginToken)
            res.send(user)
        })
        .catch(err => {
            console.log('Error:', err)
            res.status(400).send('Cannot signup')
        })
})

app.post('/api/user/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('Logged out')
})

app.listen(3030, () => console.log('Server listening on port 3030!'))
