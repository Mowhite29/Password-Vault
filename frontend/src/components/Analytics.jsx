import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { initGA, logPageView } from '../ga'

const Analytics = () => {
    const location = useLocation()

    useEffect(() => {
        initGA()
    }, [])

    useEffect(() => {
        logPageView(location.pathname + location.search)
    }, [location])

    return null
}

export default Analytics
