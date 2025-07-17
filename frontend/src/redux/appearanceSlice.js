import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    theme: '',
}

const appearanceSlice = createSlice({
    name: 'appearance',
    initialState,
    reducers: {
        setTheme(state, action) {
            state.theme = action.payload
        },
    },
})

export const { setTheme } = appearanceSlice.actions
export default appearanceSlice.reducer
