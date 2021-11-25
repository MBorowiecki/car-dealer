import eventEmitter from '../eventsEmitter';
import mongoose from 'mongoose';

import { ICarManufacturer, IYearlyStat } from './types';
import { ICar, ICarEngine } from '../../common/types/cars';
import CarManufacturerModel from '../database/models/carManufacturer';
import EngineModel from '../database/models/engine';
import CarModel from '../database/models/car';
import metadata from '../config/metadata';

let instantiatedCarManufacturers: Array<ICarManufacturer> = [];
const inGameMonthDuration = metadata.yearDuration / 12;
let currentYear = 0;
let currentMonth = 0;
let timeToNextYear = 0;
let prevMonthTime = metadata.dateCreated.getTime();
let nextMonthTime = metadata.dateCreated.getTime() + inGameMonthDuration;

const initialize = async () => {
    currentYear = Math.floor((Date.now() - metadata.dateCreated.getTime()) / metadata.yearDuration);
    timeToNextYear = Math.abs(Date.now() - (metadata.dateCreated.getTime() + ((currentYear + 1) * metadata.yearDuration)));
    currentMonth = Math.floor((Date.now() - metadata.dateCreated.getTime()) / inGameMonthDuration) + 1;

    while (prevMonthTime < Date.now()) {
        prevMonthTime += inGameMonthDuration;
        nextMonthTime += inGameMonthDuration;
    }

    setupCarManufacturers();
    bindEvents();
}

const setupCarManufacturers = () => {
    CarManufacturerModel.find({})
        .then((docs: Array<ICarManufacturer>) => {
            if (!docs) {
                console.log(`Error ${new Date(Date.now()).toUTCString()}: Fetching car manufacturers`);
            }

            if (docs) {
                docs.map(carManufacturer => {
                    instantiatedCarManufacturers.push(carManufacturer);
                })
            }
        })
        .then(() => {
            eventEmitter.emit('CarManufacturers:init');
        })
}

const bindEvents = () => {
    setTimeout(() => {
        currentMonth = Math.floor((Date.now() - metadata.dateCreated.getTime()) / inGameMonthDuration) + 1;
        console.log(`Month passes event - Current month: ${(currentMonth % 12)}`);
        eventEmitter.emit('GameManager:monthPasses', { currentMonth, currentYear });

        setInterval(() => {
            currentMonth = Math.floor((Date.now() - metadata.dateCreated.getTime()) / inGameMonthDuration) + 1;
            console.log(`Month passes event - Current month: ${(currentMonth % 12)}`);
            eventEmitter.emit('GameManager:monthPasses', { currentMonth, currentYear });
        }, inGameMonthDuration)
    }, (Date.now() - nextMonthTime))

    setTimeout(() => {
        currentYear = Math.floor((Date.now() - metadata.dateCreated.getTime()) / metadata.yearDuration);
        console.log(`Year passes event - Current year: ${currentYear}`);
        eventEmitter.emit('GameManager:yearPasses', { currentMonth, currentYear });

        setInterval(() => {
            currentYear = Math.floor((Date.now() - metadata.dateCreated.getTime()) / metadata.yearDuration);
            console.log(`Year passes event - Current year: ${currentYear}`);
            eventEmitter.emit('GameManager:yearPasses', { currentMonth, currentYear });
        }, metadata.yearDuration)
    }, timeToNextYear);

    eventEmitter.on('CarManufacturers:init', () => {
        console.log(`Car manufacturers initiated: ${instantiatedCarManufacturers}`);
        instantiatedCarManufacturers.map(carManufacturer => setCarManufacturerProduction(carManufacturer));
    })
}

