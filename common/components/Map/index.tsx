import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect, useState } from 'react';
import { Icon, LatLngExpression } from 'leaflet';
import { IMap, IMapPosition } from './types';

const LocationMarker = () => {
    const [position, setPosition] = useState<LatLngExpression | null>(null);
    const mapEvents = useMapEvents({
        click(ev) {
            console.log(ev.latlng);
            setPosition(ev.latlng);
            mapEvents.flyTo(ev.latlng, mapEvents.getZoom())
        },
        loading() {
            mapEvents.locate();
            console.log("dupa")
        },
        locationfound(ev) {
            setPosition(ev.latlng);
            mapEvents.flyTo(ev.latlng, mapEvents.getZoom())
        }
    })

    return position === null ? null : (
        <Marker position={position} icon={new Icon(
            {
                iconUrl: "https://lh3.googleusercontent.com/proxy/ti4eLoLdr7eLFqDilwUQGtRIi05diUcfRwO5c9Ew0EQoQhRNefG3sWGlMmsj_YeptPeqw7ddHY846vAkH5SkbisZO6jYTMChsdIHB1qC1qBP2Uoub1uW3E4bzQE8AUlbpNmHxg",
                iconSize: [30, 30],
                iconAnchor: [15, 30]
            }
        )}>
            <Popup>You are here</Popup>
        </Marker>
    )
}

const Map: React.FC<IMap> = ({
    setCoords
}) => {
    const [center, setCenter] = useState<IMapPosition | null>(null)

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((pos) => {
            setCenter({
                lat: pos.coords.latitude,
                lng: pos.coords.longitude
            })
        }, (err) => {
            setCenter({
                lat: 50,
                lng: 19
            })
        })
    }, [])

    useEffect(() => {
        center && setCoords(center.lat, center.lng);
    }, [center])

    return center === null ? (
        <div className="row row-hcenter row-vcenter mt-16">
            <div className="col-auto">
                <p className="size-xxl color-light_1">
                    Waiting for geolocation access...
                </p>
            </div>
        </div>
    ) : (
        <MapContainer center={[center.lat, center.lng]} zoom={11} scrollWheelZoom={false} style={{ height: window.innerHeight * 0.8, width: "100%" }}>
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker />
        </MapContainer>
    )
}

export default Map