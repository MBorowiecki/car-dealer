import type { NextPage } from 'next'
import Head from 'next/head';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookie from 'js-cookie';
import jwt from 'jsonwebtoken';
import ProgressBar from '@ramonak/react-progress-bar';

import Header from '../common/components/Header';
import { ICar, ICarEngine, ICarManufacturer } from '../common/types/cars';
import { IToken } from '../common/types/token';
import CarCard from '../common/components/CarCard';

const Home: NextPage = () => {
    const [cars, setCars] = useState<Array<ICar>>([]);
    const [carManufacturers, setCarManufacturers] = useState<Array<ICarManufacturer>>([]);
    const [carEngines, setCarEngines] = useState<Array<ICarEngine>>([]);
    const [decodedToken, setDecodedToken] = useState<IToken | null | any>(null);
    const [maxEnginePower, setMaxEnginePower] = useState(0);

    useEffect(() => {
        setCarManufacturers(JSON.parse(window.sessionStorage.getItem("carManufacturers") ?? "[]"));
        setCarEngines(JSON.parse(window.sessionStorage.getItem("carEngines") ?? "[]"));
        const token = Cookie.get("token");
        token && setDecodedToken(jwt.decode(token) ?? null);
    }, [])

    useEffect(() => {
        decodedToken && "data" in decodedToken && axios.get(`${window.location.origin}/api/users/garage/${decodedToken.data._id}`)
            .then(res => {
                if (res.status === 200 && res.data.code === 0) {
                    const carIds = res.data.body.data;
                    setCars([]);

                    carIds.map((carId: { carId: string }) => {
                        axios.get(`${window.location.origin}/api/cars/${carId.carId}`)
                            .then(res => {
                                if (res.status === 200 && res.data.code === 0) {
                                    setCars((currentCars) => [...currentCars, res.data.body.data]);
                                }
                            })
                    })
                }
            })
    }, [decodedToken])

    useEffect(() => {
        carEngines?.map(engine => {
            if (engine.power > maxEnginePower) {
                setMaxEnginePower(engine.power);
            }
        })
    }, [carEngines])

    return (
        <div className="container">
            <Head>
                <title>Garage</title>
            </Head>

            <Header />

            <main className="pt-14 pr-2 pl-2">
                {cars.map((car, index) => {
                    const carManufacturer = carManufacturers?.filter(item => item._id ? item._id === car.manufacturerId : false)[0];
                    const carEngine = carEngines?.filter(item => item._id ? item._id === car.engineId : false)[0];

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
                })}
            </main>
        </div>
    )
}

export default Home
