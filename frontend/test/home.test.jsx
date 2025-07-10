import React from 'react'
import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, afterEach } from 'vitest'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import Home from '../src/Home'
import HeaderBar from '../src/components/HeaderBar'
import MenuBar from '../src/components/MenuBar'
import SignIn from '../src/components/SignIn'
import '@testing-library/jest-dom'
import authReducer from '../src/redux/authSlice'
import connectReducer from '../src/redux/connectionSlice'

const store = configureStore({
    reducer: {
        auth: authReducer,
        connect: connectReducer,
    },
})

afterEach(cleanup)

const user = userEvent.setup()

describe('Home Component', () => {
    it('should render the Home component with default state', () => {
        render(
            <Provider store={store}>
                <Home>
                    <HeaderBar />
                    <MenuBar />
                    <SignIn />
                </Home>
            </Provider>
        )

        expect(screen.getByText(/Get started now/i)).toBeInTheDocument()
    })

    it('should render the HeaderBar component with default state', () => {
        render(
            <Provider store={store}>
                <Home>
                    <HeaderBar />
                    <MenuBar />
                    <SignIn />
                </Home>
            </Provider>
        )

        expect(
            screen.getByText(/DEMO PROJECT ONLY - DO NOT USE WITH REAL DATA./i)
        ).toBeInTheDocument()
    })

    it('should render the MenuBar component with default state', async () => {
        render(
            <Provider store={store}>
                <Home>
                    <HeaderBar />
                    <MenuBar />
                    <SignIn />
                </Home>
            </Provider>
        )

        expect(screen.getByText(/Password Vault/i)).toBeInTheDocument()
        expect(screen.getByText(/open menu/i)).toBeInTheDocument()
    })

    it('MenuBar component should allow navigation', async () => {
        render(
            <Provider store={store}>
                <Home>
                    <HeaderBar />
                    <MenuBar />
                    <SignIn />
                </Home>
            </Provider>
        )

        const openMenuButton = await screen.findByRole('button', {
            name: /open menu/i,
        })
        await user.click(openMenuButton)

        const signInButton = await screen.findByRole('button', {
            name: /sign in/i,
        })
        await user
            .click(signInButton)
            .then(expect(screen.getByText(/Sign in/i)).toBeInTheDocument())
    })
})
