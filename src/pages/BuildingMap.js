import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
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
  const [ center, setCenter ] = useState([])
  const [ bounds, setBounds ] = useState([])

  const NumIcon = (number) => {
    const output = new DivIcon({
      html: number,
      iconSize: [20, 20]
    })

    return output
  }

  useEffect(() => {
    axios.get(`/api/building/${buildingName}`)
      .then(response => {
        setSites(response.data.data)
        setCenter(response.data.center)
        setBounds(response.data.bounds)
        setLoading(false)

      })
      .catch(error => (
        console.error('Error getting sites', error)
      ))
  }, [buildingName, setSites])


  const MapController = ({center, bounds}) => {
    const map = useMap()
    
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
      <div className="map">
        <SearchBuilding initialBuilding={buildingName}></SearchBuilding>
        <MapContainer center={center} fitBounds={bounds} minZoom={16} style={{height: '500px'}}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={20}
            maxNativeZoom={18}
          />
            {sites.map((site, i) => (
              <Marker key={site['id']} position={[site['latitude'], site['longitude']]} icon={NumIcon(i)}>
                <Popup>
                  {i}: {site['species']}
                </Popup>
              </Marker>
            ))}
        <MapController center={center} bounds={bounds}/>
        </MapContainer>
        <SelectTree sites={sites}></SelectTree>
      </div>
    );
  }
}

export default BuildingMap;
