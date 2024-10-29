import React, {useState, useEffect} from 'react';

function SelectTree({sites}) {
    // a list of select boxes. each time a select box is clicked, the corresponding tree marker becomes red and the map is centered onto it
    // sites not selected yet
    const [ availableSites, setAvailableSites ] = useState([])

    // list with n slots. the nth slot is the user's answer for the nth site
    const [ selectedSites, setSelectedSites ] = useState([])

    // dictionary with n entries with key:"species name" value:[list of site objects], used to display the groups
    const [ siteDict, setSiteDict ] = useState({})


    // IDEAS: somehow map selectedSites array to options' selected attribute. if undefined, would be unselected (0, false)
    // then have a map from selection box index to answer key index

    useEffect(() => {
        let newDict = {}
        for (let i=0; i<sites.length; i++) {
            if (sites[i]['species'] in newDict) {
                newDict[sites[i]['species']].push(sites[i])
            } else {
                newDict[sites[i]['species']] = [sites[i]]
            }
        }
        console.log('my dict: ', newDict)
        setSiteDict(newDict)

        const shuffled = Object.keys(newDict).map(value => ({value, sort: Math.random()}))
                                .sort((a, b) => a.sort - b.sort)
                                .map(({value}) => value)
        setAvailableSites(shuffled)
        setSelectedSites(Array(shuffled.length))
    }, [sites])

    const handleAnswerSelection = (e) => {
        e.preventDefault()
        const index = availableSites.indexOf(e.target.value)
        console.log('index: ', index)
        if (index !== -1) {
            const oldIndex = selectedSites.indexOf(e.target.value)
            if (oldIndex !== -1){
                // if site was already selected, remove it
                console.log('site already selected: ', oldIndex, selectedSites[oldIndex])
                console.log(selectedSites)
                setSelectedSites(selectedSites.toSpliced(oldIndex, 1, undefined))
                document.getElementById(index).selectedIndex=0
                console.log(document.getElementById(index))
            }
            else {
                setSelectedSites(selectedSites.toSpliced(index, 0, e.target.value))
            }
        }
        
    }
    return (
        <div className="select-tree">
            {availableSites.map((x, i) => (
                <label>
                    {x}
                    <select id={i} onChange={handleAnswerSelection}>
                        <option value={i}>{i}</option>
                        {Object.keys(siteDict).map((site, j) => (
                            <option key={j} value={site}>
                            {site}
                            </option>
                        ))}
                </select>
                </label>
            ))}
        </div>
    );
}

export default SelectTree;