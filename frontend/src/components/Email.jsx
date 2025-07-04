import { useNavigate } from 'react-router-dom'
import '../styles/Email.scss'

export default function Email({ type, url, user, email }) {
    const navigate = useNavigate()

    const siteURL = import.meta.env.VITE_FRONTEND_URL

    function Verify() {
        navigate(url)
    }

    if (type === 'email') {
        return (
            <div className="screen">
                <div className="emailContainer">
                    <p className="emailHeaders">
                        From: email-verify@passwordvault.info
                    </p>
                    <p className="emailHeaders">To: {email}</p>
                    <p className="emailHeaders">Subject: Email Verification</p>
                    <div className="emailBody">
                        <p>Hi {user},</p>
                        <p>
                            Please verify your email address by clicking the
                            link below:
                        </p>
                        <button onClick={() => Verify()}>
                            {siteURL + url}
                        </button>
                        <p>If you didn't register, please ignore this email.</p>
                    </div>
                </div>
            </div>
        )
    } else if (type === 'email-change') {
        return (
            <div className="screen">
                <div className="emailContainer">
                    <p className="emailHeaders">
                        From: email-verify@passwordvault.info
                    </p>
                    <p className="emailHeaders">To: {email}</p>
                    <p className="emailHeaders">
                        Subject: Email Change Verification
                    </p>
                    <div className="emailBody">
                        <p>Hi {user},</p>
                        <p>
                            Please clicking the link below to change your email
                            address:
                        </p>
                        <button onClick={() => Verify()}>
                            {siteURL + url}
                        </button>
                        <p>
                            If you didn't request this, please ignore this
                            email.
                        </p>
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div className="screen">
                <div className="emailContainer">
                    <p className="emailHeaders">
                        From: password-change@passwordvault.info
                    </p>
                    <p className="emailHeaders">To: {email}</p>
                    <p className="emailHeaders">Subject: Email Verification</p>
                    <div className="emailBody">
                        <p>Hi {user},</p>
                        <p>
                            Complete your password change by clicking the link
                            below:
                        </p>
                        <button onClick={() => Verify()}>
                            {siteURL + url}
                        </button>
                        <p>
                            If you didn't request this, please ignore this
                            email.
                        </p>
                    </div>
                </div>
            </div>
        )
    }
}
