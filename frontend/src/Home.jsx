import {} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setScreen } from './redux/authSlice'
import HeaderBar from './components/HeaderBar'
import MenuBar from './components/MenuBar'
import SignIn from './components/SignIn'
import Vault from './components/Vault'
import Account from './components/Account'
import About from './components/About'
import useKeepBackendAwake from './hooks/useKeepBackendAwake'
import useInactivityLogout from './hooks/useInactivityLogout'
import useTokenTimeout from './hooks/useTokenTimeout'
import './styles/Home.scss'

export default function Home() {
    const screen = useSelector((state) => state.auth.screen)

    const dispatch = useDispatch()

    useKeepBackendAwake()
    useInactivityLogout()
    useTokenTimeout()

    const handleScreenChange = (newScreen) => {
        dispatch(setScreen(newScreen))
    }

    return (
        <>
            <HeaderBar />
            <MenuBar />
            {screen === 'home' && (
                <div className="home">
                    <div className="homeContainer">
                        <h1>Secure Your Digital Life with Ease</h1>
                        <h2>
                            Keep your passwords safe, organized, and
                            accessible—anytime, anywhere.
                        </h2>
                        <h3>Your Passwords. Protected. Simplified. Trusted.</h3>
                        <button onClick={() => handleScreenChange('signin')}>
                            Get started now
                        </button>
                    </div>
                </div>
            )}
            {screen === 'signin' && <SignIn />}
            {screen === 'vault' && <Vault />}
            {screen === 'account' && <Account />}
            {screen === 'about' && <About />}
        </>
    )
}
