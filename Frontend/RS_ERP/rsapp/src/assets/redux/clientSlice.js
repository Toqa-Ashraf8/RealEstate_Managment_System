import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { variables } from "../variables";
import { toast } from "react-toastify";
const initialState = {
    client: { ClientID: 0, ClientName: "", PhoneNumber: "", ClientStatus: "-1",Notes: ""},
    clients: [],
    projects: [],
    negotiation:{serialCode:"", ProjectName:"-1",Unit:"-1",OriginalPrice:"",NegotiationPrice:"",DiscountAmount:"",
                 NegotiationStatus:"في انتظار موافقة الإدارة",
                 NegotiationDate:new Date().toISOString().split('T')[0],checkedByAdmin:0,
                 Reserved:0},
    negotiations:[],
    rowIndex:-1,
    units: [],
    showNeg:false,
    loading: false,
    error: false,
    totalP:{},
    serialModal:"",
    deletedall:false,
    showdModal:false,
    searchclientsMdl:false,
    deleteNegoModal:false,
    deleteRowIndex:"",
    
}
//*************************************************************************************/
export const getprojects = createAsyncThunk("getprojects/clients", async () => {
    const resp = await axios.get(variables.URL_API_C + "GetProjects")
        .then((res) => res.data);
    return resp;
})
export const getunitsByproject = createAsyncThunk("getunitsByproject/clients", async (projectname) => {
    const resp = await axios.post(variables.URL_API_C + "getUnits?projectname=" + projectname)
        .then((res) => res.data);
    return resp;
})
export const getpriceByunit = createAsyncThunk("getpriceByunit/clients", async (unitname) => {
    const resp = await axios.post(variables.URL_API_C + "getPriceOfUnit?unitname=" + unitname)
        .then((res) => res.data);
    return resp;
})
export const saveclientsform=createAsyncThunk("saveclientsform/clients",async(parms)=>{
    const resp=await axios.post(variables.URL_API_C+"SaveClients",parms)
        .then((res)=>res.data);
    return resp;
})
export const deleteAllData=createAsyncThunk("deleteAllData/clients",async(id)=>{
    const resp=await axios.delete(variables.URL_API_C+"DeleteClient?id="+id)
    .then((res)=>res.data);
    return resp;
})
export const GetAllClients=createAsyncThunk("GetAllClients/clients",async()=>{
    const resp=await axios.get(variables.URL_API_C+"SearchClients")
    .then((res)=>res.data);
    return resp;
})
export const GetnegotiationsByclient=createAsyncThunk("GetNegotiationsByClient/clients",async(clientid)=>{
    const resp=await axios.post(variables.URL_API_C+"GetNegotiationsByClient?ClientID="+clientid)
    .then((res)=>res.data);
    return resp;
})
export const getfirstClient=createAsyncThunk("getfirstClient/clients",async()=>{
    const resp=await axios.get(variables.URL_API_C+"GetFirstClient")
    .then((res)=>res.data);
    return resp;
})
export const getlastClient=createAsyncThunk("getlastClient/clients",async()=>{
    const resp=await axios.get(variables.URL_API_C+"GetLastClient")
    .then((res)=>res.data);
    return resp;
})
export const getnextClient=createAsyncThunk("getnextClient/clients",async(id)=>{
    const resp=await axios.post(variables.URL_API_C+"GetNextClient?id="+id)
    .then((res)=>res.data);
    return resp;
})
export const getpreviousClient=createAsyncThunk("getpreviousClient/clients",async(id)=>{
    const resp=await axios.post(variables.URL_API_C+"GetpreviousClient?id="+id)
    .then((res)=>res.data);
    return resp;
})
//************************************************************* */
const clientSlice = createSlice({
    name: "clients",
    initialState,
    reducers: {
        changeclientsVls: (state, action) => {
            state.client = { ...state.client, ...action.payload };
        },
        clearinputs: (state) => {
            state.client = initialState.client;
            state.totalP={};
            state.negotiations=[];
        },
        showNegotiationModal:(state,action)=>{
            state.showNeg=action.payload;
        },
        changeNegotiation_values:(state,action)=>{
            state.negotiation={...state.negotiation,...action.payload}
        },
        AddNegotiation:(state,action)=>{
            state.negotiation={serialCode:"",ProjectName:"-1",Unit:"-1",OriginalPrice:"",NegotiationPrice:"",DiscountAmount:"",
                 NegotiationStatus:"في انتظار موافقة الإدارة",
                 NegotiationDate:new Date().toISOString().split('T')[0],checkedByAdmin:0}; 
            state.negotiation.serialCode=action.payload;
        },
        calculateDiscount:(state)=>{
            if(state.negotiation.OriginalPrice && state.negotiation.NegotiationPrice){
                const difference=state.negotiation.OriginalPrice - state.negotiation.NegotiationPrice;
                const discount=(difference/state.negotiation.OriginalPrice)*100; 
                state.negotiation.DiscountAmount=parseFloat(discount.toFixed(1));
            }
       },
       IdentifyEditorAddNew:(state,action)=>{
         state.rowIndex=action.payload;
         if(state.rowIndex!==-1){
            state.negotiation = { ...state.negotiations[action.payload]};
         }
         state.showNeg=true; 
       },
       AddToNegotiationTable:(state,action)=>{
            if(state.rowIndex===-1){state.negotiations=[...state.negotiations,state.negotiation];}
            else{state.negotiations[state.rowIndex]=state.negotiation;}
            state.showNeg=false; 
        },
        HandleShowModal:(state,action)=>{
         state.showdModal=action.payload;
        },
       ShowsearchcLientsMdl:(state,action)=>{
         state.ShowSearchCLientsMdl=action.payload;

       },
       FillClientsForm:(state,action)=>{
        const selectedClient = state.clients[action.payload];
        state.client = selectedClient;
        state.ShowSearchCLientsMdl = false;
       },
        DeleteNegotiationModal:(state,action)=>{
            state.deleteNegoModal=action.payload;
        },
        GetIndexofRemovednegotiation:(state,action)=>{
             state.deleteRowIndex=action.payload;
             state.deleteNegoModal=true;
        },
        DeleteNegotiationRow:(state,action)=>{
            state.negotiations=state.negotiations.filter((items,index)=> index !==state.deleteRowIndex);
            state.deleteNegoModal=false;
        }
      
    },
    extraReducers: (builder) => {
        builder
            .addCase(getprojects.pending, (state) => {
                state.loading = true;
            })
            .addCase(getprojects.fulfilled, (state, action) => {
                state.loading = false;
                state.projects = action.payload;
            })
            .addCase(getprojects.rejected, (state) => {
                state.loading = false;
                state.error = true;
            })
            //-----------------------------------------------------
            .addCase(getunitsByproject.pending, (state) => {
                state.loading = true;
            })
            .addCase(getunitsByproject.fulfilled, (state, action) => {
                state.loading = false;
                state.units = action.payload;
            })
            .addCase(getunitsByproject.rejected, (state) => {
                state.loading = false;
                state.error = true;
            })
            //-----------------------------------------------------
            .addCase(getpriceByunit.pending, (state) => {
                state.loading = true;
            })
            .addCase(getpriceByunit.fulfilled, (state, action) => {
                state.loading = false;
                state.negotiation.OriginalPrice = action.payload[0].TotalPrice;
            })
            .addCase(getpriceByunit.rejected, (state) => {
                state.loading = false;
                state.error = true;
            })
             //-----------------------------------------------------
             .addCase(saveclientsform.pending, (state) => {
                state.loading = true;
            })
            .addCase(saveclientsform.fulfilled, (state, action) => {
                state.loading = false;
                state.client.ClientID = action.payload.id;
               
            })
            .addCase(saveclientsform.rejected, (state) => {
                state.loading = false;
                state.error = true;
            })
            //-----------------------------------------------------
            .addCase(deleteAllData.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteAllData.fulfilled, (state, action) => {
                state.loading = false;
                state.deletedall = action.payload.deleted;
            })
            .addCase(deleteAllData.rejected, (state) => {
                state.loading = false;
                state.error = true;
            })
           //-----------------------------------------------------
           .addCase(GetAllClients.pending, (state) => {
                state.loading = true;
            })
            .addCase(GetAllClients.fulfilled, (state, action) => {
                state.loading = false;
                state.clients = action.payload;
            })
            .addCase(GetAllClients.rejected, (state) => {
                state.loading = false;
                state.error = true;
            })
            //-----------------------------------------------------
            .addCase(GetnegotiationsByclient.pending, (state) => {
                state.loading = true;
            })
            .addCase(GetnegotiationsByclient.fulfilled, (state, action) => {
                state.loading = false;
                state.negotiations = action.payload;
            })
            .addCase(GetnegotiationsByclient.rejected, (state) => {
                state.loading = false;
                state.error = true;
            })
            //-----------------------------------------------------
            .addCase(getfirstClient.pending, (state) => {
                state.loading = true;
            })
            .addCase(getfirstClient.fulfilled, (state, action) => {
                state.loading = false;
                state.client = action.payload.dt[0];
                state.negotiations=action.payload.negotiations_f;
                if(action.payload.isnull===true){
                    state.client=initialState.client;
                    toast.error("لا يوجد بيانات لعملاء , حاول مره أخري", {
                      theme: "colored",
                      position: "top-left",
                    });
                }
               
            })
            .addCase(getfirstClient.rejected, (state) => {
                state.loading = false;
                state.error = true;
            })
             //-----------------------------------------------------
            .addCase(getlastClient.pending, (state) => {
                state.loading = true;
            })
            .addCase(getlastClient.fulfilled, (state, action) => {
                state.loading = false;
                state.client = action.payload.dt[0];
                state.negotiations=action.payload.negotiations_l;
                   if(action.payload.isnull===true){
                    state.client=initialState.client;
                    toast.error("لا يوجد بيانات لعملاء , حاول مره أخري", {
                      theme: "colored",
                      position: "top-left",
                    });
                }
            })
            .addCase(getlastClient.rejected, (state) => {
                state.loading = false;
                state.error = true;
            })
            //-----------------------------------------------------
            .addCase(getnextClient.pending, (state) => {
                state.loading = true;
            })
            .addCase(getnextClient.fulfilled, (state, action) => {
                state.loading = false;
                state.client = action.payload.dt[0];
                state.negotiations=action.payload.negotiations_n;
                if(action.payload.islast===true){
                    toast.info("لا توجد سجلات تالية,انت بالفعل في السجل الأخير", {
                      theme: "colored",
                      position: "top-left",
                    });
                }
                if(action.payload.empty_db===true){
                    state.client=initialState.client;
                    toast.error("لا يوجد بيانات لعملاء , حاول مره أخري", {
                      theme: "colored",
                      position: "top-left",
                    });
                }
            })
            .addCase(getnextClient.rejected, (state) => {
                state.loading = false;
                state.error = true;
            })
            //-----------------------------------------------------
            .addCase(getpreviousClient.pending, (state) => {
                state.loading = true;
            })
            .addCase(getpreviousClient.fulfilled, (state, action) => {
                state.loading = false;
                state.client = action.payload.dt[0];
                state.negotiations=action.payload.negotiations_p;
               if(action.payload.isfirst===true){
                 toast.info("لا توجد سجلات سابقة,انت بالفعل في السجل الأول", {
                      theme: "colored",
                      position: "top-left",
                    });
               }
                if(action.payload.empty_db===true){
                    state.client=initialState.client;
                    toast.error("لا يوجد بيانات لعملاء , حاول مره أخري", {
                      theme: "colored",
                      position: "top-left",
                    });
                }
            })
            .addCase(getpreviousClient.rejected, (state) => {
                state.loading = false;
                state.error = true;
            })
    }
})
export const { changeclientsVls, clearinputs,showNegotiationModal ,changeNegotiation_values,
               AddNegotiation,calculateDiscount,AddToNegotiationTable,HandleShowModal,ShowsearchcLientsMdl,
               FillClientsForm,Getunit,IdentifyEditorAddNew,DeleteNegotiationModal,GetIndexofRemovednegotiation,
               DeleteNegotiationRow
} = clientSlice.actions;
const clientReducer = clientSlice.reducer;
export default clientReducer;