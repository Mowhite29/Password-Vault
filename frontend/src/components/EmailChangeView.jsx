import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { signOut } from '../redux/authSlice'
import { EmailChangeVerify } from '../services/api'
import '../styles/PasswordChange.scss'

export default function EmailChange() {
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')

    const dispatch = useDispatch()
    const navigate = useNavigate()
    let params = useParams()

    const handleSignOut = () => {
        dispatch(signOut())
    }

    async function Confirm() {
        const response = await EmailChangeVerify(
            email,
            params.uidb64,
            params.token
        )
        if (response != true) {
            setMessage('Email change failed, please try again later')
        } else {
            setMessage(
                'Email change successful. You will now be redirected to the home page to sign in'
            )
            setTimeout(() => {
                handleSignOut()
                navigate('/')
            })
        }
    }

    const inputHandler = (e) => {
        setEmail(e.target.value)
    }

    return (
        <>
            <h1>Enter new email address:</h1>
            <input type="email" onChange={inputHandler} value={email}></input>
            <h2>{message}</h2>
            <button onClick={() => Confirm()}>Confirm</button>
        </>
    )
}
