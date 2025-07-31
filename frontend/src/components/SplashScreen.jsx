import React from 'react'
import { useSelector } from 'react-redux'
import { primaryInput } from 'detect-it'
import '../assets/styles/SplashScreen.scss'

export default function SplashScreen() {
    const theme = useSelector((state) => state.appearance.theme)

    if (primaryInput === 'touch') {
        return (
            <div className="splashContainer">
                <video autoPlay muted playsInline>
                    <source
                        src={
                            theme === 'dark'
                                ? '/dark/splash-mobile-dark-403w.webm'
                                : '/light/splash-mobile-light-403w.webm'
                        }
                        type="video/webm"
                    />
                </video>
            </div>
        )
    } else {
        return (
            <div className="splashContainer">
                <video autoPlay muted playsInline>
                    <source
                        src={
                            theme === 'dark'
                                ? '/dark/splash-desktop-dark-640w.webm'
                                : '/light/splash-desktop-light-640w.webm'
                        }
                        type="video/webm"
                    />
                </video>
            </div>
        )
    }
}
