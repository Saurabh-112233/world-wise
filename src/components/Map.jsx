import {  useNavigate} from 'react-router-dom';
import styles from './Map.module.css';
import { MapContainer,Marker,TileLayer,Popup, useMap, useMapEvent } from 'react-leaflet';
import { useEffect, useState } from 'react';
import { useCity } from '../context/CitiesContext';
import {useGeolocation} from '../hooks/useGeolocations'
import Button from './Button';
import { UseUrlPosition } from '../hooks/useUrlPosition';
export default function Map() {
  const [mapPosition,setMapPosition] = useState([40,0])
  const {cities} = useCity();
  const {isLoading:isLoadingPosition,position:geolocationPosition,getPosition} = useGeolocation();
  const [mapLat,mapLng] = UseUrlPosition();
  useEffect(function(){
    if(mapLat && mapLng) setMapPosition([mapLat,mapLng])
  },[mapLat,mapLng]);

  useEffect(function(){
    if(geolocationPosition) setMapPosition([geolocationPosition.lat,geolocationPosition.lng])
  },[geolocationPosition])
  return (
    <div className={styles.mapContainer}>
      {!geolocationPosition && <Button type='position' onClick={getPosition}>
        {isLoadingPosition ? "Loading..." : "Use your position"}
      </Button>}
      <MapContainer center={mapPosition} zoom={6} scrollWheelZoom={true} className={styles.map}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
      />
      {
        cities?.map((city)=>(          
          <Marker position={[city.position.lat,city.position.lng]} key={city.id}>
            <Popup>
              <span>{city.cityName  }</span>
            </Popup>
          </Marker>
        ))
      }

      <ChangeCenter position={mapPosition} />
      <DetectClick />
      </MapContainer>
    </div>
  )
}

function ChangeCenter({position}){
  const map = useMap();
  map.setView(position);
  return null;
}

function DetectClick(){
  const navigate = useNavigate();

  useMapEvent({
    click:(e)=>{
      const {lat,lng} = e.latlng;
      navigate(`form?lat=${lat}&lng=${lng}`);
    }
  })
}