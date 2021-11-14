import '../styles/index.scss'
import type { AppProps } from 'next/app'
import { useEffect } from 'react'
import axios from 'axios'

function MyApp({ Component, pageProps }: AppProps) {
    useEffect(() => {
        axios.get(`${window.location.origin}/api/car-manufacturers`)
            .then(res => {
                if (res.status === 200 && res.data.code === 0) {
                    window.sessionStorage.setItem("carManufacturers", JSON.stringify(res.data.body.data));
                }
            })

        axios.get(`${window.location.origin}/api/engines`)
            .then(res => {
                if (res.status === 200 && res.data.code === 0) {
                    window.sessionStorage.setItem("carEngines", JSON.stringify(res.data.body.data));
                }
            })
    }, [])

    return <Component {...pageProps} />
}

export default MyApp
