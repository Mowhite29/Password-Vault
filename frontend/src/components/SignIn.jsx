import React from 'react'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { QRCodeSVG } from 'qrcode.react'
import {
    signIn,
    setScreen,
    setUserEmail,
    setRefreshToken,
} from '../redux/authSlice'
import { Register, Login, PasswordReset, Authenticate } from '../services/api'
import Email from './Email'
import { Check } from '../utils/passwordGenerator'
import '../styles/SignIn.scss'

export default function SignIn() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [newUsername, setNewUsername] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [name, setName] = useState('')
    const [popUpMessage, setPopUpMessage] = useState('')
    const [messageVisible, setMessageVisible] = useState(false)
    const [emailVisible, setEmailVisible] = useState(false)
    const [emailURL, setEmailURL] = useState('')
    const [emailType, setEmailType] = useState('')
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

    async function SignIn() {
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
                setPopUpMessage(
                    'Account creation successful, please verify email address to sign in'
                )
                const url =
                    '/verify-email/' +
                    register['uid'] +
                    '/' +
                    register['token'] +
                    '/'
                setEmailType('email')
                setEmailURL(url)
                setTimeout(() => {
                    setEmailVisible(true)
                    setMessageVisible(false)
                }, 4000)
            } else {
                setPopUpMessage(
                    'Account creation unsuccessful, please check entered details, or if you already have an account please sign in '
                )
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
                const url =
                    '/password-change-confirm/' +
                    response['uid'] +
                    '/' +
                    response['token'] +
                    '/'
                setEmailType('password')
                setEmailURL(url)
                setTimeout(() => setEmailVisible(true), 4000)
            }
        } else {
            setPopUpMessage('Please enter email address')
            setMessageVisible(true)
            setTimeout(() => setMessageVisible(false), 3000)
        }
    }

    return (
        <div className="signInContainer">
            <div className="formContainer">
                <form className="forms" action={() => SignIn()}>
                    <h1>Sign in</h1>
                    <input
                        className="usernameInput"
                        type="email"
                        value={username}
                        onChange={usernameInput}
                        placeholder="Email address"
                        autoComplete="email-address"
                        alt="sign in username input"
                    ></input>
                    <input
                        className="passwordinput"
                        type="password"
                        value={password}
                        onChange={passwordInput}
                        placeholder="Password"
                        autoComplete="current-password"
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
                    forgotten password
                </button>
            </div>
            <div className="formContainer">
                <form className="forms" action={() => CreateAccount()}>
                    <h1>Create account</h1>
                    <input
                        className="usernameInput"
                        type="email"
                        value={newUsername}
                        onChange={newUsernameInput}
                        placeholder="Email address"
                        autoComplete="email-address"
                        alt="create account username input"
                    ></input>
                    <input
                        className="passwordinput"
                        type="password"
                        value={newPassword}
                        onChange={newPasswordInput}
                        placeholder="Password"
                        autoComplete="none"
                        alt="create account password input"
                    ></input>
                    <input
                        className="nameInput"
                        type="text"
                        value={name}
                        onChange={nameInput}
                        placeholder="Name"
                        autoComplete="name"
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
            {emailVisible && (
                <Email
                    type={emailType}
                    url={emailURL}
                    user={name}
                    email={username || newUsername}
                />
            )}
            {TOTPVisible &&
                (TOTPSecret === '' ? (
                    <div className="totpContainer">
                        <h2>
                            Enter one time passcode as shown in your
                            authenticator application
                        </h2>
                        <input
                            type="number"
                            value={TOTPToken}
                            onChange={tokenInput}
                            alt="totp input"
                        ></input>
                        <button onClick={() => TOTP()} alt="totp enter button">
                            Enter
                        </button>
                    </div>
                ) : (
                    <div className="totpContainer">
                        <h2>
                            Use QR or text code with an authenticator
                            application to set up multi factor authentication,
                            then enter the code generated
                        </h2>
                        <QRCodeSVG value={TOTPSecret} width="200" />
                        <h3>{TOTPString}</h3>
                        <input
                            name="token"
                            type="number"
                            value={TOTPToken}
                            onChange={tokenInput}
                            alt="totp input"
                        ></input>
                        <button onClick={() => TOTP()} alt="totp enter button">
                            Enter
                        </button>
                        <h4>{TOTPMessage}</h4>
                    </div>
                ))}
        </div>
    )
}
