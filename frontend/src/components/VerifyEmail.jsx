import React from 'react'
import { useEffect } from 'react'
import { useParams } from 'react-router'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { VerifyEmailAddress } from '../services/api'
import { setScreen } from '../redux/authSlice'
import Email from './Email'
import '../styles/VerifyEmail.scss'

export default function VerifyEmail() {
    let params = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleScreenChange = (newScreen) => {
        dispatch(setScreen(newScreen))
    }

    async function Verify() {
        const response = await VerifyEmailAddress(params.uid, params.token)
        if (response) {
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
        <div classname="verifyContainer">
            <h1>Email address verified successfully</h1>
            <h2>Please wait for redirection to home page</h2>
        </div>
    )
}
