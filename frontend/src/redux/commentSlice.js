import { createSlice } from "@reduxjs/toolkit";

const commentSlice = createSlice({
    name: "comment",
    initialState: {
        allComment: []
    },
    reducers: {
        setAllComment: (state, action) => {
            state.allComment = action.payload
        }
    }
})

export const { setAllComment } = commentSlice.actions
export default commentSlice.reducer