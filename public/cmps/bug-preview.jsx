

export function BugPreview({bug}) {

    return <article>
        {console.log('bug:', bug)}
        <h4>create by: {bug.creator.fullname}</h4>
        <h4>{bug.title}</h4>
        <h1>🐛</h1>
        <div>description: {bug.description} </div>
        <p>Severity: <span>{bug.severity}</span></p>
    </article>
}