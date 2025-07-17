import React from 'react'
import { useSelector } from 'react-redux'
import { deviceType } from 'detect-it'
import '../assets/styles/SplashScreen.scss'
import splashDesktopDark from '../assets/images/dark/splashDesktop.gif'
import splashMobileDark from '../assets/images/dark/splashMobile.gif'
import splashDesktopLight from '../assets/images/light/splashDesktop.gif'
import splashMobileLight from '../assets/images/light/splashMobile.gif'

export default function SplashScreen() {
    const theme = useSelector((state) => state.appearance.theme)

    if (deviceType === 'touchOnly') {
        return (
            <div className="splashContainer">
                <img
                    src={
                        theme === 'dark' ? splashMobileDark : splashMobileLight
                    }
                ></img>
            </div>
        )
    } else {
        return (
            <div className="splashContainer">
                <img
                    src={
                        theme === 'dark'
                            ? splashDesktopDark
                            : splashDesktopLight
                    }
                ></img>
            </div>
        )
    }
}
