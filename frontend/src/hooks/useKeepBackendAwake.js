import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setConnect } from '../redux/connectionSlice'

const useKeepBackendAwake = (intervalMinutes = 4) => {
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
            } catch (err) {
                Connection(false)
                console.log('Ping error:', err)
            }
        }

        // Initial wake-up ping
        pingBackend()

        // Set interval to keep backend awake
        const interval = setInterval(
            () => {
                pingBackend()
            },
            intervalMinutes * 60 * 1000
        )

        return () => clearInterval(interval) // Cleanup on unmount
    })
}

export default useKeepBackendAwake
