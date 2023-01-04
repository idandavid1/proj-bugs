const { Link } = ReactRouterDOM

import { BugPreview } from "./bug-preview.jsx"

export function BugList({ bugs, onRemoveBug }) {
    return <ul className="bug-list">
        {bugs.map(bug =>
            <li className="bug-preview" key={bug._id}>
                <BugPreview bug={bug} />
                <div className="btn-container">
                    <button onClick={() => { onRemoveBug(bug._id) }}>Remove</button>
                    <button><Link to={`/bug/edit/${bug._id}`}>Edit</Link></button>
                    <button><Link to={`/bug/${bug._id}`}>Details</Link></button>
                </div>
            </li>)}
    </ul>
}