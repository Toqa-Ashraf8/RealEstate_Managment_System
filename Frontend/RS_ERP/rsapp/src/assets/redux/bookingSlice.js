import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios';
import { variables } from '../variables';
import { act } from 'react';
const initialState = {
    loading: false,
    error: false,
    bookRowIndex: "",
    bookingClient: {
        BookingID: 0,
        NationalID: "",
        NationalIdImagePath: "",
        SecondaryPhone: "",
        Address: "",
        Job:"",
        ReservationAmount: 0,
        PaymentMethod: "-1",
        CheckImagePath: ""
    },
    bookingClients: [],
    nationalidImage: "",
    checkImage: "",
    savedData: "",
    InstallmentInformation: { TotalAmount: 0, DownPayment: 0, FirstInstallmentDate: "", InstallmentYears: "-1" },
    InstallmentDetails:[],
    paymentModal:false,
    paymentType:{PaymentType:"",CheckImage:""},
    installmentCheckImageName:"",
    paymentRowIndex:-1,
    paid:0,
    successSaveBookingData:false,
    successSaveInstallmentData:false,
    successUpdate:false,
    bookingClientIndex:-1,
   
}
//*********************************************************************** */
export const FillClientData = createAsyncThunk("FillClientData/booking", async (Clientdata) => {
    const resp = await axios.post(variables.URL_API_B + "GetBookingClientData", Clientdata)
        .then((res) => res.data);
    return resp;
})
export const saveNationalidImage = createAsyncThunk("saveNationalidImage/booking", async (formData) => {
    const resp = await axios.post(variables.URL_API_B + "SaveNationalID_Images", formData)
        .then((res) => res.data);
    return resp;
})
export const saveChecksImages = createAsyncThunk("saveChecksImages/booking", async (formData_) => {
    const resp = await axios.post(variables.URL_API_B + "SaveChecks_Images", formData_)
        .then((res) => res.data);
    return resp;
})

