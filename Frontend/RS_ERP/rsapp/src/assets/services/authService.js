import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'
import {toast} from 'react-toastify'
import { variables } from "../variables";

export const registerUsers=createAsyncThunk("registerUsers/auth",async(data)=>{
    const resp=await axios.post(variables.AUTH_API+"Register",data)
    .then((res)=>res.data);
    return resp;
})
