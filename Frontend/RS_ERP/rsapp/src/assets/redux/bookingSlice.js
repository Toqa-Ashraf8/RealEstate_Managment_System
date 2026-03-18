import {createSlice,createAsyncThunk} from '@reduxjs/toolkit'
import axios from 'axios';
import { variables } from '../variables';
const initialState={
    loading:false,
    error:false,
    bookRowIndex:"",
    bookingClient:{BookingID:0,
                   NationalID:"",
                   NationalIdImagePath:"",
                   SecondaryPhone:"",
                   Address:"",
                   ReservationAmount:0,
                   PaymentMethod:"-1",
                   InstallmentYears:"-1",
                   CheckImagePath:""},
    bookingClients:[],
    nationalidImage:"",
    checkImage:"",
    savedData:""
}
//*********************************************************************** */
export const FillClientData=createAsyncThunk("FillClientData/booking",async(Clientdata)=>{
    const resp=await axios.post(variables.URL_API_B+"GetBookingClientData",Clientdata)
    .then((res)=>res.data);
    return resp;
})
export const saveNationalidImage=createAsyncThunk("saveNationalidImage/booking",async(formData)=>{
    const resp=await axios.post(variables.URL_API_B+"SaveNationalID_Images",formData)
    .then((res)=>res.data);
    return resp;
})
export const saveChecksImages=createAsyncThunk("saveChecksImages/booking",async(formData_)=>{
    const resp=await axios.post(variables.URL_API_B+"SaveChecks_Images",formData_)
    .then((res)=>res.data);
    return resp;
})
export const savebookingClient=createAsyncThunk("savebookingClient/booking",async(parms)=>{
    const resp=await axios.post(variables.URL_API_B+"SaveBookingClient",parms)
    .then((res)=>res.data);
    return resp;
})
const bookingSlice=createSlice({
    name:'booking',
    initialState,
    reducers:{
     GetClientDataForbooking:(state,action)=>{
        state.bookingClient={...state.bookingClient,...action.payload};
    },
    ChangevaluesOfBookingClient:(state,action)=>{
        state.bookingClient={...state.bookingClient,...action.payload};
    },
    clearInputs:(state)=>{
        state.bookingClient=initialState.bookingClient;
        state.checkImage="",
        state.nationalidImage="";
    }
    },
    extraReducers:(builder)=>{
    builder
    .addCase(FillClientData.pending,(state)=>{
        state.loading=true;
    })
     .addCase(FillClientData.fulfilled,(state,action)=>{
        state.loading=false;
        state.bookingClients=action.payload;
    })
    .addCase(FillClientData.rejected,(state)=>{
        state.loading=false;
        state.error=true;
    })
    //-------------------------------------------------------------
    .addCase(saveNationalidImage.pending,(state)=>{
        state.loading=true;
    })
     .addCase(saveNationalidImage.fulfilled,(state,action)=>{
        state.loading=false;
        state.nationalidImage=action.payload;
    })
    .addCase(saveNationalidImage.rejected,(state)=>{
        state.loading=false;
        state.error=true;
    })
    //-------------------------------------------------------------
     .addCase(saveChecksImages.pending,(state)=>{
        state.loading=true;
    })
     .addCase(saveChecksImages.fulfilled,(state,action)=>{
        state.loading=false;
        state.checkImage=action.payload;
    })
    .addCase(saveChecksImages.rejected,(state)=>{
        state.loading=false;
        state.error=true;
    })
    //-------------------------------------------------------------
     .addCase(savebookingClient.pending,(state)=>{
        state.loading=true;
    })
     .addCase(savebookingClient.fulfilled,(state,action)=>{
        state.loading=false;
        state.bookingClient.BookingID=action.payload.id;
        state.savedData=action.payload.saved;
    })
    .addCase(savebookingClient.rejected,(state)=>{
        state.loading=false;
        state.error=true;
    })
   
}
})
export const {GetClientDataForbooking,ChangevaluesOfBookingClient,clearInputs}=bookingSlice.actions;
const bookingReducer=bookingSlice.reducer;
export default bookingReducer;