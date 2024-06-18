import { createSlice } from "@reduxjs/toolkit";

export interface authTokenState {
    token: string;
  }
export interface profileState {
    name: string;
    email: string;
    profileImage: string;
    phoneNumber: string;
    userId: string;
  }

const initial ={
    isLoggedIn:false,
    authProfile:null,
    authToken:null,
}


const authSlice = createSlice({
    name:"auth",
    initialState:initial,
    reducers:{
        setIsLoggedIn:(state,action)=>{
            state.isLoggedIn = action.payload;
        },
        setAuthProfile:(state,action)=>{
            state.authProfile = action.payload;
        },
        setAuthToken:(state,action)=>{
            state.authToken = action.payload;
        },
    }
});

export default authSlice.reducer;

export const{setAuthProfile, setIsLoggedIn, setAuthToken} = authSlice.actions
export type RootState = ReturnType<typeof authSlice.reducer>;