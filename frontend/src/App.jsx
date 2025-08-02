import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { persistor, store } from './redux/store'
import { PersistGate } from 'redux-persist/integration/react'
import Home from './Home'
import Analytics from './components/Analytics'

const Vault = React.lazy(() => import('./components/Vault'))
const PasswordChange = React.lazy(() => import('./components/PasswordChange'))
const VerifyEmail = React.lazy(() => import('./components/VerifyEmail'))

function App() {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <Router>
                    <Analytics />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/vault" element={<Vault />} />
                        <Route
                            path="/verify-email/:uid/:token/"
                            element={<VerifyEmail />}
                        />
                        <Route
                            path="/password-change-confirm/:uidb64/:token/"
                            element={<PasswordChange />}
                        />
                    </Routes>
                </Router>
            </PersistGate>
        </Provider>
    )
}

export default App
