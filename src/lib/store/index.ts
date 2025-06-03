import { configureStore } from '@reduxjs/toolkit'
import { userAuthapi } from './api'
import documentReducer from './slice/documents'
import archiveReducer from './slice/archive'

export const store = () => {
  return configureStore({
    reducer: {
      [userAuthapi.reducerPath]: userAuthapi.reducer,
      documents: documentReducer,
      archive: archiveReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(userAuthapi.middleware),
  })
}

export type AppStore = ReturnType<typeof store>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']