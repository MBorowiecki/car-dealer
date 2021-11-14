import type { NextPage } from 'next'
import Link from 'next/link';
import Head from 'next/head';
import axios from 'axios';
import { useEffect, useState } from 'react';
import ProgressBar from '@ramonak/react-progress-bar';

import Header from '../common/components/Header';
import { ICar, ICarEngine, ICarManufacturer } from '../common/types/cars';

const Home: NextPage = () => {
    const [cars, setCars] = useState<Array<ICar>>([]);
    const [maxEnginePower, setMaxEnginePower] = useState(0);
    const carManufacturers: Array<ICarManufacturer> = JSON.parse(window.sessionStorage.getItem("carManufacturers") ?? "[]");
    const carEngines: Array<ICarEngine> = JSON.parse(window.sessionStorage.getItem("carEngines") ?? "[]");

    useEffect(() => {
        axios.get(`${window.location.origin}/api/cars`)
            .then(res => {
                if (res.status === 200 && res.data.code === 0) {
                    setCars(() => res.data.body.data);
                }
            })

        carEngines.map(engine => {
            if (engine.power > maxEnginePower) {
                setMaxEnginePower(engine.power);
            }
        })
    }, [])

    return (
        <div>
            <Head>
                <title>Cars</title>
            </Head>

            <Header />

            <main className="mt-14 pr-2 pl-2">
                {cars.map((car, index) => {
                    const carManufacturer = carManufacturers.filter(item => item._id ? item._id === car.manufacturerId : false)[0];
                    const carEngine = carEngines.filter(item => item._id ? item._id === car.engineId : false)[0];

                    return (
                        <div className="mb-6">
                            <div>
                                <p className="size-m weight-normal color-light_1">
                                    {carManufacturer.name}
                                </p>
                            </div>
                            <div className="mb-4">
                                <h2 className="h2 color-light_1 weight-bold">
                                    {car.model}
                                </h2>
                            </div>
                            <div className="row row-hcenter">
                                <div className="col-4 pl-1 pr-1 mb-3">
                                    <div className="mb-2">
                                        <p className="size-l color-light_2 align-center">
                                            HP
                                        </p>
                                    </div>

                                    <ProgressBar completed={carEngine.power} maxCompleted={maxEnginePower} customLabel={carEngine.power.toString()} baseBgColor="#002945" />
                                </div>
                                <div className="col-4 pl-1 pr-1 mb-3">
                                    <div className="mb-2">
                                        <p className="size-l color-light_2 align-center">
                                            BODY
                                        </p>
                                    </div>

                                    <ProgressBar completed={car.bodyCondition} maxCompleted={100} customLabel={car.bodyCondition.toString()} baseBgColor="#002945" />
                                </div>
                                <div className="col-4 pl-1 pr-1 mb-3">
                                    <div className="mb-2">
                                        <p className="size-l color-light_2 align-center">
                                            INTERIOR
                                        </p>
                                    </div>

                                    <ProgressBar completed={car.interiorCondition} maxCompleted={100} customLabel={car.interiorCondition.toString()} baseBgColor="#002945" />
                                </div>
                                <div className="col-4 pl-1 pr-1">
                                    <div className="mb-2">
                                        <p className="size-l color-light_2 align-center">
                                            SUSPENSION
                                        </p>
                                    </div>

                                    <ProgressBar completed={car.suspensionCondition} maxCompleted={100} customLabel={car.suspensionCondition.toString()} baseBgColor="#002945" />
                                </div>
                            </div>
                        </div>
                    )
                })}
            </main>
        </div>
    )
}

export default Home
