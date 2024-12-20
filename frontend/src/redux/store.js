import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice" 
import postSlice from "./postSlice"
import notificationSlice from "./notificationSlice"
import commentSlice from "./commentSlice"
import chatSlice from "./chatSlice"
import socketSlice from "./socketSlice"
import statusSlice from "./statusSlice"

import {
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'


const persistConfig = {
    key: 'root',
    version: 1,
    storage,
}

const rootReducer = combineReducers({
    auth: authSlice,
    post : postSlice,
    notification : notificationSlice,
    comment : commentSlice,
    chat : chatSlice,
    socket : socketSlice,
    status : statusSlice
})

const persistedReducer = persistReducer(persistConfig, rootReducer)
const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
})



// reducer: {
//     auth : authSlice
// }

export default store