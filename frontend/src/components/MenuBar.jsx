import React from 'react'
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { signOut, setScreen } from '../redux/authSlice'
import { setTheme } from '../redux/appearanceSlice'
import { primaryInput } from 'detect-it'

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
import vault from '../assets/images/dark/vault.png'

export default function MenuBar() {
    const [open, setOpen] = useState(false)
    const signedIn = useSelector((state) => state.auth.signedIn)
    const screen = useSelector((state) => state.auth.screen)
    const theme = useSelector((state) => state.appearance.theme)
    const dispatch = useDispatch()

    const OpenMenu = () => {
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

    const themeToggle = () => {
        if (theme === 'light') {
            handleTheme('dark')
        } else {
            handleTheme('light')
        }
    }

    const inputHandler = (e) => {
        if (e.currentTarget.name === 'home') {
            handleScreenChange('home')
        } else if (e.currentTarget.name === 'menu') {
            OpenMenu()
        } else if (e.currentTarget.name === 'vault') {
            handleScreenChange('vault')
        } else if (e.currentTarget.name === 'account') {
            handleScreenChange('account')
        } else if (e.currentTarget.name === 'signInOut') {
            signedIn
                ? handleSignOut()
                : screen === 'signin'
                  ? handleScreenChange('home')
                  : handleScreenChange('signin')
        } else if (e.currentTarget.name === 'about') {
            handleScreenChange('about')
        }
    }

    if (primaryInput === 'touch') {
        return (
            <div className={open ? 'menuContainerOpen' : 'menuContainer'}>
                <div className="staticMenuBar">
                    <img
                        src={theme === 'dark' ? logoDark : logoLight}
                        alt="logo"
                    ></img>

                    <div
                        className="title"
                        onClick={() => handleScreenChange('home')}
                        aria-label="return to home"
                    >
                        <h1>Password</h1>
                        <h1>Vault</h1>
                    </div>
                    <button
                        data-testid="open menu"
                        name="menu"
                        alt="open menu"
                        aria-label="open menu"
                        onClick={inputHandler}
                    >
                        <img src={menu} alt="open menu"></img>
                    </button>
                </div>
                {open ? (
                    <div className="mobileMenu">
                        {screen != 'home' && (
                            <button
                                name="home"
                                alt="home"
                                aria-label="home"
                                onClick={inputHandler}
                            >
                                <img src={home} alt="home" />
                            </button>
                        )}
                        {signedIn && screen != 'vault' ? (
                            <button
                                name="vault"
                                alt="vault"
                                aria-label="vault"
                                onClick={inputHandler}
                            >
                                <img src={vault} alt="vault" />
                            </button>
                        ) : null}
                        {screen != 'about' ? (
                            <button
                                name="about"
                                alt="about"
                                aria-label="about"
                                onClick={inputHandler}
                            >
                                <img src={info} alt="about" />
                            </button>
                        ) : null}
                        {signedIn && screen != 'account' ? (
                            <button
                                name="account"
                                alt="account"
                                aria-label="account"
                                onClick={inputHandler}
                            >
                                <img src={user} alt="account" />
                            </button>
                        ) : null}
                        <button
                            name="signInOut"
                            aria-label={signedIn ? 'sign out' : 'sign in'}
                            alt={signedIn ? 'sign out' : 'sign in'}
                            onClick={inputHandler}
                        >
                            <img
                                src={
                                    signedIn
                                        ? logout
                                        : theme === 'dark'
                                          ? loginDark
                                          : loginLight
                                }
                                alt={signedIn ? 'sign out' : 'sign in'}
                            />
                        </button>
                        <button
                            aria-label="dark mode/light mode toggle"
                            onClick={() => themeToggle()}
                        >
                            <img src={mode} alt="dark mode/light mode toggle" />
                        </button>
                    </div>
                ) : null}
            </div>
        )
    } else {
        return (
            <div className="menuContainer">
                <div className="staticMenuBar">
                    <div className="logoTitle">
                        <img
                            src={theme === 'dark' ? logoDark : logoLight}
                            alt="logo"
                        ></img>
                        <div
                            className="title"
                            onClick={() => handleScreenChange('home')}
                            aria-label="return to home"
                        >
                            <h1>Password</h1>
                            <h1>Vault</h1>
                        </div>
                    </div>
                    {screen != 'home' && screen != 'signin' && (
                        <button
                            name="home"
                            alt="home"
                            aria-label="home"
                            onClick={inputHandler}
                        >
                            <img src={home} alt="home" />
                        </button>
                    )}
                    {signedIn && screen != 'vault' ? (
                        <button
                            name="vault"
                            alt="vault"
                            aria-label="vault"
                            onClick={inputHandler}
                        >
                            <img src={vault} alt="vault" />
                        </button>
                    ) : null}
                    {screen != 'about' ? (
                        <button
                            name="about"
                            alt="about"
                            aria-label="about"
                            onClick={inputHandler}
                        >
                            <img src={info} alt="about" />
                        </button>
                    ) : null}
                    {signedIn && screen != 'account' ? (
                        <button
                            name="account"
                            alt="account"
                            aria-label="account"
                            onClick={inputHandler}
                        >
                            <img src={user} alt="account" />
                        </button>
                    ) : null}
                    <button
                        data-testid="sign in"
                        name="signInOut"
                        aria-label={signedIn ? 'sign out' : 'sign in'}
                        alt={signedIn ? 'sign out' : 'sign in'}
                        onClick={inputHandler}
                    >
                        <img
                            src={
                                signedIn
                                    ? logout
                                    : theme === 'dark'
                                      ? loginDark
                                      : loginLight
                            }
                            alt={signedIn ? 'sign out' : 'sign in'}
                        />
                    </button>
                    <button
                        aria-label="dark mode/light mode toggle"
                        onClick={() => themeToggle()}
                    >
                        <img src={mode} alt="dark mode/light mode toggle" />
                    </button>
                </div>
            </div>
        )
    }
}
