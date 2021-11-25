import type { NextPage } from 'next'
import Head from 'next/head';
import axios from 'axios';
import { useEffect, useState } from 'react';

import Header from '../common/components/Header';
import { ICar, ICarEngine, ICarManufacturer } from '../common/types/cars';
import CarCard from '../common/components/CarCard';

const Home: NextPage = () => {
    const [cars, setCars] = useState<Array<ICar>>([]);
    const [maxEnginePower, setMaxEnginePower] = useState(0);
    const [carManufacturers, setCarManufacturers] = useState<Array<ICarManufacturer> | null>(null);
    const [carEngines, setCarEngines] = useState<Array<ICarEngine> | null>(null);

    useEffect(() => {
        setCarManufacturers(JSON.parse(window.sessionStorage.getItem("carManufacturers") ?? "[]"));
        setCarEngines(JSON.parse(window.sessionStorage.getItem("carEngines") ?? "[]"));

        axios.get(`${window.location.origin}/api/cars`)
            .then(res => {
                if (res.status === 200 && res.data.code === 0) {
                    setCars(() => res.data.body.data);
                }
            })
    }, [])

    useEffect(() => {
        carEngines?.map(engine => {
            if (engine.power > maxEnginePower) {
                setMaxEnginePower(engine.power);
            }
        })
    }, [carEngines])

    return (
        <div className="container align-center">
            <Head>
                <title>Cars</title>
            </Head>

            <Header />

            <main className="mt-14 pr-2 pl-2">
                {cars.map((car, index) => {
                    const carManufacturer = carManufacturers?.filter(item => item._id ? item._id === car.manufacturerId : false)[0];
                    const carEngine = carEngines?.filter(item => item._id ? item._id === car.engineId : false)[0];

                    if (carEngine && carManufacturer) {
                        return (
                            <div className="mb-6">
                                <CarCard
                                    car={car}
                                    carEngine={carEngine}
                                    carManufacturer={carManufacturer}
                                    maxEnginePower={maxEnginePower}
                                    key={index}
                                />
                            </div>
                        )
                    }
                })}
            </main>
        </div>
    )
}

export default Home
