import React, {useState, useEffect} from 'react';

function SelectTree({sites}) {
    // a list of select boxes. each time a select box is clicked, the corresponding tree marker becomes red and the map is centered onto it
    const [ availableSites, setAvailableSites ] = useState([])
    const [ shuffledSites, setShuffledSites ] = useState([])

    // list with n slots. the nth slot is the user's answer for the nth site
    const [ selectedSites, setSelectedSites ] = useState([])
    const [resultString, setResultString ] = useState("")

    useEffect(() => {
        // let newDict = {}
        // for (let i=0; i<sites.length; i++) {
        //     if (sites[i]['species'] in newDict) {
        //         newDict[sites[i]['species']].push(sites[i])
        //     } else {
        //         newDict[sites[i]['species']] = [sites[i]]
        //     }
        // }
        // console.log('my dict: ', newDict)
        // setSiteDict(newDict)
        const shuffled = sites.map(value => ({value, sort: Math.random()}))
                                .sort((a, b) => a.sort - b.sort)
                                .map(({value}) => value)
        setAvailableSites(sites)
        setShuffledSites(shuffled)
        setSelectedSites(Array(shuffled.length).fill(""))
    }, [sites])

    const handleAnswerSelection = (e) => {
        e.preventDefault()
        const speciesName = e.target.value
        const idx = Number(e.target.name)
        const prev = selectedSites.indexOf(speciesName)

        let newSelection = [...selectedSites]

        if (prev !== -1) {
            newSelection[prev] = ""
        }
        newSelection[idx] = e.target.value
        setSelectedSites(newSelection)
    }

    const checkAnswers = () => {
        for (let i = 0; i < availableSites.length; i++) {
            if (availableSites[i] !== selectedSites[i]) {
                setResultString(`Mistake was found starting at selection ${i}`)
                return
            }
        }
        setResultString("Correct!")
    }
    return (
        <div className="split">
            <div className="select-tree">
                {shuffledSites.map((x, i) => (
                    <label key={i}>
                        {i+1}: 
                        <select name={i} value={selectedSites[i]} onChange={handleAnswerSelection}>
                            <option value={""}>{""}</option>
                            {shuffledSites.map((site, j) => (
                                <option key={j} value={site}>
                                {site}
                                </option>
                            ))}
                    </select>
                    </label>
                ))}
                <button onClick={checkAnswers}>Submit</button>
            </div>
            <div className="answer-box">
                Result: {resultString}
            </div>
        </div>
    );
}

export default SelectTree;