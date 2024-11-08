import React, {useState, useEffect} from 'react';

function SelectTree({sites, sendResult}) {
    // a list of select boxes. each time a select box is clicked, the corresponding tree marker becomes red and the map is centered onto it
    const [ availableSites, setAvailableSites ] = useState([])
    const [ shuffledSites, setShuffledSites ] = useState([])

    // list with n slots. the nth slot is the user's answer for the nth site
    const [ selectedSites, setSelectedSites ] = useState([])

    useEffect(() => {
        // shuffle sites so that the options list is not in the same order as the answers
        const shuffled = sites.map(value => ({value, sort: Math.random()}))
                                .sort((a, b) => a.sort - b.sort)
                                .map(({value}) => value)

        // sites in correct order (i.e. corrected answer of selectedSites[i] is availableSites[i])
        setAvailableSites(sites)
        setShuffledSites(shuffled)
        setSelectedSites(Array(shuffled.length).fill(""))
    }, [sites])

    const handleAnswerSelection = (e) => {
        e.preventDefault()
        const speciesName = e.target.value
        
        // index of answer box we are updating
        const idx = Number(e.target.name)

        // index of box with the same answer/species, if it exists
        const prev = selectedSites.indexOf(speciesName)

        // copy old selection into new object
        let newSelection = [...selectedSites]

        // if there was a previous selected answer, clear it
        if (prev !== -1) {
            newSelection[prev] = ""
        }
        
        // update list of selections with new selection
        newSelection[idx] = e.target.value
        setSelectedSites(newSelection)
    }

    const checkAnswers = () => {
        // compare availableSites with selectedSites
        for (let i = 0; i < availableSites.length; i++) {
            if (availableSites[i] !== selectedSites[i]) {
                sendResult(`Mistake was found starting at selection ${i}`)
                return
            }
        }
        sendResult("Correct!")
    }
    return (
        <div>
            <div className="select-tree">
                {shuffledSites.map((x, i) => (
                    <div className="tree-box" key={i}>
                    <label >
                        {i+1}
                        <br />
                        <select name={i} value={selectedSites[i]} onChange={handleAnswerSelection}>
                            <option value={""}>{""}</option>
                            {shuffledSites.map((site, j) => (
                                <option key={j} value={site}>
                                {site}
                                </option>
                            ))}
                    </select>
                    </label>
                    <br />
                    <br />
                    </div>
                ))}
                <button onClick={checkAnswers}>Submit</button>
            </div>
        </div>
    );
}

export default SelectTree;