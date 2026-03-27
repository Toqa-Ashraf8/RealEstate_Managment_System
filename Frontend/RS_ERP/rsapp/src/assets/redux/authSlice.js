import {createSlice}from '@reduxjs/toolkit'
import { loginUser, registerUsers } from '../services/authService';

const initialState={
    user:{},
    token:sessionStorage.getItem('token'),
    role: sessionStorage.getItem('userRole')
}
const authSlice=createSlice({
    name:'auth',
    initialState,
    reducers:{
        setUserData:(state,action)=>{
            state.user={...state.user,...action.payload};
        },
        resetUserForm:(state,action)=>{
            state.user=initialState.user;
        }
       
    },
    extraReducers:(builder)=>{
        builder
        .addCase(registerUsers.fulfilled,(state,action)=>{ 
            if(action.payload.token){
                sessionStorage.setItem('token',action.payload.token) 
                state.token=action.payload.token;
            }
             state.role=action.payload.role;
             sessionStorage.setItem('userRole', action.payload.role);
        })
        .addCase(loginUser.fulfilled,(state,action)=>{ 
            state.token = action.payload.token;
            state.role = action.payload.role;
            sessionStorage.setItem('token', action.payload.token);
            sessionStorage.setItem('userRole', action.payload.role);

        })
    }
})
export const{setUserData,resetUserForm}=authSlice.actions;
const authReducer=authSlice.reducer;
export default authReducer;