export const generateInstallments = createAsyncThunk("generateInstallments/booking", async (request) => {
    const resp = await axios.post(variables.URL_API_B + "GenerateInstallments", request)
        .then((res) => res.data);
    return resp;
})
export const saveinstallmentCheck = createAsyncThunk("saveinstallmentCheck/booking", async (formData) => {
    const resp = await axios.post(variables.URL_API_B + "SaveInstallmentChecks_Images", formData)
        .then((res) => res.data);
    return resp;
})
export const saveBookingandInstallment = createAsyncThunk("saveBookingandInstallment/booking", async (sentdata) => {
    const resp = await axios.post(variables.URL_API_B + "SaveBookingClient", sentdata)
        .then((res) => res.data);
    return resp;
})
export const changetoReserved = createAsyncThunk("changetoReserved/booking", async (row) => {
    const resp = await axios.post(variables.URL_API_B + "ChangeToReserved", row)
        .then((res) => res.data);
    return resp;
})
const bookingSlice = createSlice({
    name: 'booking',
    initialState,
    reducers: {
        GetClientDataForbooking: (state, action) => {
            state.bookingClient = { ...state.bookingClient, ...action.payload };
        },
        ChangevaluesOfBookingClient: (state, action) => {
            state.bookingClient = { ...state.bookingClient, ...action.payload };
        },
        clearInputs: (state) => {
            state.bookingClient = initialState.bookingClient;
            state.InstallmentInformation = initialState.InstallmentInformation;
            state.checkImage = "",
            state.nationalidImage = "";
        },
        caluclateDownPayment: (state, action) => {
            if (state.bookingClient.ReservationAmount > 0) {
                const negoiationPrice = action.payload;
                state.InstallmentInformation.TotalAmount = negoiationPrice;
                const downpaymentBeforeReservation = state.InstallmentInformation.TotalAmount - state.bookingClient.ReservationAmount;
                state.InstallmentInformation.DownPayment = downpaymentBeforeReservation * (25 / 100);
            }
        },
        getInstallmentData: (state, action) => {
            state.InstallmentInformation = { ...state.InstallmentInformation, ...action.payload };
        },
       
        showPaymentModal:(state,action)=>
        {
            state.paymentModal=action.payload;
        },
        getPaymentModalvalues:(state,action)=>{
            state.paymentType={...state.paymentType,...action.payload}
        },
        clearpaymentModal:(state)=>{
            state.paymentType={PaymentType:"",CheckImage:""};
            state.installmentCheckImageName="";
        },
        getInstallmentIndexRow:(state,action)=>{
            state.paymentRowIndex=action.payload;
        },
        changepaymentStatus:(state,action)=>{
            if(state.paymentType.PaymentType!==""){
              state.InstallmentDetails[state.paymentRowIndex].Paid=1;  
            }
            state.paymentModal=false;
        },
       
       
    },
    extraReducers: (builder) => {
        builder
            .addCase(FillClientData.pending, (state) => {
                state.loading = true;
            })
            .addCase(FillClientData.fulfilled, (state, action) => {
                state.loading = false;
                state.bookingClients = action.payload;
            })
            .addCase(FillClientData.rejected, (state) => {
                state.loading = false;
                state.error = true;
            })
            //-------------------------------------------------------------
            .addCase(saveNationalidImage.pending, (state) => {
                state.loading = true;
            })
            .addCase(saveNationalidImage.fulfilled, (state, action) => {
                state.loading = false;
                state.nationalidImage = action.payload;
            })
            .addCase(saveNationalidImage.rejected, (state) => {
                state.loading = false;
                state.error = true;
            })
            //-------------------------------------------------------------
            .addCase(saveChecksImages.pending, (state) => {
                state.loading = true;
            })
            .addCase(saveChecksImages.fulfilled, (state, action) => {
                state.loading = false;
                state.checkImage = action.payload;
            })
            .addCase(saveChecksImages.rejected, (state) => {
                state.loading = false;
                state.error = true;
            })
           
             //-------------------------------------------------------------
            .addCase(generateInstallments.pending, (state) => {
                state.loading = true;
            })
            .addCase(generateInstallments.fulfilled, (state, action) => {
                state.loading = false;
                state.InstallmentDetails = action.payload;
               

            })
            .addCase(generateInstallments.rejected, (state) => {
                state.loading = false;
                state.error = true;
            })
            //-------------------------------------------------------------
            .addCase(saveinstallmentCheck.pending, (state) => {
                state.loading = true;
            })
            .addCase(saveinstallmentCheck.fulfilled, (state, action) => {
                state.loading = false;
                state.installmentCheckImageName = action.payload;

            })
            .addCase(saveinstallmentCheck.rejected, (state) => {
                state.loading = false;
                state.error = true;
            })
             //-------------------------------------------------------------
            .addCase(saveBookingandInstallment.pending, (state) => {
                state.loading = true;
            })
            .addCase(saveBookingandInstallment.fulfilled, (state, action) => {
                state.loading = false;
                state.bookingClient.BookingID = action.payload.booking_id;
                state.successSaveBookingData=action.payload.saved_m;
                state.successSaveInstallmentData=action.payload.saved_d;

            })
            .addCase(saveBookingandInstallment.rejected, (state) => {
                state.loading = false;
                state.error = true;
            })
             //-------------------------------------------------------------
            .addCase(changetoReserved.pending, (state) => {
                state.loading = true;
            })
            .addCase(changetoReserved.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(changetoReserved.rejected, (state) => {
                state.loading = false;
                state.error = true;
            })

    }
})
export const {GetClientDataForbooking, ChangevaluesOfBookingClient, clearInputs, caluclateDownPayment,
    getInstallmentData,showPaymentModal,getPaymentModalvalues,changepaymentStatus,getInstallmentIndexRow,
    clearpaymentModal
} = bookingSlice.actions;
const bookingReducer = bookingSlice.reducer;
export default bookingReducer;