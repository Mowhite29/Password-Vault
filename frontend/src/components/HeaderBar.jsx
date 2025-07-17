import React from 'react'
import { useSelector } from 'react-redux'
import '../assets/styles/HeaderBar.scss'

export default function HeaderBar() {
    const connected = useSelector((state) => state.connect.connected)
    return (
        <div className="headerContainer">
            <p>
                DEMO PROJECT ONLY - DO NOT USE WITH REAL DATA - SEE ABOUT PAGE
            </p>
            <p>
                This application uses a backend which spins down when not used.
                Connection status: {connected ? 'Active' : 'Loading'}
            </p>
        </div>
    )
}
