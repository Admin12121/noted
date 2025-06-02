import { configureStore } from '@reduxjs/toolkit'
import { userAuthapi } from './api'
import documentReducer from "./documentslice";

export const store = () =>{
  return  configureStore({
    reducer: {
      [userAuthapi.reducerPath]: userAuthapi.reducer,
      documents: documentReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(userAuthapi.middleware),
  })
}

export type AppStore = ReturnType<typeof store>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']