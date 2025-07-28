import React from 'react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { VerifyEmailAddress } from '../services/api'
import { setScreen } from '../redux/authSlice'
import { setTheme } from '../redux/appearanceSlice'
import '../assets/styles/VerifyEmail.scss'

export default function VerifyEmail() {
    const theme = useSelector((state) => state.appearance.theme)

    let params = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [message, setMessage] = useState('')

    const handleScreenChange = (newScreen) => {
        dispatch(setScreen(newScreen))
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

    const Verify = async () => {
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
