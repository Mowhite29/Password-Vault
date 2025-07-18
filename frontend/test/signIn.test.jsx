import React from 'react'
import { render, screen, cleanup, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, afterEach } from 'vitest'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import SignIn from '../src/components/SignIn'
import '@testing-library/jest-dom'
import authReducer from '../src/redux/authSlice'
import connectReducer from '../src/redux/connectionSlice'
import waiverReducer from '../src/redux/waiverSlice'
import appearanceReducer from '../src/redux/appearanceSlice'

const store = configureStore({
    reducer: {
        auth: authReducer,
        connect: connectReducer,
        waiver: waiverReducer,
        appearance: appearanceReducer,
    },
})

afterEach(cleanup)

const user = userEvent.setup()

describe('SignIn Component', () => {
    it('should render the SignIn component with default state', async () => {
        render(
            <Provider store={store}>
                <SignIn />
            </Provider>
        )

        expect(
            screen.getByAltText(/sign in username input/i)
        ).toBeInTheDocument()
        expect(
            screen.getByAltText(/sign in password input/i)
        ).toBeInTheDocument()
        expect(
            screen.getByAltText(/create account username input/i)
        ).toBeInTheDocument()
        expect(
            screen.getByAltText(/create account password input/i)
        ).toBeInTheDocument()
    })

    it('should allow sign in', async () => {
        render(
            <Provider store={store}>
                <SignIn />
            </Provider>
        )

        await user.type(
            screen.getByAltText(/sign in username input/i),
            'user@email.com'
        )
        await user.type(
            screen.getByAltText(/sign in password input/i),
            'password'
        )
        const signInButton = screen.getByRole('button', { name: /sign in/i })
        await user.click(signInButton)

        await waitFor(() => {
            expect(screen.getByAltText(/totp input/i)).toBeInTheDocument()
        })
    })
    it('should allow account creation', async () => {
        render(
            <Provider store={store}>
                <SignIn />
            </Provider>
        )

        await user.type(
            screen.getByAltText(/create account username input/i),
            'user@email.com'
        )
        await user.type(
            screen.getByAltText(/create account password input/i),
            'password'
        )
        const signInButton = screen.getByRole('button', {
            name: /create account/i,
        })
        await user.click(signInButton)

        await waitFor(() => {
            expect(
                screen.getByAltText(/sign in username input/i)
            ).toBeInTheDocument()
        })
    })
    it('should allow successful totp entry', async () => {
        render(
            <Provider store={store}>
                <SignIn />
            </Provider>
        )

        await user.type(
            screen.getByAltText(/sign in username input/i),
            'user@email.com'
        )
        await user.type(
            screen.getByAltText(/sign in password input/i),
            'password'
        )
        const signInButton = screen.getByRole('button', { name: /sign in/i })
        await user.click(signInButton)

        const totpInput = screen.getByAltText(/totp input/i)
        await user.type(totpInput, '123456')
        const totpButton = screen.getByRole('button', {
            name: /Enter/i,
        })
        await user.click(totpButton)

        await waitFor(() => {
            expect(store.getState().auth.signedIn).toBe(true)
        })
    })
})
