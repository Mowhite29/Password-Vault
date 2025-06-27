import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { signOut, setScreen } from '../redux/authSlice'
import { deviceType } from 'detect-it'

import '../styles/MenuBar.scss'

export default function MenuBar() {
    const [open, setOpen] = useState(false)
    const signedIn = useSelector((state) => state.auth.signedIn)
    const dispatch = useDispatch()

    function OpenMenu() {
        setOpen(() => !open)
    }

    const handleSignOut = () => {
        dispatch(signOut())
    }

    const handleScreenChange = (newScreen) => {
        dispatch(setScreen(newScreen))
    }

    if (deviceType === 'touchOnly') {
        return (
            <div className={open ? 'menuContainerOpen' : 'menuContainer'}>
                <div className="staticMenuBar">
                    {signedIn ? (
                        <h1>Password Vault</h1>
                    ) : (
                        <button onClick={() => handleScreenChange('home')}>
                            Password Vault
                        </button>
                    )}
                    <button onClick={() => OpenMenu()}>
                        {open ? 'close' : 'open'}
                    </button>
                </div>
                <div
                    className="mobileMenu"
                    style={{
                        display: open ? 'flex' : 'none',
                    }}
                >
                    <button
                        onClick={
                            signedIn
                                ? () => handleSignOut()
                                : () => handleScreenChange('signin')
                        }
                    >
                        {signedIn ? 'Sign out' : 'Sign in'}
                    </button>
                    <button
                        onClick={() => handleScreenChange('signin')}
                        style={{
                            display: signedIn ? 'none' : 'flex',
                        }}
                    >
                        Create account
                    </button>
                </div>
            </div>
        )
    } else {
        return (
            <div className="menuContainer">
                <div className="staticMenuBar">
                    <h1>Password Vault</h1>
                    <h2>Sign in</h2>
                </div>
            </div>
        )
    }
}
