import React from 'react'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setScreen } from './redux/authSlice'
import { setWaiver } from './redux/waiverSlice'
import { setTheme } from './redux/appearanceSlice'
import SplashScreen from './components/SplashScreen'
import HeaderBar from './components/HeaderBar'
import MenuBar from './components/MenuBar'
import SignIn from './components/SignIn'
import Vault from './components/Vault'
import Account from './components/Account'
import About from './components/About'
import useKeepBackendAwake from './hooks/useKeepBackendAwake'
import useInactivityLogout from './hooks/useInactivityLogout'
import useTokenTimeout from './hooks/useTokenTimeout'
import './assets/styles/Home.scss'
import githubDark from './assets/images/dark/Github_Logo_White.png'
import githubLight from './assets/images/light/Github_Logo.png'

export default function Home() {
    const screen = useSelector((state) => state.auth.screen)
    const waiver = useSelector((state) => state.waiver.agreed)
    const theme = useSelector((state) => state.appearance.theme)
    const [isLoading, setIsLoading] = useState(true)

    const dispatch = useDispatch()

    useKeepBackendAwake()
    useInactivityLogout()
    useTokenTimeout()

    const handleScreenChange = (newScreen) => {
        dispatch(setScreen(newScreen))
    }

    const handleWaiver = () => {
        dispatch(setWaiver(true))
    }

    const handleTheme = (newTheme) => {
        dispatch(setTheme(newTheme))
    }

    useEffect(() => {
        if (theme === '') {
            const colorScheme = window.matchMedia(
                '(prefers-color-scheme: dark)'
            )
            if (colorScheme.matches) {
                handleTheme('dark')
            } else {
                handleTheme('light')
            }
        }
    })

    useEffect(() => {
        document.documentElement.style.setProperty('--theme', theme)
    }, [theme])

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 4000)

        return () => clearTimeout(timer)
    }, [])

    const now = new Date()
    const hour = now.getUTCHours()
    let nextHour
    hour >= 3
        ? hour >= 6
            ? hour >= 9
                ? hour >= 12
                    ? hour >= 15
                        ? hour >= 18
                            ? hour >= 21
                                ? (nextHour = 24)
                                : (nextHour = 21)
                            : (nextHour = 18)
                        : (nextHour = 15)
                    : (nextHour = 12)
                : (nextHour = 9)
            : (nextHour = 6)
        : (nextHour = 3)

    const minute = now.getUTCMinutes()

    const minutesRemaining = 60 - minute

    minutesRemaining > 0 ? (nextHour -= 1) : null

    const HourRemaining = nextHour - hour

    if (isLoading) {
        return <SplashScreen />
    }

    return (
        <>
            {waiver === false && (
                <div className="warningContainer">
                    <div className="warningBanner">
                        <h1>Password Vault</h1>
                        <h2>by Moses White</h2>
                        <a
                            href="https://github.com/Mowhite29/Password-Vault"
                            target="_blank"
                        >
                            <img
                                src={
                                    theme === 'dark' ? githubDark : githubLight
                                }
                            />
                        </a>
                        <h3>
                            This application has been created as part of a
                            personal software development portfolio. It is
                            intended exclusively for demonstration purposes to
                            showcase the technical skills of the developer in
                            building secure, full-stack applications.
                        </h3>
                        <h3>
                            This application is{' '}
                            <b>not intended for production use</b>. Do not
                            enter, upload, or store any real, sensitive, or
                            personal information such as actual passwords,
                            authentication credentials, or personally
                            identifiable information (PII).
                        </h3>
                        <h3>
                            While best practices have been followed where
                            possible, no guarantees are made regarding the
                            security, functionality, or reliability of this
                            application.
                        </h3>
                        <h3>
                            The developer disclaims all liability for any loss,
                            damage, or legal consequences that may arise from
                            the use or misuse of this application, including
                            (but not limited to) data leaks, unauthorized
                            access, or malfunction.
                        </h3>
                        <h3>
                            This software is provided "as is", without warranty
                            of any kind, express or implied, including but not
                            limited to warranties of merchantability, fitness
                            for a particular purpose, and non-infringement.
                        </h3>
                        <h3>
                            All features of the application are fully
                            functional, but the database is automatically wiped
                            every 3 hours, at which time user accounts and all
                            stored data will be lost.
                        </h3>
                        <h3>
                            Next database wipe in {HourRemaining}h:
                            {minutesRemaining}m
                        </h3>
                        <h3>
                            If you agree with the terms outlined, please select
                            "I Agree" to continue to the application.
                        </h3>
                        <button onClick={() => handleWaiver()}>I Agree</button>
                    </div>
                </div>
            )}
            <HeaderBar />
            <MenuBar />
            {screen === 'home' && (
                <div className="home">
                    <div className="homeContainer">
                        <h1>Secure Your Digital Life with Ease</h1>
                        <h2>
                            Keep your passwords safe, organized, and
                            accessible—anytime, anywhere.
                        </h2>
                        <h3>Your Passwords. Protected. Simplified. Trusted.</h3>
                        <button onClick={() => handleScreenChange('signin')}>
                            Get started now
                        </button>
                    </div>
                </div>
            )}
            {screen === 'signin' && <SignIn />}
            {screen === 'vault' && <Vault />}
            {screen === 'account' && <Account />}
            {screen === 'about' && <About />}
        </>
    )
}
