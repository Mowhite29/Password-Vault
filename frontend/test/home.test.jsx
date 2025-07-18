import React from 'react'
import { render, screen, cleanup, waitFor } from '@testing-library/react'
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

describe('Home Component', () => {
    it('should render the Home component with default state', async () => {
        render(
            <Provider store={store}>
                <Home>
                    <HeaderBar />
                    <MenuBar />
                    <SignIn />
                </Home>
            </Provider>
        )
        await waitFor(
            () => {
                expect(screen.getByText(/Get started now/i)).toBeInTheDocument()
            },
            { timeout: 5000 }
        )
    })

    it('should render the HeaderBar component with default state', async () => {
        render(
            <Provider store={store}>
                <Home>
                    <HeaderBar />
                    <MenuBar />
                    <SignIn />
                </Home>
            </Provider>
        )
        await waitFor(
            () => {
                expect(
                    screen.getByText(
                        /DEMO PROJECT ONLY - DO NOT USE WITH REAL DATA./i
                    )
                ).toBeInTheDocument()
            },
            { timeout: 5000 }
        )
    })
})
