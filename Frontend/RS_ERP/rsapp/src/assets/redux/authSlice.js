import {createSlice}from '@reduxjs/toolkit'
import { registerUsers } from '../services/authService';

const initialState={
    user:{},
    tokenRegisterUser:sessionStorage.getItem('token')
}
const authSlice=createSlice({
    name:'auth',
    initialState,
    reducers:{
        setUserData:(state,action)=>{
            state.user={...state.user,...action.payload};
        }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(registerUsers.fulfilled,(state,action)=>{ 
            if(action.payload.token){
                sessionStorage.setItem('token',action.payload.token)
            }
            state.tokenRegisterUser=action.payload.token;
        })
    }
})
export const{setUserData}=authSlice.actions;
const authReducer=authSlice.reducer;
export default authReducer;