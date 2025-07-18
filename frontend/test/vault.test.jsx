import React from 'react'
import { render, screen, cleanup, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, afterEach } from 'vitest'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import Vault from '../src/components/Vault'
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

describe('Vault Component', () => {
    it('should render the Vault component with default state', () => {
        render(
            <Provider store={store}>
                <Vault />
            </Provider>
        )

        expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument()
        expect(screen.getByText(/Add new password/i)).toBeInTheDocument()
    })

    it('should show new password menu when button is clicked', async () => {
        render(
            <Provider store={store}>
                <Vault />
            </Provider>
        )

        const newPasswordbutton = screen.getByText(/Add new password/i)
        await user.click(newPasswordbutton).then(() => {
            expect(screen.getByAltText(/website input/i)).toBeInTheDocument()
        })
    })

    it('should allow new password to be added using users own password', async () => {
        render(
            <Provider store={store}>
                <Vault />
            </Provider>
        )

        const newPasswordbutton = screen.getByText(/Add new password/i)
        await user.click(newPasswordbutton).then(async () => {
            await user.type(screen.getByAltText(/website input/i), 'google.com')
            await user.type(screen.getByAltText(/username input/i), 'testuser')
            await user.type(
                screen.getByAltText(/password input/i),
                'Secu43P455W0Rd'
            )
            const createButton = screen.getByRole('button', {
                name: /Add password/i,
            })
            await user.click(createButton)
            await waitFor(() => {
                expect(screen.queryByText(/website input/i)).toBeNull()
            })
        })
    })

    it('should allow new password to be added using generated password', async () => {
        render(
            <Provider store={store}>
                <Vault />
            </Provider>
        )

        const newPasswordbutton = screen.getByText(/Add new password/i)
        await user.click(newPasswordbutton).then(async () => {
            await user.type(screen.getByAltText(/website input/i), 'google.com')
            await user.type(screen.getByAltText(/username input/i), 'testuser')
            const generatePassword = screen.getByRole('button', {
                name: /generate password/i,
            })
            await user.click(generatePassword)
            const createButton = screen.getByRole('button', {
                name: /Add password/i,
            })
            await user.click(createButton)
            await waitFor(() => {
                expect(screen.queryByText(/website input/i)).toBeNull()
            })
        })
    })
})
