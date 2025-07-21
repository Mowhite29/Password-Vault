import React from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setScreen } from '../redux/authSlice'
import { PasswordChange, NameChange, NameRequest } from '../services/api'
import '../assets/styles/Account.scss'

export default function Account() {
    const userEmail = useSelector((state) => state.auth.userEmail)
    const token = useSelector((state) => state.auth.token)

    const [popUpMessage, setPopUpMessage] = useState('')
    const [messageVisible, setMessageVisible] = useState(false)

    const [nameShown, setNameShown] = useState(false)
    const [firstname, setFirstname] = useState('')
    const [lastname, setLastname] = useState('')

    const dispatch = useDispatch()

    const handleScreenChange = (newScreen) => {
        dispatch(setScreen(newScreen))
    }

    const ChangePassword = async () => {
        const response = await PasswordChange(userEmail, token)
        if (response) {
            setPopUpMessage(
                'A password change confirmation email has been sent to your email address'
            )
            setMessageVisible(true)
            setTimeout(() => setMessageVisible(false), 4000)
        } else {
            setPopUpMessage(
                'Password change unsuccessful, please try again later'
            )
        }
    }

    const ChangeName = async (done = false) => {
        if (done) {
            const response = await NameChange(firstname, lastname, token)
            if (response) {
                setPopUpMessage('Name changed successfully')
                setMessageVisible(true)
                setNameShown(false)
                setTimeout(() => {
                    setMessageVisible(false)
                }, 3000)
            }
        } else {
            const response = await NameRequest(token)
            if (response) {
                setFirstname(response['first_name'])
                setLastname(response['last_name'])
            }
            setNameShown(true)
        }
    }

    const inputHandler = (e) => {
        if (e.target.name === 'firstname') {
            setFirstname(e.target.value)
        } else if (e.target.name === 'lastname') {
            setLastname(e.target.value)
        }
    }

    return (
        <div className="accountContainer">
            <button
                className="return"
                onClick={() => handleScreenChange('vault')}
            >
                Return to vault
            </button>
            <button onClick={() => ChangePassword()}>Change password</button>
            <button onClick={() => ChangeName()}>Change name</button>
            {nameShown && (
                <div className="nameChange">
                    <div>
                        <h2>First name:</h2>
                        <input
                            type="text"
                            name="firstname"
                            value={firstname}
                            onChange={inputHandler}
                        ></input>
                    </div>
                    <div>
                        <h2>Last name:</h2>
                        <input
                            type="text"
                            name="lastname"
                            value={lastname}
                            onChange={inputHandler}
                        ></input>
                    </div>
                    <button onClick={() => ChangeName(true)}>
                        Change name
                    </button>
                    <button onClick={() => setNameShown(false)}>Cancel</button>
                </div>
            )}
            {messageVisible && (
                <div className="popUpContainer">
                    <h1>{popUpMessage}</h1>
                </div>
            )}
        </div>
    )
}
