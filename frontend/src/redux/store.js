import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import connectReducer from './connectionSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        connect: connectReducer,
    },
})
