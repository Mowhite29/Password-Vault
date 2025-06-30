import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import authReducer from './authSlice'
import connectReducer from './connectionSlice'

const persistConfig = {
    key: 'root',
    storage,
}
const persistedAuthReducer = persistReducer(persistConfig, authReducer)
export const store = configureStore({
    reducer: {
        auth: persistedAuthReducer,
        connect: connectReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }),
})

export const persistor = persistStore(store)
