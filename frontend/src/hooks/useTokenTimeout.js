import { useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setToken } from '../redux/authSlice'
import { TokenRefresh, TokenObtain } from '../services/api'

const useTokenTimeout = () => {
    const signedIn = useSelector((state) => state.auth.signedIn)
    const refresh = useSelector((state) => state.auth.refreshToken)
    const timeOut = useRef(null)

    const dispatch = useDispatch()

    const newToken = (newToken) => {
        dispatch(setToken(newToken))
    }

    async function TokenGet() {
        const response = await TokenRefresh(refresh)
        newToken(response['access'])
    }

    useEffect(() => {
        if (signedIn) {
            const startInterval = () => {
                timeOut.current = setInterval(async () => {
                    await TokenGet()
                }, 180000)
            }
            startInterval()

            return () => {
                if (timeOut.current) {
                    clearInterval(timeOut.current)
                }
            }
        } else {
            if (timeOut.current) {
                clearInterval(timeOut.current)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [signedIn, refresh])
}

export default useTokenTimeout
