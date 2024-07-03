import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import counterReducer from "./counter";
import userReducer from "./userSlice";
import { TypedUseSelectorHook, useSelector } from "react-redux";

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["isLoggedIn", "authRole", "authToken", "authProfile"],
};

const rootReducer = combineReducers({
  counter: counterReducer,
  auth: persistReducer(authPersistConfig, authReducer),
  user: userReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export { store, persistor };
