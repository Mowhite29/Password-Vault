import {} from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor, store } from './redux/store'
import Home from './Home'
import PasswordChange from './components/PasswordChange'
import Vault from './components/Vault'
import VerifyEmail from './components/VerifyEmail'

function App() {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <Router>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route
                            path="/verify-email/:uid/:token/"
                            element={<VerifyEmail />}
                        />
                        <Route
                            path="/password-change-confirm/:uidb64/:token"
                            element={<PasswordChange />}
                        />
                    </Routes>
                </Router>
            </PersistGate>
        </Provider>
    )
}

export default App
