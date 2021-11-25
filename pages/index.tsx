import type { NextPage } from 'next'
import Link from 'next/link';
import Head from 'next/head';
import Header from '../common/components/Header';
import { useEffect } from 'react';

const Home: NextPage = () => {

    return (
        <div className="container align-center">
            <Head>
                <title>Home page</title>
            </Head>

            <Header />

            <main>

            </main>
        </div>
    )
}

export default Home
