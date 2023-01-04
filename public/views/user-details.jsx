const { Link, useParams } = ReactRouterDOM

import { bugService } from '../services/bug.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { BugList } from '../cmps/bug-list.jsx'
import { BugFilter } from '../cmps/bug-filter.jsx'
import { userService } from '../services/user.service.js'

const { useState, useEffect, useRef } = React

export function UserDetails() {
    const [bugs, setBugs] = useState([])
    const numberOfPages = useRef(0)
    const [filterBy, setFilterBy] = useState(bugService.createEmptyFilter())
    const params = useParams()
    const [user, setUser] = useState(userService.getLogUser())

    useEffect(() => {
        if(params.userId) {
            userService.get(params.userId).then(setUser)
        }
    },[])

    useEffect(() => {
        loadBugs()
    }, [filterBy])

    function loadBugs() {
        filterBy.userId = user._id
        console.log('filterBy:', filterBy)
        userService.getUserBug(filterBy).then(({pages, bugs}) => {
            numberOfPages.current = pages
            setBugs(bugs)
        })
    }

    function onRemoveBug(bugId) {
        bugService.remove(bugId)
            .then(() => {
                console.log('Deleted Succesfully!')
                const bugsToUpdate = bugs.filter(bug => bug._id !== bugId)
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug removed')
            })
            .catch(err => {
                console.log('Error from onRemoveBug ->', err)
                showErrorMsg('Cannot remove bug')
            })
        }
        if(!user)   return <div>Loading...</div>
    return <main className='app layout'>
                <h4>Hello {user.fullname}</h4>
                <button><Link to={`/bug`}>go back</Link></button>
                <BugFilter setFilter={setFilterBy} pages={numberOfPages.current}/>
                <div>
                    <button><Link to={`/bug/edit`}>Add Bug ⛐</Link></button>
                    <BugList bugs={bugs} onRemoveBug={onRemoveBug} />
                </div>
            </main>          
}
