import React from 'react'
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { signOut } from '../redux/authSlice'
import { setTheme } from '../redux/appearanceSlice'
import { PasswordChangeConfirm } from '../services/api'
import '../assets/styles/PasswordChange.scss'

export default function PasswordChange() {
    const theme = useSelector((state) => state.appearance.theme)
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const params = useParams()

    const handleSignOut = () => {
        dispatch(signOut())
    }

    const handleTheme = (newTheme) => {
        dispatch(setTheme(newTheme))
    }

    useEffect(() => {
        if (theme === '') {
            const colorScheme = window.matchMedia(
                '(prefers-color-scheme: dark)'
            )
            if (colorScheme.matches) {
                handleTheme('dark')
            } else {
                handleTheme('light')
            }
        }
    })

    useEffect(() => {
        document.documentElement.style.setProperty('--theme', theme)
    }, [theme])

    const Confirm = async () => {
        const response = await PasswordChangeConfirm(
            password,
            params.uidb64,
            params.token
        )
        if (response != true) {
            setMessage('Password change failed, please try again later')
        } else {
            setMessage(
                'Password change successful. You will now be redirected to the home page to sign in'
            )
            setTimeout(() => {
                navigate('/')
                handleSignOut()
            }, 5000)
        }
    }

    const inputHandler = (e) => {
        setPassword(e.target.value)
    }

    return (
        <div className="changeContainer">
            <h1>Enter new password:</h1>
            <input
                type="password"
                onChange={inputHandler}
                value={password}
            ></input>
            <button onClick={() => Confirm()}>Confirm</button>
            <h2>{message}</h2>
        </div>
    )
}
