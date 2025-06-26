import '../styles/Email.scss'

export default function Email(type, url, user, email) {
    if (type === 'email') {
        return (
            <>
                <p className="emailHeaders">
                    From: email-verify@passwordvault.info
                </p>
                <p className="emailHeaders">To: {email}</p>
                <p className="emailHeaders">Subject: Email Verification</p>
                <div className="emailBody">
                    <p>Hi {user},</p>
                    <p>
                        Please verify your email address by clicking the link
                        below:
                    </p>
                    <a href={url}>{url}</a>
                    <p>If you didn't register, please ignore this email.</p>
                </div>
            </>
        )
    } else {
        return (
            <>
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
                    <a href={url}>{url}</a>
                    <p>If you didn't request this, please ignore this email.</p>
                </div>
            </>
        )
    }
}
