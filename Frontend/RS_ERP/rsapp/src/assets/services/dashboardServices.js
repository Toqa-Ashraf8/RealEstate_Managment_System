import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { variables } from "../variables";

export const fetchProjectsUnitsStats=createAsyncThunk("fetchProjectsUnitsStats/dashboard",
    async()=>{
        const resp=await axios.get(variables.DASHBOARD_API+"GetProjectsUnitsStats")
        .then((res)=>res.data);
        return resp;
})  

export const fetchMonthlyReservations=createAsyncThunk("fetchMonthlyReservations/dashboard",
    async()=>{
        const resp=await axios.get(variables.DASHBOARD_API+"GetDailyStats")
        .then((res)=>res.data);
        return resp;
}) 