const setCarManufacturerProduction = (carManufacturer: ICarManufacturer) => {
    let carsToDesign = 0;
    let enginesToDesign = 0;
    let yearlyStat = metadata.yearlyStats.filter(_yearlyStat => _yearlyStat.yearStart <= currentYear && _yearlyStat.yearEnd > currentYear);

    timeToNextYear = Math.abs(Date.now() - (metadata.dateCreated.getTime() + ((currentYear + 1) * metadata.yearDuration)));
    yearlyStat = metadata.yearlyStats.filter(_yearlyStat => _yearlyStat.yearStart <= currentYear && _yearlyStat.yearEnd >= currentYear);
    enginesToDesign = Math.round(((Math.random() * .7) + .3) * yearlyStat[0].enginesDesigned);
    carsToDesign = Math.round(((Math.random() * .7) + .3) * yearlyStat[0].carsDesigned);

    let engineDesignInterval = timeToNextYear / enginesToDesign;
    let carDesignInterval = timeToNextYear / carsToDesign;

    console.log(`${carManufacturer.name} - Engines to design in this year: ${enginesToDesign}`)
    console.log(`${carManufacturer.name} - Cars to design in this year: ${carsToDesign}`)
    console.log(`Time to next year: ${timeToNextYear}`);

    for (let i = 0; i < enginesToDesign; i++) {
        setTimeout(() => {
            designEngine(carManufacturer, yearlyStat[0]);
        }, engineDesignInterval * i)
    }

    for (let i = 0; i < carsToDesign; i++) {
        setTimeout(() => {
            designCar(carManufacturer, yearlyStat[0]);
        }, carDesignInterval * i)
    }

    eventEmitter.on('GameManager:yearPasses', () => {
        timeToNextYear = Math.abs(Date.now() - (metadata.dateCreated.getTime() + ((currentYear + 1) * metadata.yearDuration)));
        yearlyStat = metadata.yearlyStats.filter(_yearlyStat => _yearlyStat.yearStart <= currentYear && _yearlyStat.yearEnd >= currentYear);
        enginesToDesign = Math.round((Math.random() * (yearlyStat[0].enginesDesigned - 1) + 1));
        carsToDesign = Math.round(((Math.random() * .7) + .3) * yearlyStat[0].carsDesigned);
        engineDesignInterval = timeToNextYear / enginesToDesign;
        carDesignInterval = timeToNextYear / carsToDesign;

        console.log(`${carManufacturer.name} - Engines to design in this year: ${enginesToDesign}`)
        console.log(`${carManufacturer.name} - Cars to design in this year: ${carsToDesign}`)
        console.log(`Time to next year: ${timeToNextYear}`);

        for (let i = 0; i < enginesToDesign; i++) {
            setTimeout(() => {
                designEngine(carManufacturer, yearlyStat[0]);
            }, engineDesignInterval * i)
        }

        for (let i = 0; i < carsToDesign; i++) {
            setTimeout(() => {
                designCar(carManufacturer, yearlyStat[0]);
            }, carDesignInterval * i)
        }
    })
}

const designEngine = (carManufacturer: ICarManufacturer, yearlyStat: IYearlyStat) => {
    const fuelTypes = [
        "gas",
        "diesel"
    ]

    const manufacturerId = carManufacturer._id;
    const fuelType = fuelTypes[Math.round(Math.random() * (fuelTypes.length - 1))];
    const capacity = Math.round((Math.random() * (yearlyStat.maxEngineCapacity - 700))) + 700;
    const condition = 100;
    const power = Math.round((Math.random() * (yearlyStat.maxEnginePower - yearlyStat.minEnginePower))) + yearlyStat.minEnginePower;

    const newEngine = new EngineModel({
        manufacturerId: new mongoose.Types.ObjectId(manufacturerId),
        fuelType,
        capacity,
        condition,
        power,
        yearDesigned: currentYear,
    })

    newEngine.save((err: unknown) => {
        if (err) {
            console.log(`[[ Error ]] ${new Date(Date.now()).toUTCString()}: Saving engine - ${err}`);
        } else {
            console.log(`[[ Info ]] ${new Date(Date.now()).toUTCString()}: Created engine ${newEngine}`);
        }
    });
}

