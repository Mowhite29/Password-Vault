import React from 'react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { VerifyEmailAddress } from '../services/api'
import { setScreen } from '../redux/authSlice'
import '../assets/styles/VerifyEmail.scss'

export default function VerifyEmail() {
    let params = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [message, setMessage] = useState('')

    const handleScreenChange = (newScreen) => {
        dispatch(setScreen(newScreen))
    }

    async function Verify() {
        const response = await VerifyEmailAddress(params.uid, params.token)
        if (response == true) {
            setMessage('Email address verified successfully')
            setTimeout(() => {
                handleScreenChange('home')
                navigate('/')
            }, 4000)
        } else {
            setMessage(
                'Email address verification unsuccessful, please try again or contact support'
            )
            setTimeout(() => {
                handleScreenChange('home')
                navigate('/')
            }, 4000)
        }
    }

    useEffect(() => {
        Verify()
    })

    return (
        <div className="verifyContainer">
            <h1>{message}</h1>
            <h2>You will now be redirected to home page</h2>
        </div>
    )
}
