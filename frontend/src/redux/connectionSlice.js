import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    connected: false,
}

const connectSlice = createSlice({
    name: 'connect',
    initialState,
    reducers: {
        setConnect(state) {
            state.connected = true
        },
    },
})

export const { setConnect } = connectSlice.actions
export default connectSlice.reducer
