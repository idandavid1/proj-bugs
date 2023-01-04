const { useState, useEffect } = React
const { Link, useParams } = ReactRouterDOM

import { bugService } from '../services/bug.service.js'
import { showErrorMsg } from '../services/event-bus.service.js'


export function BugDetails() {

    const [bug, setBug] = useState(null)
    const { bugId } = useParams()

    useEffect(() => {
        bugService.getById(bugId)
            .then(bug => {
                setBug(bug)
            })
            .catch(err => {
                console.log('err:', err)
                showErrorMsg('Cannot load bug')
            })
    }, [])

    if (!bug) return <h1>loadings....</h1>
    return bug && <section className='bug-details'>
        <div className='details-content'>
            <h3>Bug Details 🐛</h3>
            <h4>{bug.title}</h4>
            <p>description: <span>{bug.description}</span></p>
            <p>Severity: <span>{bug.severity}</span></p>
            <button><Link to="/bug">Back to List</Link></button>
        </div>
        
    </section>

}

