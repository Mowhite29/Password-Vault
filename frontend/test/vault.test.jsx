import React from 'react'
import { render, screen, cleanup } from '@testing-library/react'
import { describe, it, expect, afterEach } from 'vitest'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import Vault from '../src/components/Vault'
import { mockState } from './mocks/mockState'

import '@testing-library/jest-dom'

const store = configureStore({
    reducer: () => mockState,
})

afterEach(cleanup)

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
})
