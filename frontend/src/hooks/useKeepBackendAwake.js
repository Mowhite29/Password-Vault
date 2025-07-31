import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setConnect } from '../redux/connectionSlice'

const useKeepBackendAwake = () => {
    const dispatch = useDispatch()

    const Connection = (updown) => {
        dispatch(setConnect(updown))
    }

    useEffect(() => {
        const pingUrl = import.meta.env.VITE_BACKEND_URL + '/ping/'
        if (!pingUrl) return

        const pingBackend = async () => {
            try {
                const response = await fetch(pingUrl)
                if (response.ok) {
                    Connection(true)
                } else {
                    Connection(false)
                    console.log('Ping failed with status:', response.status)
                }
            } catch (error) {
                Connection(false)
                console.log('Ping error:', error)
            }
        }

        pingBackend()

        const interval = setInterval(() => {
            pingBackend()
        }, 300000)

        return () => clearInterval(interval)
    })
}

export default useKeepBackendAwake
