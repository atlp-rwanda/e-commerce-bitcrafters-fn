import { configureStore } from "@reduxjs/toolkit";
import counterReducer from './counter'
import authSlice from "./authSlice";

export default configureStore({
    reducer:{
    counter: counterReducer,
    auth: authSlice
    }

})
