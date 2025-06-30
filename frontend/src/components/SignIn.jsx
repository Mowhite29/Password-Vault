import { useState } from 'react'
import { useDispatch } from 'react-redux'
import {
    signIn,
    setScreen,
    setUserEmail,
    setRefreshToken,
} from '../redux/authSlice'
import { Register, TokenObtain } from '../services/api'
import Email from './Email'
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

    const dispatch = useDispatch()

    const emailType = 'email'

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
        setPopUpMessage('Loading')
        setMessageVisible(true)
        const tokenObtain = await TokenObtain(username, password)
        if (tokenObtain != false) {
            tokenHandler(tokenObtain['access'])
            refreshToken(tokenObtain['refresh'])
            userDetails(username)
            handleScreenChange('vault')
        } else {
            setPopUpMessage('Cannot sign in, check credentials')
        }
    }

    async function CreateAccount() {
        setPopUpMessage('Loading')
        setMessageVisible(true)
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
            setEmailURL(url)
            console.log(register['uid'], register['token'])
            setTimeout(() => setEmailVisible(true), 4000)
        } else {
            setPopUpMessage(
                'Account creation unsuccessful, please check entered details, or if you already have an account please sign in '
            )
        }
    }

    return (
        <div className="signInContainer">
            <form className="signIn" action={() => SignIn()}>
                <p>Sign in</p>
                <input
                    className="usernameInput"
                    type="email"
                    value={username}
                    onChange={usernameInput}
                    placeholder="Email address"
                    autoComplete="email-address"
                ></input>
                <input
                    className="passwordinput"
                    type="password"
                    value={password}
                    onChange={passwordInput}
                    placeholder="Password"
                    autoComplete="current-password"
                ></input>
                <button className="signInButton" type="submit">
                    Sign In
                </button>
            </form>
            <form className="createAccount" action={() => CreateAccount()}>
                <p>Create account</p>
                <input
                    className="usernameInput"
                    type="email"
                    value={newUsername}
                    onChange={newUsernameInput}
                    placeholder="Email address"
                    autoComplete="email-address"
                ></input>
                <input
                    className="passwordinput"
                    type="password"
                    value={newPassword}
                    onChange={newPasswordInput}
                    placeholder="Password"
                    autoComplete="none"
                ></input>
                <input
                    className="nameInput"
                    type="text"
                    value={name}
                    onChange={nameInput}
                    placeholder="Name"
                    autoComplete="name"
                ></input>
                <button className="createAccountButton" type="submit">
                    Create Account
                </button>
            </form>
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
                    email={newUsername}
                />
            )}
        </div>
    )
}
