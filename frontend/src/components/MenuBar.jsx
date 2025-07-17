import React from 'react'
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { signOut, setScreen } from '../redux/authSlice'
import { setTheme } from '../redux/appearanceSlice'
import { deviceType } from 'detect-it'

import '../styles/MenuBar.scss'

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
        if (theme === 'light'){
            handleTheme('dark')
        }else {
            handleTheme('light')
        }
    }

    if (deviceType === 'touchOnly') {
        return (
            <div className={open ? 'menuContainerOpen' : 'menuContainer'}>
                <div className="staticMenuBar" alt="menu bar">
                    <h1>Password Vault</h1>
                    <button onClick={() => OpenMenu()}>
                        {open ? 'close menu' : 'open menu'}
                    </button>
                </div>
                {open ? (
                    <div className="mobileMenu">
                        {screen != 'home' && (
                            <button onClick={() => handleScreenChange('home')}>
                                Home
                            </button>
                        )}
                        <button onClick={() => handleScreenChange('about')}>
                            About
                        </button>
                        {signedIn ? (
                            <button
                                onClick={() => handleScreenChange('account')}
                            >
                                My account
                            </button>
                        ) : null}
                        <button
                            onClick={
                                signedIn
                                    ? () => handleSignOut()
                                    : () => handleScreenChange('signin')
                            }
                        >
                            {signedIn ? 'Sign out' : 'Sign in'}
                        </button>
                        {signedIn ? null : (
                            <button
                                onClick={() => handleScreenChange('signin')}
                            >
                                Create account
                            </button>
                        )}
                        <button onClick={() => themeToggle()}>Light/Dark</button>
                    </div>
                ) : null}
            </div>
        )
    } else {
        return (
            <div className="menuContainer">
                <div className="staticMenuBar" alt="menu bar">
                    <h1>Password Vault</h1>
                    {screen != 'home' && (
                        <button onClick={() => handleScreenChange('home')}>
                            Home
                        </button>
                    )}
                    <button onClick={() => handleScreenChange('about')}>
                        About
                    </button>
                    {signedIn ? (
                        <button onClick={() => handleScreenChange('account')}>
                            My account
                        </button>
                    ) : null}
                    <button
                        onClick={
                            signedIn
                                ? () => handleSignOut()
                                : () => handleScreenChange('signin')
                        }
                    >
                        {signedIn ? 'Sign out' : 'Sign in'}
                    </button>
                    {signedIn ? null : (
                        <button onClick={() => handleScreenChange('signin')}>
                            Create account
                        </button>
                    )}
                    <button onClick={() => themeToggle()}>Light/Dark</button>
                </div>
            </div>
        )
    }
}
