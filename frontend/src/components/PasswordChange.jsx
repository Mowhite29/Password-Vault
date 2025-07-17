import React from 'react'
import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { signOut } from '../redux/authSlice'
import { PasswordChangeConfirm } from '../services/api'
import '../assets/styles/PasswordChange.scss'

export default function PasswordChange() {
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const params = useParams()

    const handleSignOut = () => {
        dispatch(signOut())
    }

    async function Confirm() {
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
            <h2>{message}</h2>
            <button onClick={() => Confirm()}>Confirm</button>
        </div>
    )
}
