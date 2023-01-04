
const BASE_URL = '/api/bug/'

export const bugService = {
    query,
    getById,
    save,
    remove,
    createEmptyBug,
    createEmptyFilter
}

function query(filterBy) {
    const url = `${BASE_URL}?title=${filterBy.title}&minSeverity=${filterBy.minSeverity}&pageIdx=${filterBy.pageIdx}&labels=${filterBy.labels}&userId=${filterBy.userId}`
    return axios.get(url).then(res => res.data)
}

function getById(bugId) {
    return axios.get(BASE_URL + bugId)
    .then(res => res.data)
    .catch(err => {
        throw new Error('database failed');
    })
}

function remove(bugId) {
    return axios.delete(BASE_URL + bugId).then(res => res.data)
}

function save(bug) {
    if(bug._id) return axios.put(BASE_URL + bug._id, bug).then(res => res.data)
    return axios.post(BASE_URL, bug).then(res => res.data)
}

function createEmptyBug() {
    return {
        title: '',
        description: '',
        severity: 0,
        createdAt: ''
    }
}

function createEmptyFilter() {
    return {
        title: '',
        minSeverity: 0,
        pageIdx: 0,
        labels: '',
        userId: ''
    }
}