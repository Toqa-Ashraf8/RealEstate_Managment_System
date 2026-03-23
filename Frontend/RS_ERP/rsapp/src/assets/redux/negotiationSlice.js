import { createSlice ,createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { variables } from "../variables";
const initialState={
        error:false,
        loading:false,
        negotiationNo:"",
        Allnegotiations:[],
        rejectmodal:false,
        detailsOfRow:{},
        negotiationRow:{ClientID:"",ProjectName:"",Unit:"",NegotiationCondition:0,SuggestedPrice:0,ReasonOfReject:"",CheckedDate:new Date().toISOString()},
        confirmModal:false,
        savedRequest:false,
        rejected_neg:0,
        accepted_neg:0,
        rejectReq:false,
        acceptedRequests:[],
        rejectedRequests:[],
        Re_confirmModal:false,
        CurrentDate:"",
        acceptedRow:{},
        rejectedrow:{},
        defineRow:0,
        updated:false,
        Re_approveRow:0,
        deleteModal:false,
        bookingClient:{},
       
}
export const negotiationCount=createAsyncThunk("negotiationCount/negotiaion",async()=>{
    const resp=await axios.get(variables.URL_API_N+"GetNegotationsCount")
    .then((res)=>res.data);
    return resp;
})
export const GetAllnegotiations=createAsyncThunk("GetAllnegotiations/negotiaion",async()=>{
    const resp=await axios.get(variables.URL_API_N+"GetNegotiations")
    .then((res)=>res.data);
    return resp;
})
export const SaveRequestByAdmin=createAsyncThunk("SaveRequestByAdmin/negotiaion",async(acceptedrow)=>{
    const resp=await axios.post(variables.URL_API_N+"saveNegotiations_ByAdmin",acceptedrow)
    .then((res)=>res.data);
    return resp;
})
export const rejectedCount=createAsyncThunk("rejectedCount/negotiaion",async()=>{
    const resp=await axios.get(variables.URL_API_N+"rejected_Requests")
    .then((res)=>res.data);
    return resp;
})
export const acceptedCount=createAsyncThunk("acceptedCount/negotiaion",async()=>{
    const resp=await axios.get(variables.URL_API_N+"accepted_Requests")
    .then((res)=>res.data);
    return resp;
})
export const ApprovedtoReject=createAsyncThunk("ApprovedtoReject/negotiaion",async(approvedRequest)=>{
    const resp=await axios.post(variables.URL_API_N+"Approved_Rejected",approvedRequest)
    .then((res)=>res.data);
    return resp;
})

const negotiationSlice=createSlice({
    name:'negotiation',
    initialState,
    reducers:{
        showModal_reject:(state,action)=>{
            state.rejectmodal=action.payload;
        },
        GetClientDetails:(state,action)=>{
           state.negotiationRow=state.Allnegotiations[action.payload];
           state.CurrentDate=new Date().toISOString().split('T')[0];
        },
        RejectModal_values:(state,action)=>{
            state.negotiationRow={...state.negotiationRow,...action.payload};
        },
        ChangeConditionOfRequest:(state,action)=>{
            if(action.payload===1){
                state.negotiationRow.NegotiationCondition=1
            }
            else if(action.payload===0){
                state.negotiationRow.NegotiationCondition=0
            }
        },
        clearValuesOfRow:(state,action)=>{
            state.negotiationRow=initialState.negotiationRow;
        },
        showconfirmModal:(state,action)=>{
            state.confirmModal=action.payload;
        },
         rejectedRequests_show:(state,action)=>{
            state.rejectReq=action.payload;
        },
        showModal_reconfrim:(state,action)=>{
            state.Re_confirmModal=action.payload;
        },
        GetAdcceptedrowByIndex:(state,action)=>{
            const row=state.acceptedRequests[action.payload];
             if(row.NegotiationCondition===true){
                const boolval=0;
                row.NegotiationCondition=boolval;
             }
             state.acceptedRow=row;
        },
        GetRejectModalvalues:(state,action)=>{
            state.acceptedRow={...state.acceptedRow,...action.payload}
           
        },
        DefineApproveRow:(state,action)=>{
            state.defineRow=action.payload;
            state.negotiationRow.ReasonOfReject="";
            state.negotiationRow.SuggestedPrice="";
        },
          GetRejectedrowByIndex:(state,action)=>{
            const row=state.rejectedRequests[action.payload];
             if(row.NegotiationCondition===false){
                const boolval=1;
                row.NegotiationCondition=boolval;
             }
             state.rejectedrow=row;
        },
         DefineRejectRow:(state,action)=>{
            state.Re_approveRow=action.payload;     
        },
      /*   GetBookngClient:(state,action)=>{
            state.bookingClient=state.acceptedRequests[action.payload];  
            
        }, */
    },
    //****************************************************************************** */
    extraReducers:(builder)=>{
        builder
        .addCase(negotiationCount.pending,(state)=>{
            state.loading=true;
        })
        .addCase(negotiationCount.fulfilled,(state,action)=>{
            state.loading=false;
            state.negotiationNo=action.payload;
        })
        .addCase(negotiationCount.rejected,(state)=>{
            state.loading=false;
            state.error=true;
         })
         //-------------------------------------------
          .addCase(GetAllnegotiations.pending,(state)=>{
            state.loading=true;
        })
        .addCase(GetAllnegotiations.fulfilled,(state,action)=>{
            state.loading=false;
            state.Allnegotiations=action.payload;
        })
        .addCase(GetAllnegotiations.rejected,(state)=>{
            state.loading=false;
            state.error=true;
         })
        //-------------------------------------------
         .addCase(SaveRequestByAdmin.pending,(state)=>{
            state.loading=true;
        })
        .addCase(SaveRequestByAdmin.fulfilled,(state,action)=>{
            state.loading=false;
            state.savedRequest=action.payload.saved;
            if(state.savedRequest){
                const unitidentity=state.negotiationRow.Unit;
                state.Allnegotiations = state.Allnegotiations.filter(neg => neg.Unit !== unitidentity);
                if (state.negotiationNo > 0) {
                   state.negotiationNo -= 1;
                   
                 }
                 if (state.negotiationRow.NegotiationCondition === 1) {
                   state.accepted_neg = (Number(state.accepted_neg) || 0) + 1;
                 } else if (state.negotiationRow.NegotiationCondition === 0) {
                    state.rejected_neg = (Number(state.rejected_neg) || 0) + 1;
                  }   
                   state.negotiationRow = initialState.negotiationRow;
               
             }
        
        })
        .addCase(SaveRequestByAdmin.rejected,(state)=>{
            state.loading=false;
            state.error=true;
         })
          //--------------------------------------------------------------------------
        .addCase(rejectedCount.pending,(state)=>{
            state.loading=true;
        })
        .addCase(rejectedCount.fulfilled,(state,action)=>{
            state.loading=false;
            state.rejected_neg=action.payload.count;
            state.rejectedRequests=action.payload.dt;
        })
        .addCase(rejectedCount.rejected,(state)=>{
            state.loading=false;
            state.error=true;
         })
          //--------------------------------------------
             .addCase(acceptedCount.pending,(state)=>{
                state.loading=true;
             })
            .addCase(acceptedCount.fulfilled,(state,action)=>{
                state.loading=false;
                state.accepted_neg=action.payload.count_a;
                state.acceptedRequests=action.payload.dt;
             })
             .addCase(acceptedCount.rejected,(state)=>{
                state.loading=false;
                state.error=true;
             })
           //--------------------------------------------
          .addCase(ApprovedtoReject.pending,(state)=>{
            state.loading=true;
        })
        .addCase(ApprovedtoReject.fulfilled,(state,action)=>{
            state.loading=false;
            state.updated=action.payload;
            if(state.updated===true){
                const unitidentity=state.acceptedRow.Unit;
                const unitidentity_rejected=state.rejectedrow.Unit;
                state.acceptedRequests = state.acceptedRequests.filter(neg => neg.Unit !== unitidentity);
                state.rejectedRequests = state.rejectedRequests.filter(neg2 => neg2.Unit !== unitidentity_rejected);
                if (state.negotiationNo > 0) {
                   state.negotiationNo -= 1;
                 }
              
               state.negotiationRow = {
                ClientID: "", ProjectName: "", Unit: "", 
                NegotiationCondition: 0, SuggestedPrice: 0, 
                ReasonOfReject: "", CheckedDate: new Date().toISOString()
                 };
             }
        })
        .addCase(ApprovedtoReject.rejected,(state)=>{
            state.loading=false;
            state.error=true;
         })
         //-------------------------------------------
         

    }
})
export const{showModal_reject,GetClientDetails,RejectModal_values,ChangeConditionOfRequest,clearValuesOfRow,
            showconfirmModal,rejectedRequests_show,showModal_reconfrim,GetAdcceptedrowByIndex,
            GetRejectModalvalues,DefineApproveRow,DefineRejectRow,GetRejectedrowByIndex,
             GetBookngClient,         
}=negotiationSlice.actions;
const negotiationReducer=negotiationSlice.reducer;
export default negotiationReducer;