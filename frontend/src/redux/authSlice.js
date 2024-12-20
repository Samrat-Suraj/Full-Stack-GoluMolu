import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: "",
        suggestedUser: [],
        userProfileById: "",
        bookmarks: [],
        allUser: [],
        selectedUser: "",
        serachText : "",
        SearchHistory : [],
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
        },
        setSuggestedUser: (state, action) => {
            state.suggestedUser = action.payload
        },
        setUserProfileById: (state, action) => {
            state.userProfileById = action.payload
        },
        SetBookmarks: (state, action) => {
            state.bookmarks = action.payload
        },
        SetAllUser: (state, action) => {
            state.allUser = action.payload
        },
        setSelectedUser: (state, action) => {
            state.selectedUser = action.payload
        },
        setSerachText: (state, action) => {
            state.serachText = action.payload
        },
        setSerachHistory: (state, action) => {
            state.SearchHistory = action.payload
        },
    }
})

export const { setUser, setSuggestedUser, SetAllUser, SetBookmarks,setSerachText,setSerachHistory, setSelectedUser, setUserProfileById } = authSlice.actions
export default authSlice.reducer