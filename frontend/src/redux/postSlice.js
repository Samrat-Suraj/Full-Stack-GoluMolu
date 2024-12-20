import { createSlice } from "@reduxjs/toolkit";


const postSlice = createSlice({
    name : "post",
    initialState : {
        allPost : [],
        selectedPost : "",
        postById : ""
    },
    reducers : {
        setAllPost : (state , action)=>{
            state.allPost = action.payload
        },
        setSelectedPost : (state , action)=>{
            state.selectedPost = action.payload
        },
        setPostById : (state , action)=>{
            state.postById = action.payload
        },
    }
})

export const {setAllPost , setSelectedPost , setPostById} = postSlice.actions
export default postSlice.reducer