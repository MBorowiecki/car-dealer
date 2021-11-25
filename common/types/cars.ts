export interface ICar {
    _id?: string,
    manufacturerId: string,
    model: string,
    bodyCondition: number,
    suspensionCondition: number,
    interiorCondition: number,
    distanceDriven: number,
    engineId: string,
    productionPrice: number,
    ownersCount: number,
    yearProduced: number,
    discontinued: boolean,
    generation: number,
}

export interface ICarManufacturer {
    _id?: string,
    name: string
}

export interface ICarEngine {
    _id?: string,
    manufacturerId: string,
    fuelType: string,
    capacity: string,
    condition: number,
    power: number,
    yearDesigned: number
}