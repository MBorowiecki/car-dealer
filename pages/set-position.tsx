import type { NextPage } from 'next'
import Link from 'next/link';
import Head from 'next/head';
import Header from '../common/components/Header';
import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';
import Cookie from 'js-cookie';
import jwt from 'jsonwebtoken';
import Router from 'next/router';

const Home: NextPage = () => {
    const [position, setPosition] = useState({ lat: 0, lng: 0 })

    const Map = useMemo(() => dynamic(
        () => import('../common/components/Map'),
        {
            loading: () => <p>A map is loading</p>,
            ssr: false
        }
    ), [])

    const setGarageCoords = () => {
        const token = Cookie.get("token");
        const decodedToken = jwt.decode(token ?? "");

        if (decodedToken && position.lat !== 0 && position.lng !== 0) {
            axios.post(`${window.location.origin}/api/users/${decodedToken.data._id}`, { name: "coords", value: { latitude: position.lat, longitude: position.lng } })
                .then(res => {
                    if (res.status === 200 && res.data.code === 0) {
                        Router.push('/');
                    }
                })
        }
    }

    return (
        <div className="container align-center">
            <Head>
                <title>Home page</title>
            </Head>

            <main>
                <div className="mb-2">
                    <Map setCoords={(lat, lng) => setPosition({ lat: lat, lng: lng })} />
                </div>
                <div className="align-center">
                    <button className="btn btn-bg_2" onClick={() => setGarageCoords()}>
                        <span className="color-light_1 weight-semibold">Set garage</span>
                    </button>
                </div>
            </main>
        </div>
    )
}

export default Home
