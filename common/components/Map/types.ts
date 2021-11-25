export interface IMapPosition {
    lat: number,
    lng: number
}

export interface IMap {
    setCoords(lat: number, lng: number): void
}