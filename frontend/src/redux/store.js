import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import authReducer from './authSlice'
import connectReducer from './connectionSlice'
import waiverReducer from './waiverSlice'

const persistAuthConfig = {
    key: 'auth',
    storage,
}
const persistWaiverConfig = {
    key: 'waiver',
    storage,
}

const persistedAuthReducer = persistReducer(persistAuthConfig, authReducer)
const persistedWaiverReducer = persistReducer(
    persistWaiverConfig,
    waiverReducer
)

export const store = configureStore({
    reducer: {
        auth: persistedAuthReducer,
        connect: connectReducer,
        waiver: persistedWaiverReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }),
})

export const persistor = persistStore(store)
