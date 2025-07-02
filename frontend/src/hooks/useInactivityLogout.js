import { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { signOut } from '../redux/authSlice'

const useInactivityLogout = () => {
    const signedIn = useSelector((state) => state.auth.signedIn)
    const timerRef = useRef(null)

    const dispatch = useDispatch()

    const handleSignOut = () => {
        dispatch(signOut())
    }

    const resetTimer = () => {
        if (timerRef.current) clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => {
            if (signedIn) {
                handleSignOut()
            }
        }, 600000)
    }

    useEffect(() => {
        const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart']

        const handleActivity = () => resetTimer()

        events.forEach((event) =>
            window.addEventListener(event, handleActivity)
        )

        resetTimer()

        return () => {
            events.forEach((event) =>
                window.removeEventListener(event, handleActivity)
            )
            if (timerRef.current) clearTimeout(timerRef.current)
        }
    })
}

export default useInactivityLogout
