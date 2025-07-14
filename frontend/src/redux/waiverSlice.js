import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    agreed: false,
}

const waiverSlice = createSlice({
    name: 'waiver',
    initialState,
    reducers: {
        setWaiver(state) {
            state.agreed = true
        },
    },
})

export const { setWaiver } = waiverSlice.actions
export default waiverSlice.reducer
