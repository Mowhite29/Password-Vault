import {} from 'react'
import { useSelector } from 'react-redux'
import HeaderBar from './components/HeaderBar'
import MenuBar from './components/MenuBar'
import SignIn from './components/SignIn'
import Vault from './components/Vault'
import Account from './components/Account'
import useKeepBackendAwake from './hooks/useKeepBackendAwake'
import useInactivityLogout from './hooks/useInactivityLogout'
import useTokenTimeout from './hooks/useTokenTimeout'
import './styles/Home.scss'

export default function Home() {
    const screen = useSelector((state) => state.auth.screen)

    useKeepBackendAwake()
    useInactivityLogout()
    useTokenTimeout()

    return (
        <>
            <HeaderBar />
            <MenuBar />
            <div
                className="home"
                style={{
                    display: screen === 'home' ? 'flex' : 'none',
                }}
            ></div>
            {screen === 'signin' && <SignIn />}
            {screen === 'vault' && <Vault />}
            {screen === 'account' && <Account />}
        </>
    )
}
