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
            handleScreenChange('home')
            navigate('/')
        }
    }

    return (
        <>
            <button onClick={() => Verify()}>Verify email address</button>
        </>
    )
    
}
