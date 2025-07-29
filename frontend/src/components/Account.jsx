import React from 'react'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { PasswordChange, NameChange, NameRequest } from '../services/api'
import '../assets/styles/Account.scss'
import closeDark20w from '../assets/images/dark/close-dark-20w.webp'
import closeDark40w from '../assets/images/dark/close-dark-40w.webp'
import closeLight20w from '../assets/images/light/close-light-20w.webp'
import closeLight40w from '../assets/images/light/close-light-40w.webp'

export default function Account() {
    const userEmail = useSelector((state) => state.auth.userEmail)
    const token = useSelector((state) => state.auth.token)
    const theme = useSelector((state) => state.appearance.theme)

    const [popUpMessage, setPopUpMessage] = useState('')
    const [messageVisible, setMessageVisible] = useState(false)
    const [firstname, setFirstname] = useState('')
    const [lastname, setLastname] = useState('')

    useEffect(() => {
        const name = async () => {
            const response = await NameRequest(token)
            if (response) {
                setFirstname(response['first_name'])
                setLastname(response['last_name'])
            }
        }

        name()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const ChangePassword = async () => {
        const response = await PasswordChange(userEmail, token)
        if (response) {
            setPopUpMessage(
                'A password change confirmation email has been sent to your email address'
            )
            setMessageVisible(true)
            // setTimeout(() => setMessageVisible(false), 4000)
        } else {
            setPopUpMessage(
                'Password change unsuccessful, please try again later'
            )
        }
    }

    const ChangeName = async () => {
        const response = await NameChange(firstname, lastname, token)
        if (response) {
            setPopUpMessage('Name changed successfully')
            setMessageVisible(true)
            setTimeout(() => {
                setMessageVisible(false)
            }, 3000)
        }
    }

    const inputHandler = (e) => {
        if (e.target.name === 'firstname') {
            setFirstname(e.target.value)
        } else if (e.target.name === 'lastname') {
            setLastname(e.target.value)
        } else if (e.currentTarget.name === 'popupClose') {
            setMessageVisible(false)
        }
    }

    return (
        <div className="accountContainer">
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
                <button onClick={() => ChangeName()}>Save</button>
            </div>
            <button onClick={() => ChangePassword()}>Change password</button>
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
                                                            ? `${closeDark20w} 20w, ${closeDark40w} 40w`
                                                            : `${closeLight20w} 20w, ${closeLight40w} 40w`
                                                    }
                                                    src={
                                                        theme === 'dark' ? closeDark40w : closeLight40w
                                                    }
                                                />
                    </button>
                    <h1>{popUpMessage}</h1>
                </div>
            )}
        </div>
    )
}
