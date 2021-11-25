import type { NextPage } from 'next'
import Head from 'next/head';
import axios from 'axios';
import { useState } from 'react';
import Cookie from 'js-cookie';
import Router from 'next/router';
import jwt from 'jsonwebtoken';

const Home: NextPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");

    const login = () => {
        axios.post(`${window.location.origin}/api/users/login`, { email, password })
            .then(res => {
                if (res.status === 200 && res.data.code === 0) {
                    Cookie.set("token", res.data.body.token)
                    const tokenDecoded = jwt.decode(res.data.body.token);
                    if (tokenDecoded) {
                        if (!tokenDecoded.data.coords) {
                            Router.push('/set-position');
                        } else {
                            Router.push('/');
                        }
                    }
                }
            })
    }

    const register = () => {
        axios.post(`${window.location.origin}/api/users/register`, { username, email, password })
            .then(res => {
                if (res.status === 200 && res.data.code === 0) {
                    const tokenDecoded = jwt.decode(res.data.body.token);

                    Cookie.set("token", res.data.body.token)
                    Cookie.set("firstLogin", "true");

                    if (tokenDecoded) {
                        Router.push('/set-position');
                    }
                }
            })
    }

    return (
        <div className="container align-center">
            <Head>
                <title>Login page</title>
            </Head>

            <main className="mt-16">
                <form onSubmit={(ev) => { ev.preventDefault(); login() }}>
                    <div className="row row-hcenter row-vcenter">
                        <div className="col-10 align-center mb-4">
                            <input
                                className="input full-width"
                                placeholder="Username"
                                type="text"
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>

                        <div className="col-10 align-center mb-4">
                            <input
                                className="input full-width"
                                placeholder="E-mail"
                                type="email"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="col-10 align-center mb-4">
                            <input
                                className="input full-width"
                                placeholder="Password"
                                type="password"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="col-5 align-center mr-2">
                            <button className="btn btn-bg_2 full-width" onClick={() => login()}>
                                <span className="color-light_1 weight-semibold">Login</span>
                            </button>
                        </div>

                        <div className="col-5 align-center">
                            <button className="btn btn-clear_2 full-width" onClick={() => register()}>
                                <span className="color-light_1 weight-semibold">Register</span>
                            </button>
                        </div>
                    </div>
                </form>
            </main>
        </div>
    )
}

export default Home
