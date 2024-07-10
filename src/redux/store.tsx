import storage from "redux-persist/lib/storage";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from "redux-persist";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import counterReducer from "./counter";
import userReducer from "./userSlice";
import chatReducer from "./chatSlice";
import cartReducer from "./cart"
import wishListReducer from "./wishListSlice"
import notificationReducer from "./notificationSlice";
import { TypedUseSelectorHook, useSelector } from "react-redux";

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: [
    "isLoggedIn",
    "authRole",
    "authToken",
    "authProfile",
    "authUserId",
  ],
};

const rootReducer = combineReducers({
  chat: chatReducer,
  counter: counterReducer,
  auth: persistReducer(authPersistConfig, authReducer),
  user: userReducer,
  cart:cartReducer,
  wishList: wishListReducer,
  notification: notificationReducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export { store, persistor };
