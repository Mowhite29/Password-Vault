import React from 'react'
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { signOut, setScreen } from '../redux/authSlice'
import { setTheme } from '../redux/appearanceSlice'
import { deviceType } from 'detect-it'

import '../assets/styles/MenuBar.scss'
import logoDark from '../assets/images/dark/logo.gif'
import logoLight from '../assets/images/light/logo.gif'
import menu from '../assets/images/dark/menu.png'
import info from '../assets/images/dark/info.png'
import loginDark from '../assets/images/dark/login.gif'
import loginLight from '../assets/images/light/login.gif'
import logout from '../assets/images/dark/logout.png'
import user from '../assets/images/dark/user.png'
import mode from '../assets/images/dark/mode.png'
import home from '../assets/images/dark/home.png'

export default function MenuBar() {
    const [open, setOpen] = useState(false)
    const signedIn = useSelector((state) => state.auth.signedIn)
    const screen = useSelector((state) => state.auth.screen)
    const theme = useSelector((state) => state.appearance.theme)
    const dispatch = useDispatch()

    function OpenMenu() {
        setOpen(() => !open)
    }

    const handleSignOut = () => {
        dispatch(signOut())
    }

    const handleScreenChange = (newScreen) => {
        dispatch(setScreen(newScreen))
        setOpen(false)
    }

    const handleTheme = (newTheme) => {
        dispatch(setTheme(newTheme))
    }

    function themeToggle() {
        if (theme === 'light') {
            handleTheme('dark')
        } else {
            handleTheme('light')
        }
    }

    if (deviceType === 'touchOnly') {
        return (
            <div className={open ? 'menuContainerOpen' : 'menuContainer'}>
                <div className="staticMenuBar" alt="menu bar">
                    <img src={theme === 'dark' ? logoDark : logoLight} alt="logo"></img>
                    <div className="title">
                        <h1>Password</h1>
                        <h1>Vault</h1>
                    </div>
                    <button data-testid="open menu" aria-label="open menu" onClick={() => OpenMenu()}>
                        <img src={menu} alt="open menu"></img>
                    </button>
                </div>
                {open ? (
                    <div className="mobileMenu">
                        {screen != 'home' && (
                            <button aria-label="home" onClick={() => handleScreenChange('home')}>
                                <img src={home} alt="home" />
                            </button>
                        )}
                        <button aria-label="about" onClick={() => handleScreenChange('about')}>
                            <img src={info} alt="info"/>
                        </button>
                        {signedIn ? (
                            <button aria-label="account" 
                                onClick={() => handleScreenChange('account')}
                            >
                                <img src={user} alt="account" />
                            </button>
                        ) : null}
                        <button
                            aria-label={signedIn? "sign out": "sign in"}
                            onClick={
                                signedIn
                                    ? () => handleSignOut()
                                    : () => handleScreenChange('signin')
                            }
                        >
                            <img
                                src={
                                    signedIn
                                        ? logout
                                        : theme === 'dark'
                                          ? loginDark
                                          : loginLight
                                }
                                alt={signedIn? "sign out": "sign in"}
                            />
                        </button>
                        <button aria-label="dark mode/light mode toggle" onClick={() => themeToggle()}>
                            <img src={mode} alt="dark mode/light mode toggle" />
                        </button>
                    </div>
                ) : null}
            </div>
        )
    } else {
        return (
            <div className="menuContainer">
                <div className="staticMenuBar" alt="menu bar">
                    <img src={theme === 'dark' ? logoDark : logoLight} alt="logo"></img>
                    <div className="title">
                        <h1>Password</h1>
                        <h1>Vault</h1>
                    </div>
                    {screen != 'home' && screen != 'signin' && (
                        <button aria-label="home" onClick={() => handleScreenChange('home')}>
                            <img src={home} alt="home" />
                        </button>
                    )}
                    <button aria-label="info" onClick={() => handleScreenChange('about')}>
                        <img src={info} alt="info"/>
                    </button>
                    {signedIn ? (
                        <button aria-label="account" onClick={() => handleScreenChange('account')}>
                            <img src={user} alt="account" />
                        </button>
                    ) : null}
                    <button
                        data-testid="sign in"
                        aria-label={signedIn? "sign out": "sign in"}
                        onClick={
                            signedIn
                                ? () => handleSignOut()
                                : screen === 'signin'
                                  ? () => handleScreenChange('home')
                                  : () => handleScreenChange('signin')
                        }
                    >
                        <img
                            src={
                                signedIn
                                    ? logout
                                    : theme === 'dark'
                                      ? loginDark
                                      : loginLight
                            }
                            alt={signedIn? "sign out": "sign in"}
                        />
                    </button>
                    <button aria-label="dark mode/light mode toggle" onClick={() => themeToggle()}>
                        <img src={mode} alt="dark mode/light mode toggle" />
                    </button>
                </div>
            </div>
        )
    }
}
