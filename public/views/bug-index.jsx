const { Link } = ReactRouterDOM

import { bugService } from '../services/bug.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { BugList } from '../cmps/bug-list.jsx'
import { BugFilter } from '../cmps/bug-filter.jsx'
import { userService } from '../services/user.service.js'
import { LoginSignUp } from '../cmps/login-signup.jsx'

const { useState, useEffect, useRef } = React

export function BugIndex() {
    const [bugs, setBugs] = useState([])
    const numberOfPages = useRef(0)
    const [filterBy, setFilterBy] = useState(bugService.createEmptyFilter())
    const [user, setUser] = useState(userService.getLogUser())

    function onChangeLoginStatus(user) {
        setUser(user)
    }

    function onLogout() {
        userService.logout().then(()=>{setUser(null)})
    }

    useEffect(() => {
        loadBugs()
    }, [filterBy])

    function loadBugs() {
        bugService.query(filterBy).then(({pages, bugs}) => {
            console.log('pages:', pages)
            console.log(':', )
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

    return <main className='app layout'>
                <div className='user'>
                    {user && <div>
                            <h2>Hello {user.fullname}</h2>
                            <button onClick={onLogout}>Logout</button>
                            <button><Link to={`/bug/userDetails/${user._id}`}>user page</Link></button>
                        </div>}
                    {!user && <div>
                            <LoginSignUp onChangeLoginStatus={onChangeLoginStatus} />
                        </div>}
                </div>
                <BugFilter setFilter={setFilterBy} pages={numberOfPages.current}/>
                <div>
                    <button><Link to={`/bug/edit`}>Add Bug ⛐</Link></button>
                    <BugList bugs={bugs} onRemoveBug={onRemoveBug} />
                </div>
            </main>          
}
