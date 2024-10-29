import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom'
import axios from 'axios';

function SearchBuilding({initialBuilding}) {
    const [buildings, setBuildings] = useState([])
    const [selectedBuilding, setSelectedBuilding] = useState(initialBuilding)

    const navigate = useNavigate()

    useEffect(() => {
        axios.get('/api/buildings')
            .then(response => {
                setBuildings(response.data.buildingList);
                if (selectedBuilding === undefined || selectedBuilding === "") {
                    setSelectedBuilding(response.data.buildingList[0])
                }
            })
            .catch(error => {
                console.error('Error fetching building list:', error);
            })       
    }, [selectedBuilding])
        
    const handleChange = (e) => {
        setSelectedBuilding(e.target.value)
    }

    const generateMap = async (e) => {
        e.preventDefault()
        navigate(`/map/${selectedBuilding}`)
    }
    return (
        <div>
            <form onSubmit={generateMap}>
                <select name="Building" id="buildings" onChange={handleChange} value={selectedBuilding}>
                    {buildings.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
                <button type="submit">Generate</button>
            </form> 
        </div>
    )
}

export default SearchBuilding;
