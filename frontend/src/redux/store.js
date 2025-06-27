import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import connectReducer from './connectionSlice'

export default configureStore({
    reducer: {
        auth: authReducer,
        connect: connectReducer,
    },
})