const designCar = (carManufacturer: ICarManufacturer, yearlyStat: IYearlyStat) => {
    EngineModel.find({ manufacturerId: carManufacturer._id, yearDesigned: { $gt: (currentYear - 2) } }, null, null, (err, enginesDesigned) => {
        if (err) {
            console.log(`Error ${new Date(Date.now()).toUTCString()}: Fetching engines - ${err}`);
        } else {
            const producedEngines: Array<ICarEngine> = enginesDesigned ?? [];

            if (producedEngines.length > 0) {
                CarModel.find({ manufacturerId: carManufacturer._id, discontinued: false }, null, null, (err, carsProduced) => {
                    if (err) {
                        console.log(`Error ${new Date(Date.now()).toUTCString()}: Fetching cars - ${err}`);
                    } else {
                        const carsProducedPart = carsProduced.filter((_carProduced, index) => _carProduced.model !== carsProduced[index + 1].model).length / (carsProduced.length + carManufacturer.carNamesAvailable.length);
                        EngineModel.aggregate([{ $sort: { power: -1 } }, { $limit: 1 }]).exec((err, maxEnginePowerArray) => {
                            if (err) {
                                console.log(`Error ${new Date(Date.now()).toUTCString()}: Aggregating engine - ${err}`);
                            } else {
                                if (Math.random() < carsProducedPart) {
                                    const carToUpdate = carsProduced[Math.round(Math.random() * (carsProduced.length - 1))];
                                    const engine = producedEngines[Math.round(Math.random() * (enginesDesigned.length - 1))];
                                    const productionPrice = Math.round((Math.random() * (yearlyStat.maxCarPrice * (engine.power / maxEnginePowerArray[0].power) - yearlyStat.minCarPrice)) + yearlyStat.minCarPrice);
                                    const yearProduced = currentYear;
                                    const amountToSell = Math.round(Math.random() * (yearlyStat.carsProduced - 5) + 5);
                                    const generation = carToUpdate.generation + 1;

                                    CarModel.find({ manufacturerId: carManufacturer._id, model: carToUpdate.model }, null, null, (err, carsToUpdate) => {
                                        if (err) {
                                            console.log(`Error ${new Date(Date.now()).toUTCString()}: Fetching engines - ${err}`);
                                        } else {
                                            carsToUpdate.map(_carToUpdate => {
                                                CarModel.findOneAndUpdate({ _id: _carToUpdate._id }, {
                                                    $set: {
                                                        discontinued: true
                                                    }
                                                }, null, (err, updatedCar) => {
                                                    if (err) {
                                                        console.log(`[[ Error ]] ${new Date(Date.now()).toUTCString()}: Updating car - ${err}`);
                                                    } else {
                                                        console.log(`[[ Info ]] ${new Date(Date.now()).toUTCString()}: Updated car ${carManufacturer.name} ${updatedCar.model}`);
                                                    }
                                                })
                                            })

                                            for (let i = 0; i < amountToSell; i++) {
                                                createNewCar(new mongoose.Types.ObjectId(carManufacturer._id), carToUpdate.model, 100, 100, 100, 0, new mongoose.Types.ObjectId(engine._id), productionPrice, 0, yearProduced, generation);
                                            }
                                        }
                                    })
                                } else {
                                    const model = carManufacturer.carNamesAvailable[Math.round(Math.random() * (carManufacturer.carNamesAvailable.length - 1))];
                                    const bodyCondition = 100;
                                    const suspensionCondition = 100;
                                    const interiorCondition = 100;
                                    const distanceDriven = 0;
                                    const engine = enginesDesigned[Math.round(Math.random() * (enginesDesigned.length - 1))];
                                    const productionPrice = Math.round((Math.random() * (yearlyStat.maxCarPrice - yearlyStat.minCarPrice)) + yearlyStat.minCarPrice);
                                    const ownersCount = 0;
                                    const yearProduced = currentYear;
                                    const amountToSell = Math.round(Math.random() * (yearlyStat.carsDesigned - 5) + 5);
                                    const generation = 1;

                                    for (let i = 0; i < amountToSell; i++) {
                                        createNewCar(new mongoose.Types.ObjectId(carManufacturer._id), model, bodyCondition, suspensionCondition, interiorCondition, distanceDriven, new mongoose.Types.ObjectId(engine._id), productionPrice, ownersCount, yearProduced, generation, () => {
                                            CarManufacturerModel.findOneAndUpdate({ _id: carManufacturer._id }, { $set: { carNamesAvailable: carManufacturer.carNamesAvailable.filter(name => name !== model) } }, null, (err, updatedCarManufacturer) => {
                                                if (err) {
                                                    console.log(`[[ Error ]] ${new Date(Date.now()).toUTCString()}: Saving car - ${err}`);
                                                } else {
                                                    instantiatedCarManufacturers = instantiatedCarManufacturers.filter(_carManufacturer => _carManufacturer._id === updatedCarManufacturer._id ? updatedCarManufacturer : _carManufacturer);
                                                }
                                            })
                                        })
                                    }
                                }
                            }
                        });
                    }
                })
            } else {
                console.log(`[[ Info ]] ${new Date(Date.now()).toUTCString()}: ${carManufacturer.name} - No engines designed`)
            }
        }
    })
}

const createNewCar = (
    manufacturerId: mongoose.Types.ObjectId,
    model: string,
    bodyCondition: number,
    suspensionCondition: number,
    interiorCondition: number,
    distanceDriven: number,
    engineId: mongoose.Types.ObjectId,
    productionPrice: number,
    ownersCount: number,
    yearProduced: number,
    generation: number,
    callback?: () => void
) => {
    const newCar = new CarModel({
        manufacturerId,
        model,
        bodyCondition,
        suspensionCondition,
        interiorCondition,
        distanceDriven,
        engineId,
        productionPrice,
        ownersCount,
        yearProduced,
        generation
    })

    newCar.save((err: unknown) => {
        if (err) {
            console.log(`[[ Error ]] ${new Date(Date.now()).toUTCString()}: Saving car - ${err}`);
        } else {
            console.log(`[[ Info ]] ${new Date(Date.now()).toUTCString()}: Created car ${model}`);

            callback && callback();
        }
    });
}

export default initialize;

