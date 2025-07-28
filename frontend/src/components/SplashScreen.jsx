import React from 'react'
import { useSelector } from 'react-redux'
import { primaryInput } from 'detect-it'
import '../assets/styles/SplashScreen.scss'
import splashDesktopDark640w from '../assets/images/dark/splash-desktop-dark-640w.webm'
import splashMobileDark403w from '../assets/images/dark/splash-mobile-dark-403w.webm'
import splashMobileDark300w from '../assets/images/dark/splash-mobile-dark-300w.webm'
import splashDesktopLight640w from '../assets/images/light/splash-desktop-light-640w.webm'
import splashMobileLight403w from '../assets/images/light/splash-mobile-light-403w.webm'
import splashMobileLight300w from '../assets/images/light/splash-mobile-light-300w.webm'

export default function SplashScreen() {
    const theme = useSelector((state) => state.appearance.theme)

    if (primaryInput === 'touch') {
        return (
            <div className="splashContainer">
                <video
                    src={
                        window.screen.width < 400
                            ? theme === 'dark'
                                ? splashMobileDark300w
                                : splashMobileLight300w
                            : theme === 'dark'
                              ? splashMobileDark403w
                              : splashMobileLight403w
                    }
                    autoPlay
                    muted
                    playsInline
                ></video>
            </div>
        )
    } else {
        return (
            <div className="splashContainer">
                <video
                    src={
                        theme === 'dark'
                            ? splashDesktopDark640w
                            : splashDesktopLight640w
                    }
                    autoPlay
                    muted
                    playsInline
                ></video>
            </div>
        )
    }
}
