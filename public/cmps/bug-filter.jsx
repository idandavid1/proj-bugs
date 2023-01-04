const { useState, useEffect } = React

import { bugService } from "../services/bug.service.js"

export function BugFilter({ setFilter, pages }) {
    const [filterByToEdit, setFilterByToEdit] = useState(bugService.createEmptyFilter())
    console.log('filterByToEdit:', filterByToEdit)
    useEffect(() => {
        setFilter(filterByToEdit)
    }, [filterByToEdit])

    function handleChange({ target }) {
        let { value, name: field, type } = target
        value = (type === 'number') ? +value : value
        setFilterByToEdit((prevFilter) => {
            return { ...prevFilter, [field]: value ,pageIdx: 0}
        })
    }

    function onSubmitFilter(ev) {
        ev.preventDefault()
        setFilter(filterByToEdit)
    }

    function onChangePage(diff) {
        setFilter((prevFilter) => {
            if(prevFilter.pageIdx <= 0 && diff === -1) return prevFilter
            if(prevFilter.pageIdx >= pages - 1 && diff === 1) return prevFilter
            console.log('prevFilter:', prevFilter)
            console.log('pages:', pages)
            return { ...prevFilter, pageIdx: (prevFilter.pageIdx + diff) }
        })
    }



    return <section className="bug-filter">
        <h2>Filter</h2>
        <form onSubmit={onSubmitFilter}>
            <div>
                <label htmlFor="title">bug title:</label>
                <input type="text"
                    id="title"
                    name="title"
                    placeholder="By title"
                    value={filterByToEdit.title}
                    onChange={handleChange} />
            </div>
            <div>
                <label htmlFor="minSeverity">min-Severity:</label>
                <input type="number"
                    id="minSeverity"
                    max={10}
                    min={0}
                    name="minSeverity"
                    placeholder="By minSeverity"
                    value={filterByToEdit.minSeverity}
                    onChange={handleChange} />
            </div>
            <div>
                <label htmlFor="labels">labels:</label>
                <input type="text"
                    id="labels"
                    name="labels"
                    placeholder="By labels"
                    value={filterByToEdit.labels}
                    onChange={handleChange} />
            </div>
            <button>Filter bugs</button>
        </form>
        <div>
            <button onClick={() => onChangePage(-1)}>prev</button>
            <button onClick={() => onChangePage(1)}>next</button>
        </div>
    </section>
}