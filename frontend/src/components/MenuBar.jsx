import React from 'react'
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { signOut, setScreen } from '../redux/authSlice'
import { setTheme } from '../redux/appearanceSlice'
import { primaryInput } from 'detect-it'
import { useNavigate } from 'react-router'
import '../assets/styles/MenuBar.scss'

export default function MenuBar() {
    const [open, setOpen] = useState(false)
    const signedIn = useSelector((state) => state.auth.signedIn)
    const screen = useSelector((state) => state.auth.screen)
    const theme = useSelector((state) => state.appearance.theme)
    const dispatch = useDispatch()
    let navigate = useNavigate()

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
            return navigate('/')
        } else if (e.currentTarget.name === 'menu') {
            OpenMenu()
        } else if (e.currentTarget.name === 'vault') {
            handleScreenChange('vault')
            navigate('/vault')
        } else if (e.currentTarget.name === 'account') {
            handleScreenChange('account')
            navigate('/vault')
        } else if (e.currentTarget.name === 'signInOut') {
            if (signedIn) {
                handleSignOut()
                navigate('/')
            } else {
                screen === 'signin'
                    ? handleScreenChange('home')
                    : handleScreenChange('signin')
            }
        } else if (e.currentTarget.name === 'about') {
            handleScreenChange('about')
            navigate('/')
        }
    }

    if (primaryInput === 'touch') {
        return (
            <div
                className={open ? 'menuContainerOpen' : 'menuContainer'}
                role="region"
                aria-label="Menu bar"
            >
                <div className="staticMenuBar">
                    <video
                        className="logo"
                        alt="logo"
                        autoPlay
                        muted
                        playsInline
                        onClick={() => {
                            handleScreenChange('home')
                            navigate('/')
                        }}
                    >
                        <source
                            src={
                                theme === 'dark'
                                    ? '/dark/logo-dark-95w.webm'
                                    : '/light/logo-light-95w.webm'
                            }
                            media="(max-width: 800px)"
                            type="video/webm"
                        />
                        <source
                            src={
                                theme === 'dark'
                                    ? '/dark/logo-dark-75w.webm'
                                    : '/light/logo-light-75w.webm'
                            }
                            media="(max-width: 600px)"
                            type="video/webm"
                        />
                        <source
                            src={
                                theme === 'dark'
                                    ? '/dark/logo-dark-115w.webm'
                                    : '/light/logo-light-115w.webm'
                            }
                            media="(min-width: 800px)"
                            type="video/webm"
                        />
                    </video>

                    <div
                        className="title"
                        onClick={() => {
                            handleScreenChange('home')
                            navigate('/')
                        }}
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
                        <img
                            srcSet={
                                '/dark/menu-45w.webp 45w, /dark/menu-85w.webp 85w'
                            }
                            size="(max-width: 540px) 45w, 85w"
                            src="/dark/menu-85w.webp"
                            alt="open menu"
                        ></img>
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
                                <img src="/dark/home-60w.webp" alt="home" />
                            </button>
                        )}
                        {signedIn && screen != 'vault' ? (
                            <button
                                name="vault"
                                alt="vault"
                                aria-label="vault"
                                onClick={inputHandler}
                            >
                                <img src="/dark/vault-60w.webp" alt="vault" />
                            </button>
                        ) : null}
                        {screen != 'about' ? (
                            <button
                                name="about"
                                alt="about"
                                aria-label="about"
                                onClick={inputHandler}
                            >
                                <img src="/dark/info-60w.webp" alt="about" />
                            </button>
                        ) : null}
                        {signedIn && screen != 'account' ? (
                            <button
                                name="account"
                                alt="account"
                                aria-label="account"
                                onClick={inputHandler}
                            >
                                <img src="/dark/user-60w.webp" alt="account" />
                            </button>
                        ) : null}
                        <button
                            name="signInOut"
                            aria-label={signedIn ? 'sign out' : 'sign in'}
                            alt={signedIn ? 'sign out' : 'sign in'}
                            onClick={inputHandler}
                        >
                            {signedIn ? (
                                <img
                                    src="/dark/logout-60w.webp"
                                    alt="sign out"
                                />
                            ) : (
                                <video
                                    alt={signedIn ? 'sign out' : 'sign in'}
                                    autoPlay
                                    muted
                                    playsInline
                                >
                                    <source
                                        src={
                                            theme === 'dark'
                                                ? '/dark/login-dark-60w.webm'
                                                : '/light/login-light-60w.webm'
                                        }
                                        media="(max-width: 730px)"
                                        type="video/webm"
                                    />
                                    <source
                                        src={
                                            theme === 'dark'
                                                ? '/dark/login-dark-80w.webm'
                                                : '/light/login-light-80w.webm'
                                        }
                                        media="(min-width: 730px)"
                                        type="video/webm"
                                    />
                                </video>
                            )}
                        </button>
                        <button
                            aria-label="dark mode/light mode toggle"
                            onClick={() => themeToggle()}
                        >
                            <img
                                src="/dark/mode-60w.webp"
                                alt="dark mode/light mode toggle"
                            />
                        </button>
                    </div>
                ) : null}
            </div>
        )
    } else {
        return (
            <div
                className="menuContainer"
                role="navigation"
                aria-label="Menu bar"
            >
                <div className="staticMenuBar">
                    <div className="logoTitle">
                        <video
                            className="logo"
                            alt="logo"
                            autoPlay
                            muted
                            playsInline
                            onClick={() => {
                                handleScreenChange('home')
                                navigate('/')
                            }}
                        >
                            <source
                                src={
                                    theme === 'dark'
                                        ? '/dark/logo-dark-75w.webm'
                                        : '/light/logo-light-75w.webm'
                                }
                                media="(max-width: 1450px)"
                                type="video/webm"
                            />
                            <source
                                src={
                                    theme === 'dark'
                                        ? '/dark/logo-dark-95w.webm'
                                        : '/light/logo-light-95w.webm'
                                }
                                media="(min-width: 1450px)"
                                type="video/webm"
                            />
                        </video>
                        <div
                            className="title"
                            onClick={() => {
                                handleScreenChange('home')
                                navigate('/')
                            }}
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
                            <img src="/dark/home-60w.webp" alt="home" />
                        </button>
                    )}
                    {signedIn && screen != 'vault' ? (
                        <button
                            name="vault"
                            alt="vault"
                            aria-label="vault"
                            onClick={inputHandler}
                        >
                            <img src="/dark/vault-60w.webp" alt="vault" />
                        </button>
                    ) : null}
                    {screen != 'about' ? (
                        <button
                            name="about"
                            alt="about"
                            aria-label="about"
                            onClick={inputHandler}
                        >
                            <img src="/dark/info-60w.webp" alt="about" />
                        </button>
                    ) : null}
                    {signedIn && screen != 'account' ? (
                        <button
                            name="account"
                            alt="account"
                            aria-label="account"
                            onClick={inputHandler}
                        >
                            <img src="/dark/info-60w.webp" alt="about" />
                        </button>
                    ) : null}
                    <button
                        data-testid="sign in"
                        name="signInOut"
                        aria-label={signedIn ? 'sign out' : 'sign in'}
                        alt={signedIn ? 'sign out' : 'sign in'}
                        onClick={inputHandler}
                    >
                        {signedIn ? (
                            <img src="/dark/logout-60w.webp" alt="sign out" />
                        ) : (
                            <video
                                alt={signedIn ? 'sign out' : 'sign in'}
                                autoPlay
                                muted
                                playsInline
                            >
                                <source
                                    src={
                                        theme === 'dark'
                                            ? '/dark/login-dark-60w.webm'
                                            : '/light/login-light-60w.webm'
                                    }
                                    media="(max-width: 1275px)"
                                    type="video/webm"
                                />
                                <source
                                    src={
                                        theme === 'dark'
                                            ? '/dark/login-dark-80w.webm'
                                            : '/light/login-light-80w.webm'
                                    }
                                    media="(min-width: 1275px)"
                                    type="video/webm"
                                />
                            </video>
                        )}
                    </button>
                    <button
                        aria-label="dark mode/light mode toggle"
                        onClick={() => themeToggle()}
                    >
                        <img
                            src="/dark/mode-60w.webp"
                            alt="dark mode/light mode toggle"
                        />
                    </button>
                </div>
            </div>
        )
    }
}
