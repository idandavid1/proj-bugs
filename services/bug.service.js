const fs = require('fs')
const PAGE_SIZE = 3
var bugs = require('../data/bugs.json')

module.exports = {
    query,
    get,
    remove,
    save
}

function query(filterBy) {
    let filterBug = bugs
    console.log('BfilterBy:', filterBy)
    if (filterBy.title) {
      const regex = new RegExp(filterBy.title, 'i')
      filterBug = filterBug.filter(bug => regex.test(bug.title))
    }
    if (filterBy.minSeverity) {
        console.log(' +filterBy.minSeverity:',  +filterBy.minSeverity)
        filterBug = filterBug.filter(bug => bug.severity >= +filterBy.minSeverity)
        console.log('filterBug:', filterBug)
    }
    if(filterBy.labels){
        const labels = filterBy.labels.split(', ')
        filterBug = filterBug.filter(bug => bug.labels.some(label => labels.includes(label)))
    }
    if(filterBy.userId){
        filterBug = filterBug.filter(bug => bug.creator._id === filterBy.userId)
    }
    const pages = Math.ceil(filterBug.length / PAGE_SIZE)
    const startIdx = filterBy.pageIdx * PAGE_SIZE
    filterBug = filterBug.slice(startIdx, PAGE_SIZE + startIdx)

    return Promise.resolve({pages, bugs: filterBug})
}

function get(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    return Promise.resolve(bug)
}

function remove(bugId, logUser) {
    idx = bugs.findIndex(bug => bug._id !== bugId)
    if(idx === -1) return Promise.reject('can not find bug')
    if(logUser.fullname !== 'Admin'){
        if (bugs[idx].creator._id !== logUser._id) return Promise.reject('Not your bug')
    }
    bugs.splice(idx, 1)
    return _writeBugsToFile().then(() => bugs)
}

function save(bug, logUser) {
    if(bug._id) {
        const idx = bugs.findIndex(currBug => bug._id === currBug._id)
        if(idx === -1) return Promise.reject('can not find bug')
        if(logUser.fullname !== 'Admin'){
            if (bugs[idx].creator._id !== logUser._id) return Promise.reject('Not your bug')
        } 
        bugs[idx] = bug
    } else {
        bug._id = _makeId()
        const { _id, fullname } = logUser
        bug.creator = {_id, fullname}
        bugs.push(bug)
    }
    
    return _writeBugsToFile().then(() => bug)
}

function _writeBugsToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(bugs, null, 2)
        fs.writeFile('data/bugs.json', data, (err) => {
            if (err) return reject(err)
            resolve()
        })
    })
}

function _makeId(length = 5) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}