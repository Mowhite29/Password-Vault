import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import authReducer from './authSlice'
import connectReducer from './connectionSlice'
import waiverReducer from './waiverSlice'
import appearanceReducer from './appearanceSlice'

const persistAuthConfig = {
    key: 'auth',
    storage,
}
const persistWaiverConfig = {
    key: 'waiver',
    storage,
}

const persistAppearanceConfig = {
    key: 'appearance',
    storage,
}

const persistedAuthReducer = persistReducer(persistAuthConfig, authReducer)
const persistedWaiverReducer = persistReducer(persistWaiverConfig, waiverReducer)
const persistedAppearanceReducer = persistReducer(persistAppearanceConfig, appearanceReducer)

export const store = configureStore({
    reducer: {
        auth: persistedAuthReducer,
        connect: connectReducer,
        waiver: persistedWaiverReducer,
        appearance: persistedAppearanceReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }),
})

export const persistor = persistStore(store)
