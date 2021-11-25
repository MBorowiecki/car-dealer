import { NextPage } from "next";
import { ICar, ICarEngine, ICarManufacturer } from "../../types/cars";

export interface ICarCard {
    carManufacturer: ICarManufacturer,
    car: ICar,
    carEngine: ICarEngine,
    maxEnginePower: number,
    buttons?: NextPage
}