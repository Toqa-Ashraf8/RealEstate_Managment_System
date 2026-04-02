import { createSlice } from "@reduxjs/toolkit";
import { fetchAllClients, fetchClientFullDetails } from "../../services/clientsProfileService";

const initialState={
    clientData:[],
    bookingData:JSON.parse(localStorage.getItem('bookingDetails')) || null,
    bookedUnitsData:JSON.parse(localStorage.getItem('bookedUnits')) || null
}
const clientsProfile=createSlice({
    name:'clientsProfile',
    initialState,
    extraReducers:(builder)=>{
    builder.
    addCase(fetchAllClients.fulfilled,(state,action)=>{
        state.clientData=action.payload;
    })
    .addCase(fetchClientFullDetails.fulfilled,(state,action)=>{
        localStorage.setItem('bookingDetails',JSON.stringify(action.payload.bookingdt));
        state.bookingData=action.payload.bookingdt;
        /* localStorage.setItem('bookedUnits',JSON.stringify(action.payload.unitdt));
        state.bookedUnitsData=action.payload.unitdt; */
    })
   }
})
const clientProfileReducer=clientsProfile.reducer;
export default clientProfileReducer;
