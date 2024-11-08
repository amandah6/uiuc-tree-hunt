import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet'
import { DivIcon } from 'leaflet'
import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom'
import axios from 'axios';
import SearchBuilding from '../components/SearchBuilding'
import SelectTree from "../components/SelectTree";

function BuildingMap() {
  const { buildingName } = useParams()

  const [ loading, setLoading ] = useState(true)
  const [ sites, setSites ] = useState([])
  //const [ uniqSpecies, setUniqSpecies ] = useState([])
  const [ sitesDict, setSitesDict ] = useState({})
  const [ center, setCenter ] = useState([])
  const [ bounds, setBounds ] = useState([])
  const [ resultString, setResultString ] = useState("")
  const [ selectedMarker, setSelectedMarker ] = useState(0)

  const NumIcon = (number) => {
    const output = new DivIcon({
      html: `<div style="background-color:${(selectedMarker === number) ? "gray" : "white"};border-radius:10px">${number}</div>`,
      iconSize: [20, 20],
      className: number
    })

    return output
  }

  useEffect(() => {
    axios.get(`/api/building/${buildingName}`)
      .then(response => {
        const _sites = response.data.data
        // create a dictionary mapping unique species name to a list of indices of "sites" that are that species
        // {species_name: [indices of sites]}
        const _sitesDict = {}
        for (let i = 0; i < _sites.length; i++) {
          if (_sites[i].species in _sitesDict){
            _sitesDict[_sites[i].species].push(i)
          } else {
            _sitesDict[_sites[i].species] = [i]
          }
        }
        
        // update states
        setSitesDict(_sitesDict)
        setSites(response.data.data)
        setCenter(response.data.center)
        setBounds(response.data.bounds)
        setLoading(false)

      })
      .catch(error => (
        console.error('Error getting sites', error)
      ))
  }, [buildingName])

  const getResult = (res) => {
    setResultString(res)
  }

  const selectMarker = (e, i) => {
    const idx = e.target.options.icon.options.className
    setSelectedMarker(idx)
  }

  const MapController = ({center, bounds}) => {
    const map = useMap()
    useMapEvents({
      click: () => { setSelectedMarker(0) }
    })
    
    useEffect(() => {
      map.fitBounds(bounds)
      map.setView(center)
      
    }, [map, center, bounds])

    const handleRecenter = () => {
      map.setView(center)
    }
    
    return (
      <div className="leaflet-bottom leaflet-left">
        <div className="leaflet-control leaflet-bar">
          <button onClick={handleRecenter}>Re-center</button>
        </div>
      </div>
    )
  }

  if (loading) {
    return "Map loading ..."
  } else {
    return (
      <div className="row">
        <div className="map col-8">
          <SearchBuilding initialBuilding={buildingName}></SearchBuilding>
          <br />
          <br />
          <MapContainer center={center} fitBounds={bounds} minZoom={16} style={{height: '500px'}}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maxZoom={20}
              maxNativeZoom={18}
            />
              {Object.entries(sitesDict).map(([species, idxList], i) => (
                idxList.map((j) => (
                  <Marker key={sites[j]["site_id"]} position={[sites[j]['latitude'], sites[j]['longitude']]} icon={NumIcon(i+1)} eventHandlers={{click: selectMarker}}>
                  {/* <Popup>
                    {i+1}: {species}
                  </Popup> */}
                </Marker>
                ))
              ))}
          <MapController center={center} bounds={bounds}/>
          </MapContainer>
          <p>{resultString}</p>
        </div>

        <div className="col-4">
          <SelectTree sites={Object.keys(sitesDict)} sendResult={getResult}></SelectTree>
        </div>
      </div>
    );
  }
}

export default BuildingMap;
