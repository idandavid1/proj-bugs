const { useEffect, useState } = React
const { useParams, useNavigate} = ReactRouterDOM

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { bugService } from "../services/bug.service.js"

export function BugEdit() {
    const [bug, setBug] = useState(bugService.createEmptyBug())
    const navigate = useNavigate()
    const params = useParams()
    useEffect(()=>{
        if(params.bugId) {
            bugService.getById(params.bugId).then(bug => {
                setBug(bug)
            })
        }
    },[])


    function handleChange({ target }) {
        let { value, type, name: field } = target
        value = type === 'number' ? +value : value
        setBug((prevBug) => ({ ...prevBug, [field]: value }))
    }

    function onSubmitBug(ev) {
        ev.preventDefault()
        bug.createAt = Date.now()
        console.log('bug:', bug)
        bugService.save(bug).then((bug) => {
            if(!bug._id) showSuccessMsg('Bug added')
            else showSuccessMsg('Bug updated')
            navigate('/bug')
        })
        .catch(err => {
            if(!bug._id) {
                console.log('Error from onAddBug ->', err)
                showErrorMsg('Cannot add bug')
            } else {
                console.log('Error from onEditBug ->', err)
                showErrorMsg('Cannot update bug')
            }
        })
    }
    return<section className="bug-edit layout">
        <h2>Add bug</h2>
        <form onSubmit={onSubmitBug}>
            <div>
                <label htmlFor="title">Bug title:</label>
                <input type="text"
                id="title"
                name="title"
                placeholder="Enter title"
                value={bug.title}
                onChange={handleChange}/>
            </div>
            <div>
                <div><label htmlFor="description">description: </label></div>
                <textarea type="text"
                id="description"
                name="description"
                placeholder="Enter description"
                value={bug.description}
                onChange={handleChange}/>
            </div>
            <div>
                <label htmlFor="severity">severity: </label>
                <input type="number"
                max={10}
                min={0}
                id="severity"
                name="severity"
                placeholder="Enter severity"
                value={bug.severity}
                onChange={handleChange}/>
            </div>
            <button>Save bug</button>
        </form>
    </section>
}