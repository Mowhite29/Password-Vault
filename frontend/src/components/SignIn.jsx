import React from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { QRCodeSVG } from 'qrcode.react'
import {
    signIn,
    setScreen,
    setUserEmail,
    setRefreshToken,
} from '../redux/authSlice'
import { Register, Login, PasswordReset, Authenticate } from '../services/api'
import { Check } from '../utils/passwordGenerator'
import '../assets/styles/SignIn.scss'
import copyDark from '../assets/images/dark/copy.png'
import copyLight from '../assets/images/light/copy.png'

export default function SignIn() {
    const theme = useSelector((state) => state.appearance.theme)

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [newUsername, setNewUsername] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [name, setName] = useState('')
    const [popUpMessage, setPopUpMessage] = useState('')
    const [messageVisible, setMessageVisible] = useState(false)
    const [TOTPVisible, setTOTPVisible] = useState(false)
    const [TOTPToken, setTOTPToken] = useState('')
    const [TOTPSecret, setTOTPSecret] = useState('')
    const [TOTPString, setTOTPString] = useState('')
    const [TOTPMessage, setTOTPMessage] = useState('')

    const dispatch = useDispatch()

    const usernameInput = (e) => {
        setUsername(e.target.value)
    }

    const passwordInput = (e) => {
        setPassword(e.target.value)
    }

    const newUsernameInput = (e) => {
        setNewUsername(e.target.value)
    }

    const newPasswordInput = (e) => {
        setNewPassword(e.target.value)
    }

    const nameInput = (e) => {
        setName(e.target.value)
    }

    const tokenInput = (e) => {
        setTOTPToken(e.target.value)
    }

    const handleScreenChange = (newScreen) => {
        dispatch(setScreen(newScreen))
    }

    const tokenHandler = (access) => {
        dispatch(signIn(access))
    }

    const userDetails = (details) => {
        dispatch(setUserEmail(details))
    }

    const refreshToken = (refresh) => {
        dispatch(setRefreshToken(refresh))
    }

    async function HandleSignIn() {
        const login = await Login(username, password)
        if (login != false) {
            if (login !== 'set') {
                setTOTPSecret(login)
                var string = /secret=([A-Za-z0-9]+)/.exec(login)
                console.log(string[1])
                setTOTPString(string[1])
            }
            setTOTPVisible(true)
        } else {
            setPopUpMessage('Cannot sign in, check credentials')
            setMessageVisible(true)
            setTimeout(() => setMessageVisible(false), 4000)
        }
    }

    async function TOTP() {
        const authenticate = await Authenticate(username, TOTPToken)
        if (authenticate) {
            tokenHandler(authenticate['access'])
            refreshToken(authenticate['refresh'])
            userDetails(username)
            handleScreenChange('vault')
        } else {
            setTOTPMessage('Cannot sign in, check code')
        }
    }

    async function CreateAccount() {
        setPopUpMessage('Loading')
        setMessageVisible(true)
        if (!newUsername || !newPassword || !name) {
            setPopUpMessage('Please complete all required fields')
            setMessageVisible(true)
            setTimeout(() => {
                setMessageVisible(false)
            }, 3000)
        } else {
            const check = await Check(newUsername, newPassword)
            if (check != true) {
                setPopUpMessage('Please enter a secure password')
                setMessageVisible(true)
                setTimeout(() => {
                    setMessageVisible(false)
                }, 3000)
                return
            }
            const register = await Register(newUsername, newPassword, name)

            if (register) {
                setNewPassword('')
                setNewUsername('')
                setName('')
                setPopUpMessage(
                    'Account creation successful, please verify email address to sign in'
                )
                setMessageVisible(true)
                setTimeout(() => setMessageVisible(false), 4000)
                handleScreenChange('home')
            } else {
                setNewPassword('')
                setNewUsername('')
                setName('')
                setPopUpMessage(
                    'Account creation unsuccessful, please check entered details, or if you already have an account please sign in '
                )
                setTimeout(() => setMessageVisible(false), 4000)
            }
        }
    }

    async function ForgottenPassword() {
        if (username) {
            const response = await PasswordReset(username)
            if (response) {
                setPopUpMessage(
                    'Password reset request successful, if there is an account associated with this email address, a password reset email has been sent'
                )
                setMessageVisible(true)

                setTimeout(() => setMessageVisible(false), 4000)
            }
        } else {
            setPopUpMessage('Please enter email address')
            setMessageVisible(true)
            setTimeout(() => setMessageVisible(false), 3000)
        }
    }

    return (
        <div className="signIn">
            <div className="signInContainer">
                <div className="formContainer">
                    <form className="forms" action={() => HandleSignIn()}>
                        <h1>Sign in</h1>
                        <input
                            className="usernameInput"
                            type="email"
                            name="username"
                            value={username}
                            onChange={usernameInput}
                            placeholder="Email address"
                            autoComplete="off"
                            alt="sign in username input"
                        ></input>
                        <input
                            className="passwordinput"
                            type="password"
                            name="password"
                            value={password}
                            onChange={passwordInput}
                            placeholder="Password"
                            autoComplete="off"
                            alt="sign in password input"
                        ></input>
                        <button
                            className="signInButton"
                            type="submit"
                            alt="sign in button"
                        >
                            Sign In
                        </button>
                    </form>
                    <button
                        className="forgottenButton"
                        onClick={() => ForgottenPassword()}
                    >
                        Forgotten password
                    </button>
                </div>
                <div className="formContainer">
                    <form className="forms" action={() => CreateAccount()}>
                        <h1>Create account</h1>
                        <input
                            className="usernameInput"
                            type="email"
                            name="username"
                            value={newUsername}
                            onChange={newUsernameInput}
                            placeholder="Email address"
                            autoComplete="off"
                            alt="create account username input"
                        ></input>
                        <input
                            className="passwordinput"
                            type="password"
                            name="password"
                            value={newPassword}
                            onChange={newPasswordInput}
                            placeholder="Password"
                            autoComplete="off"
                            alt="create account password input"
                        ></input>
                        <input
                            className="nameInput"
                            type="text"
                            name="name"
                            value={name}
                            onChange={nameInput}
                            placeholder="Name"
                            autoComplete="off"
                        ></input>
                        <button
                            className="createAccountButton"
                            type="submit"
                            alt="create account button"
                        >
                            Create Account
                        </button>
                    </form>
                </div>
                {messageVisible && (
                    <div className="popUpContainer">
                        <h1>{popUpMessage}</h1>
                    </div>
                )}
                {TOTPVisible &&
                    (TOTPSecret === '' ? (
                        <div className="totpContainer">
                            <h2>
                                Enter one time passcode as shown in your
                                authenticator application
                            </h2>
                            <div className="code">
                                <input
                                    type="text"
                                    value={TOTPToken}
                                    onChange={tokenInput}
                                    alt="totp input"
                                ></input>
                                <button
                                    onClick={() => TOTP()}
                                    alt="totp enter button"
                                >
                                    Enter
                                </button>
                                <h4>{TOTPMessage}</h4>
                            </div>
                        </div>
                    ) : (
                        <div className="totpContainer">
                            <h2>
                                Use QR or text code with an authenticator
                                application to set up multi factor
                                authentication, then enter the code generated
                            </h2>
                            <div className="code">
                                <QRCodeSVG
                                    value={TOTPSecret}
                                    height="600"
                                    width="600"
                                />
                                <div className="string">
                                    <h3>{TOTPString}</h3>
                                    <button
                                        onClick={() =>
                                            navigator.clipboard.writeText(
                                                TOTPString
                                            )
                                        }
                                    >
                                        <img
                                            src={
                                                theme === 'dark'
                                                    ? copyDark
                                                    : copyLight
                                            }
                                        ></img>
                                    </button>
                                </div>
                                <input
                                    name="token"
                                    type="text"
                                    value={TOTPToken}
                                    onChange={tokenInput}
                                    alt="totp input"
                                ></input>
                                <button
                                    onClick={() => TOTP()}
                                    alt="totp enter button"
                                >
                                    Enter
                                </button>
                                <h4>{TOTPMessage}</h4>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    )
}
