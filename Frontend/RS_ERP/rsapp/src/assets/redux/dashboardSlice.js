import { createSlice } from "@reduxjs/toolkit";
import { fetchMonthlyReservations, fetchProjectsUnitsStats } from "../services/dashboardServices";

const initialState={
    projectsUnitsCounts:[],
    reservationstatistics:[]
}
const dashboardSlice=createSlice({
    name:'dashboard',
    initialState,
    reducers:{
        changvl:(state,action)=>{
            state.unit={...state.unit,...action.payload};
        }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(fetchProjectsUnitsStats.fulfilled,(state,action)=>{
            state.projectsUnitsCounts=action.payload;
        })
        .addCase(fetchMonthlyReservations.fulfilled,(state,action)=>{
            state.reservationstatistics=action.payload;
        })
    }
})
export const {changvl}=dashboardSlice.actions;
const dashReducer=dashboardSlice.reducer;
export default dashReducer;