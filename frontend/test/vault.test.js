/* eslint-disable */
import React from 'react'
import {render, screen, fireEvent, cleanup } from '@testing-library/react'
import { expect, assert } from 'chai'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import Vault from '../src/components/Vault'
import { mockState } from './mockState'

import '@testing-library/jest-dom'

const store = configureStore({
    reducer: () => mockState,
})

afterEach(cleanup)

describe('Vault Component', () => {
    it('should render the Vault component with default ststae', async () => {
        render(
            <Provider store={store} >
                <Vault />
            </Provider>
        )

        expect(screen.getByPlaceholderText(/search/i)).to.exist
        expect(screen.getByText(/Add new password/i)).to.exist
    })
})
