export interface ICarManufacturer {
    _id: string,
    name: string,
    carNamesAvailable: Array<string>
}

export interface IYearlyStat {
    yearStart: number,
    yearEnd: number,
    carsDesigned: number,
    enginesDesigned: number,
    maxEngineCapacity: number,
    maxEnginePower: number,
    minEnginePower: number,
    carsProduced: number,
    minCarPrice: number,
    maxCarPrice: number,
}