import React, { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { QRCodeSVG } from 'qrcode.react'
import { useNavigate } from 'react-router'
import {
    signIn,
    setScreen,
    setUserEmail,
    setRefreshToken,
} from '../redux/authSlice'
import { Register, Login, PasswordReset, Authenticate } from '../services/api'
import { Check } from '../utils/passwordGenerator'
import '../assets/styles/SignIn.scss'

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
    const [loading, setLoading] = useState(false)

    const dispatch = useDispatch()
    let navigate = useNavigate()

    const loadingRef = useRef(null)

    useEffect(() => {
        if (loadingRef.current) {
            loadingRef.current.load()
        }
    }, [theme])

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

    const HandleSignIn = async () => {
        if (username === '' || password === '') {
            setPopUpMessage('Please enter credentials')
            setMessageVisible(true)
            setTimeout(() => setMessageVisible(false), 4000)
        } else {
            setLoading(true)
            const login = await Login(username, password)
            if (login != false) {
                if (login !== 'set') {
                    setTOTPSecret(login)
                    var string = /secret=([A-Za-z0-9]+)/.exec(login)
                    console.log(string[1])
                    setTOTPString(string[1])
                }
                setLoading(false)
                setTOTPVisible(true)
            } else {
                setLoading(false)
                setPopUpMessage('Cannot sign in, check credentials')
                setMessageVisible(true)
                setTimeout(() => setMessageVisible(false), 4000)
            }
        }
    }

    const TOTP = async () => {
        setLoading(true)
        const authenticate = await Authenticate(username, TOTPToken)
        if (authenticate) {
            tokenHandler(authenticate['access'])
            refreshToken(authenticate['refresh'])
            userDetails(username)
            setLoading(false)
            handleScreenChange('vault')
            navigate('/vault')
        } else {
            setLoading(false)
            setTOTPMessage('Cannot sign in, check code')
        }
    }

    const CreateAccount = async () => {
        setLoading(true)
        if (!newUsername || !newPassword || !name) {
            setPopUpMessage('Please complete all required fields')
            setLoading(false)
            setMessageVisible(true)
            setTimeout(() => {
                setMessageVisible(false)
            }, 3000)
        } else {
            const check = await Check(newUsername, newPassword)
            if (check != true) {
                setPopUpMessage('Please enter a secure password')
                setLoading(false)
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
                setLoading(false)
                setMessageVisible(true)
                setTimeout(() => {
                    setMessageVisible(false)
                    handleScreenChange('home')
                }, 3000)
            } else {
                setNewPassword('')
                setNewUsername('')
                setName('')
                setPopUpMessage(
                    'Account creation unsuccessful, please check entered details, or if you already have an account please sign in '
                )
                setMessageVisible(true)
                setLoading(false)
                setTimeout(() => setMessageVisible(false), 3000)
            }
        }
    }

    const ForgottenPassword = async () => {
        if (username != '') {
            setLoading(true)
            const response = await PasswordReset(username)
            if (response) {
                setPopUpMessage(
                    'Password reset request successful, if there is an account associated with this email address, a password reset email has been sent'
                )
                setLoading(false)
                setMessageVisible(true)

                setTimeout(() => setMessageVisible(false), 3000)
            }
        } else {
            setPopUpMessage('Please enter email address')
            setLoading(false)
            setMessageVisible(true)
            // setTimeout(() => setMessageVisible(false), 3000)
        }
    }

    const inputHandler = (e) => {
        e.preventDefault()
        if (e.target.name === 'signIn') {
            HandleSignIn()
        } else if (e.target.name === 'usernameInput') {
            setUsername(e.target.value)
        } else if (e.target.name === 'passwordInput') {
            setPassword(e.target.value)
        } else if (e.target.name === 'newUsernameInput') {
            setNewUsername(e.target.value)
        } else if (e.target.name === 'newPasswordInput') {
            setNewPassword(e.target.value)
        } else if (e.target.name === 'nameInput') {
            setName(e.target.value)
        } else if (e.target.name === 'forgottenButton') {
            ForgottenPassword()
        } else if (e.target.name === 'createAccount') {
            CreateAccount()
        } else if (e.currentTarget.name === 'popupClose') {
            setMessageVisible(false)
        } else if (e.target.name === 'totp') {
            TOTP()
        } else if (e.target.name === 'totpInput') {
            setTOTPToken(e.target.value)
        } else if (e.currentTarget.name === 'totpCopy') {
            navigator.clipboard.writeText(TOTPString)
            if (theme === 'dark') {
                e.target.src = '/light/copy-light-40w.webp'
                e.target.srcset =
                    '/light/copy-light-20w.webp 20w, /light/copy-light-40w.webp 40w'
            } else {
                e.target.src = '/dark/copy-dark-40w.webp'
                e.target.srcset =
                    '/dark/copy-dark-20w.webp 20w, /dark/copy-dark-40w.webp 40w'
            }
            setTimeout(() => {
                if (theme === 'dark') {
                    e.target.src = '/dark/copy-dark-40w.webp'
                    e.target.srcset =
                        '/dark/copy-dark-20w.webp 20w, /dark/copy-dark-40w.webp 40w'
                } else {
                    e.target.src = '/light/copy-light-40w.webp'
                    e.target.srcset =
                        '/light/copy-light-20w.webp 20w, /light/copy-light-40w.webp 40w'
                }
            }, 1000)
        }
    }

    return (
        <>
            <div className="signIn">
                <div className="signInContainer">
                    <div className="formContainer">
                        <form
                            className="forms"
                            name="signIn"
                            onSubmit={inputHandler}
                        >
                            <h1>Sign in</h1>
                            <input
                                className="usernameInput"
                                type="email"
                                name="usernameInput"
                                value={username}
                                onChange={inputHandler}
                                placeholder="Email address"
                                autoComplete="off"
                                alt="sign in username input"
                                aria-label="sign in username input"
                            ></input>
                            <input
                                className="passwordinput"
                                type="password"
                                name="passwordInput"
                                value={password}
                                onChange={inputHandler}
                                placeholder="Password"
                                autoComplete="off"
                                alt="sign in password input"
                                aria-label="sign in password input"
                            ></input>
                            <button
                                className="signInButton"
                                type="submit"
                                alt="sign in button"
                                aria-label="sign in button"
                            >
                                Sign In
                            </button>
                        </form>
                        <button
                            className="forgottenButton"
                            name="forgottenButton"
                            onClick={inputHandler}
                            alt="forgotten password button"
                            aria-label="forgotten password button"
                        >
                            Forgotten password
                        </button>
                    </div>
                    <div className="formContainer">
                        <form
                            className="forms"
                            name="createAccount"
                            onSubmit={inputHandler}
                        >
                            <h1>Create account</h1>
                            <input
                                className="usernameInput"
                                type="email"
                                name="newUsernameInput"
                                value={newUsername}
                                onChange={inputHandler}
                                placeholder="Email address"
                                autoComplete="off"
                                alt="create account username input"
                            ></input>
                            <input
                                className="passwordinput"
                                type="password"
                                name="newPasswordInput"
                                value={newPassword}
                                onChange={inputHandler}
                                placeholder="Password"
                                autoComplete="off"
                                alt="create account password input"
                            ></input>
                            <input
                                className="nameInput"
                                type="text"
                                name="nameInput"
                                value={name}
                                onChange={inputHandler}
                                placeholder="Name"
                                autoComplete="off"
                            ></input>
                            <button
                                className="createAccountButton"
                                type="submit"
                                alt="create account button"
                                aria-label="create account button"
                            >
                                Create Account
                            </button>
                        </form>
                    </div>
                    {messageVisible && (
                        <div className="popUpContainer">
                            <button
                                name="popupClose"
                                onClick={inputHandler}
                                alt="close popup button"
                                aria-label="close popup button"
                            >
                                <img
                                    srcSet={
                                        theme === 'dark'
                                            ? 'dark/close-dark-20w.webp 20w, dark/close-dark-40w.webp 40w'
                                            : 'light/close-light-20w.webp 20w, light/close-light-40w.webp 40w'
                                    }
                                    size="(pointer: fine) 20w, (pointer: coarse) and (max-width: 450px) 20w, 40w"
                                    src={
                                        theme === 'dark'
                                            ? 'dark/close-dark-40w.webp'
                                            : 'light/close-light-40w.webp'
                                    }
                                />
                            </button>
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
                                <form
                                    className="code"
                                    name="totp"
                                    onSubmit={inputHandler}
                                >
                                    <input
                                        type="text"
                                        name="totpInput"
                                        value={TOTPToken}
                                        onChange={inputHandler}
                                        alt="totp input"
                                        autoFocus
                                    ></input>
                                    <button
                                        type="submit"
                                        alt="totp enter button"
                                        aria-label="totp enter button"
                                    >
                                        Enter
                                    </button>
                                    <h4>{TOTPMessage}</h4>
                                </form>
                            </div>
                        ) : (
                            <div className="totpContainer">
                                <h2>
                                    Set Up Multi-Factor Authentication (MFA)
                                </h2>
                                <h3>
                                    To enable MFA for your account, follow these
                                    steps:
                                </h3>
                                <ul>
                                    <li>
                                        <h4>Install an Authenticator App</h4>
                                        <h4>
                                            Use an app like Google Authenticator
                                            or Microsoft Authenticator.
                                        </h4>
                                    </li>
                                    <li>
                                        <h4>Add a New Account</h4>
                                        <h4>
                                            Open the app and choose to add a new
                                            account.
                                        </h4>
                                        <h4>
                                            {' '}
                                            - Scan the QR Code provided, or
                                        </h4>
                                        <h4>
                                            {' '}
                                            - Enter the setup code manually
                                        </h4>
                                    </li>
                                    <li>
                                        <h4>Enter the Verification Code</h4>
                                        <h4>
                                            The app will generate a 6-digit
                                            code. Enter it to complete the
                                            setup.
                                        </h4>
                                    </li>
                                </ul>
                                <h4>
                                    Need help? Contact support or refer to your
                                    authenticator app's help guide.
                                </h4>
                                <form
                                    className="code"
                                    name="totp"
                                    onSubmit={inputHandler}
                                >
                                    <QRCodeSVG
                                        value={TOTPSecret}
                                        height="600"
                                        width="600"
                                    />
                                    <div className="string">
                                        <h3>{TOTPString}</h3>
                                        <button
                                            type="button"
                                            name="totpCopy"
                                            onClick={inputHandler}
                                            alt="copy TOTP string"
                                            aria-label="copy TOTP string"
                                        >
                                            <img
                                                srcSet={
                                                    theme === 'dark'
                                                        ? '/dark/copy-dark-20w.webp 20w, /dark/copy-dark-40w.webp 40w'
                                                        : '/light/copy-light-20w.webp 20w, /light/copy-light-40w.webp 40w'
                                                }
                                                size="(pointer: fine) 20w, (max-width: 445) 20w, 40w"
                                                src={
                                                    theme === 'dark'
                                                        ? '/dark/copy-dark-40w.webp'
                                                        : '/light/copy-light-40w.webp'
                                                }
                                            />
                                        </button>
                                    </div>
                                    <input
                                        type="text"
                                        name="totpInput"
                                        value={TOTPToken}
                                        onChange={inputHandler}
                                        alt="totp input"
                                        autoFocus
                                    ></input>
                                    <h4>{TOTPMessage}</h4>
                                    <button
                                        type="submit"
                                        alt="totp enter button"
                                        aria-label="totp enter button"
                                    >
                                        Enter
                                    </button>
                                </form>
                            </div>
                        ))}
                </div>
            </div>
            {loading && (
                <div className="loading">
                    <div className="badge">
                        <video
                            alt="loading"
                            ref={loadingRef}
                            autoPlay
                            muted
                            playsInline
                            loop
                        >
                            <source
                                src={
                                    theme === 'dark'
                                        ? '/dark/loading-dark-95w.webm'
                                        : '/light/loading-light-95w.webm'
                                }
                                media="(max-width: 400px)"
                                type="video/webm"
                            />
                            <source
                                src={
                                    theme === 'dark'
                                        ? '/dark/loading-dark-125w.webm'
                                        : '/light/loading-light-125w.webm'
                                }
                                media="(max-width: 520px)"
                                type="video/webm"
                            />
                            <source
                                src={
                                    theme === 'dark'
                                        ? '/dark/loading-dark-245w.webm'
                                        : '/light/loading-light-245w.webm'
                                }
                                type="video/webm"
                            />
                        </video>
                    </div>
                </div>
            )}
        </>
    )
}
