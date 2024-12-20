import { createSlice } from "@reduxjs/toolkit";

const statusSlice = createSlice({
    name: "status",
    initialState: {
        myStatus: [],
        mutalStatus: []
    },
    reducers: {
        setMyStatus: (state, action) => {
            state.myStatus = action.payload
        },
        setMutalStatus: (state, action) => {
            state.mutalStatus = action.payload
        },
    }
})

export const { setMyStatus, setMutalStatus } = statusSlice.actions
export default statusSlice.reducer