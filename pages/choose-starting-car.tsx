import type { NextPage } from 'next'
import Head from 'next/head';
import Router from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import Cookie from 'js-cookie';

import { ICar, ICarEngine, ICarManufacturer } from '../common/types/cars';
import { IToken } from '../common/types/token';
import CarCard from '../common/components/CarCard';

const Home: NextPage = () => {
    const [cars, setCars] = useState<Array<ICar>>([]);
    const [carManufacturers, setCarManufacturers] = useState<Array<ICarManufacturer>>([]);
    const [carEngines, setCarEngines] = useState<Array<ICarEngine>>([]);
    const [maxEnginePower, setMaxEnginePower] = useState(0);
    const [decodedToken, setDecodedToken] = useState<IToken | null | any>(null);

    useEffect(() => {
        setCarManufacturers(JSON.parse(window.sessionStorage.getItem("carManufacturers") ?? "[]"));
        setCarEngines(JSON.parse(window.sessionStorage.getItem("carEngines") ?? "[]"));
        const token = Cookie.get("token");
        token && setDecodedToken(jwt.decode(token) ?? null);

        axios.get(`${window.location.origin}/api/cars/starting`)
            .then(res => {
                if (res.status === 200 && res.data.code === 0) {
                    setCars(res.data.body.data);
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

    const chooseFirstCar = (carId: string) => {
        if ("data" in decodedToken) {
            axios.post(`${window.location.origin}/api/cars/buy`, { userId: decodedToken.data._id, carId, price: 0 })
                .then(res => {
                    if (res.status === 200 && res.data.code === 0) {
                        Cookie.remove("firstLogin");

                        Router.push('/');
                    }
                })
        }
    }

    return (
        <div className="container align-center">
            <Head>
                <title>Choose your first car</title>
            </Head>

            <main className="mt-6 pr-2 pl-2">
                <div className="row row-hcenter mb-4">
                    <h1 className="h1 weight-bold color-light_1">
                        Choose your first car
                    </h1>
                </div>

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
                                buttons={() =>
                                    <button className="btn btn-bg_2" onClick={() => chooseFirstCar(car._id ?? "")}>
                                        <span className="color-light_1 weight-semibold">Choose</span>
                                    </button>
                                }
                            />
                        </div>
                    )
                })}
            </main>
        </div>
    )
}

export default Home
