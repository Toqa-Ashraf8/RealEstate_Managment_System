import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios';
import { variables } from '../variables';
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
    initialClientData:{},
    bookingClients: [],
    nationalidImage: "",
    checkImage: "",
    savedData: "",
    InstallmentInformation: { TotalAmount: 0, DownPayment: 0, FirstInstallmentDate: "", InstallmentYears: "-1" },
    InstallmentDetails:[],
    paymentModal:false,
    paymentType:{PaymentType:"",CheckImage:""},
    installmentCheckImageName:"",
    rIndex:-1,
    successSaveBookingData:false,
    successSaveInstallmentData:false,
    successUpdate:false,
    bookingClientIndex:-1,
    reservedClients:[],
    reserved:-1,
    isRevertPaymentModalOpen:false,
    selectedInstallmentrow:-1,
    isRevertPaymentModalOpen: false,
    selectedDeleteIndex: -1,
   
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
export const getreservedClients = createAsyncThunk("getreservedClients/booking", async () => {
    const resp = await axios.get(variables.URL_API_B + "GetReservedClients")
        .then((res) => res.data);
    return resp;
})
export const getreservedClientsByID = createAsyncThunk("getreservedClientsByID/booking", async (id) => {
    const resp = await axios.post(variables.URL_API_B + "GetReservedClients_byID?id="+id)
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
        calculatenewDownPayment:(state,action)=>{
            const negoiationPrice = action.payload.total;
            state.InstallmentInformation.TotalAmount = negoiationPrice;
             const NewdownpaymentBeforeReservation = state.InstallmentInformation.TotalAmount - action.payload.newReservationAmount;
             state.InstallmentInformation.DownPayment = NewdownpaymentBeforeReservation * (25 / 100);
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
        reservedOrnot:(state,action)=>{
            state.reserved=action.payload;
        },
       updateDownPaymentManual: (state, action) => {
            state.InstallmentInformation = {
                ...state.InstallmentInformation,
                DownPayment: action.payload
            };
        },
        GetBookngClient:(state,action)=>{
            state.initialClientData=action.payload;    
        },
        
        toggleRevertPymentModal:(state,action)=>{
            state.isRevertPaymentModalOpen=action.payload;
        },
         setPendingPayment: (state, action) => {
        const {index,isEdit} = action.payload;
        state.selectedInstallmentrow=index;
        if(isEdit===1){
            const rowData = state.InstallmentDetails[index];
            state.paymentType = {
            PaymentType: rowData.PaymentType || "",
            CheckImage: rowData.CheckImage || ""
         };
        }
      
        else {
          state.paymentType = { PaymentType: "", CheckImage: "" };
         }
            
        },
        confirmpaidStatus: (state) => {
        const index = state.selectedInstallmentrow;
        if (index !== -1) {
         state.InstallmentDetails[index] = {
            ...state.InstallmentDetails[index],
            Paid: 1, 
            PaymentType: state.paymentType.PaymentType,
            CheckImage: state.paymentType.CheckImage
        };
          state.selectedInstallmentrow = -1;
        }
         state.paymentModal = false; 
        },
        openRevertModal:(state,action)=>{
             state.selectedDeleteIndex=action.payload;
            state.isRevertPaymentModalOpen=true;
        },
       
        confirmRevertPayment: (state) => {
        const index = state.selectedDeleteIndex;
         if (index !== -1) {
        state.InstallmentDetails[index] = {
            ...state.InstallmentDetails[index],
            Paid: 0,
            PaymentType: "",
            CheckImage: ""
        };
         state.isRevertPaymentModalOpen = false;
         state.selectedDeleteIndex = -1;
       }
      },

    },
    extraReducers: (builder) => {
        builder
            .addCase(FillClientData.fulfilled, (state, action) => {
              state.initialClientData= action.payload[0];
              
            })         
            .addCase(saveNationalidImage.fulfilled, (state, action) => {
                state.nationalidImage = action.payload;
            })       
            .addCase(saveChecksImages.fulfilled, (state, action) => {
                state.checkImage = action.payload;
            })
       
            .addCase(generateInstallments.fulfilled, (state, action) => {
                state.InstallmentDetails = action.payload;
            })        
            .addCase(saveinstallmentCheck.fulfilled, (state, action) => {
                state.installmentCheckImageName = action.payload;

            })        
            .addCase(saveBookingandInstallment.fulfilled, (state, action) => {
                state.bookingClient.BookingID = action.payload.booking_id;
                state.successSaveBookingData=action.payload.saved_m;
                state.successSaveInstallmentData=action.payload.saved_d;
            })
            .addCase(changetoReserved.fulfilled, (state, action) => {
                state.loading = false;
            })
         
            .addCase(getreservedClients.fulfilled, (state, action) => {
                state.reservedClients=action.payload;
            })
            .addCase(getreservedClientsByID.fulfilled, (state, action) => {
                state.InstallmentInformation=action.payload.installmentdata[0];
                state.bookingClient=action.payload.clientdt[0];
                state.InstallmentDetails=action.payload.installmentdt;
            })  
    }
})
export const {
    GetClientDataForbooking, 
    ChangevaluesOfBookingClient, 
    clearInputs, 
    caluclateDownPayment,
    getInstallmentData,
    showPaymentModal,
    getPaymentModalvalues,
    clearpaymentModal,
    reservedOrnot,
    updateDownPaymentManual,
    calculatenewDownPayment,
    GetBookngClient,
    setIndexofInstallmentRow,
    toggleRevertPymentModal,
    setPendingPayment,
    confirmpaidStatus,
    openRevertModal,
    confirmRevertPayment
 
} = bookingSlice.actions;
const bookingReducer = bookingSlice.reducer;
export default bookingReducer;