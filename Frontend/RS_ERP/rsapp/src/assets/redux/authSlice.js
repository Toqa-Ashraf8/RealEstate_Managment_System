import {createSlice}from '@reduxjs/toolkit'
import { loginUser, registerUsers } from '../../services/authService';

const initialState={
    user:{},
    token:sessionStorage.getItem('token'),
    role: sessionStorage.getItem('userRole'),
    userName:sessionStorage.getItem('name'),
    isLoggedin:false
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
        },
        confirmLoggingin:(state,action)=>{
            state.isLoggedin=action.payload;
            if(state.isLoggedin===true){
              state.token="";
              state.user=initialState.user;
            }
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
             state.userName=action.payload.user;
             sessionStorage.setItem('name',action.payload.user);
        })
        .addCase(loginUser.fulfilled,(state,action)=>{ 
            state.token = action.payload.token;
            state.role = action.payload.role;
            state.userName=action.payload.user;
            sessionStorage.setItem('token', action.payload.token);
            sessionStorage.setItem('userRole', action.payload.role);
            sessionStorage.setItem('name',action.payload.user);

        })
    }
})
export const{setUserData,resetUserForm,confirmLoggingin}=authSlice.actions;
const authReducer=authSlice.reducer;
export default authReducer;