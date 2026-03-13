import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'
import { variables } from "../variables";
import { toast } from 'react-toastify';
import { formatCurrency } from "../helpers";
const initialState = {
    project: { ProjectCode: 0, ProjectName: '', ProjectType: '-1', Location: '', TotalUnits: 0, ProjectStatus: '-1', ProjectImage: '' },
    projects: [],
    unit: {},
    units: [],
    loading: false,
    error: false,
    showmdl: false,
    imgName: '',
    imgName_u: '',
    rowI: -1,
    tblLength: '',
    index: '',
    rowSel: '',
    deleteUnitRow: false,
    TotalP: '',
    deleted: '',
    deleteProjectModal: false,
    showmdl_s: false,
    searchRowI: '',
    comeunits: [],
    errorSave: false,
    formattedtotalprice:"",
    fillprojectcode:"",
    available:"متاحة",
}
//******************************************************************************* */
export const saveimgs = createAsyncThunk("saveimgs/projects", async (formdata) => {
    const resp = await axios.post(variables.URL_API + "SaveImages", formdata)
        .then((res) => res.data);
    return resp;
})
export const save_all = createAsyncThunk("save_all/projects", async (parms) => {
    const resp = await axios.post(variables.URL_API + "SaveAll", parms)
        .then((res) => res.data)
    return resp;
})
export const saveimg_u = createAsyncThunk("saveimg_u/projects", async (formDatau) => {
    const resp = await axios.post(variables.URL_API + "SaveImagesUnits", formDatau)
        .then((res) => res.data);
    return resp;
})
export const deleteAll = createAsyncThunk("deleteAll/projects", async (id) => {
    const resp = await axios.post(variables.URL_API + "DeleteAll?id=" + id)
        .then((res) => res.data);
    return resp;
})
export const searchMaster = createAsyncThunk("searchMaster/projects", async () => {
    const resp = await axios.get(variables.URL_API + "SearchMaster")
        .then((res) => res.data);
    return resp;
})
export const getdtlsByMaster = createAsyncThunk("getdtlsByMaster/projects", async (id) => {
    const resp = await axios.post(variables.URL_API + "GetDtls?projectId=" + id)
        .then((res) => res.data);
    return resp;
})
//********************************************************************************** */
const projectSlice = createSlice({
    name: 'projects',
    initialState,
    reducers: {
        showunitMdl: (state, action) => {
            state.showmdl = action.payload;
        },
        changeVls: (state, action) => {
            state.project = { ...state.project, ...action.payload }
        },
        ClearInputs: (state) => {
            state.project = { ProjectCode: 0, ProjectName: '', ProjectType: '-1', Location: '', TotalUnits: 0, ProjectStatus: '-1', ProjectImage: '' };
            state.imgName = '';
            state.units = [];
        },
        changeVls_U: (state, action) => {
            state.unit = { ...state.unit, ...action.payload };
        },
        ClearModalvls: (state, action) => {
            state.imgName_u = '';
            state.unit = {};
            state.unit.serial = action.payload;
            state.unit.unitStatus=state.available;
        },
        SetRowIndexvalue:(state,action)=>{
                state.rowI = action.payload;
                if (action.payload !== -1) {
                    state.unit = state.units[action.payload];
                    state.imgName_u = state.units[action.payload].unitImage;
                 }
          }
       ,
        fromMdlTotbl: (state, action) => {
            
            if (state.rowI === -1) {
                state.units = [...state.units, state.unit];
                
            }
            else {
                state.units[state.rowI] = state.unit;
            }
            state.showmdl = false;
        },
        showdeleteUnitRowModal: (state, action) => {
            state.rowSel = action.payload;
            state.deleteUnitRow = true;
        },
        DeleteRow: (state, action) => {
            state.units = state.units.filter((items, index) => index !== state.rowSel);
            state.deleteUnitRow = false;
        },
        hideDelmdl: (state) => {
            state.deleteUnitRow = false;
        },
        calcTotalPrice: (state) => {
            if (state.unit.TotalArea.length > 0 && state.unit.MeterPrice.length > 0) {
                state.TotalP = state.unit.TotalArea * state.unit.MeterPrice;
                state.unit.TotalPrice = state.TotalP;
            } else {

                state.TotalP = 0;
                state.unit.TotalPrice = 0;
            }
        },
        showDeleteProjectModal: (state, action) => {
            state.deleteProjectModal= action.payload;
        },
        showSearchm: (state, action) => {
            state.showmdl_s = action.payload;
            state.searchRowI = "";
        },
        getRowIndexOfS: (state, action) => {
            state.project = state.projects[action.payload]
            state.searchRowI = state.projects[action.payload].ProjectCode;

        },
        GetProjectCode:(state,action)=>{
            state.fillprojectcode=state.projects[action.payload].ProjectCode;
        }
       
    },
    extraReducers: (builder) => {
        builder.
            addCase(saveimgs.pending, (state) => {
                state.loading = true;
            })
            .addCase(saveimgs.fulfilled, (state, action) => {
                state.loading = false;
                state.imgName = action.payload;
                
            })
            .addCase(saveimgs.rejected, (state) => {
                state.loading = false;
                state.error = true;
            })
            //******************************************************* */
            .addCase(save_all.pending, (state) => {
                state.loading = true;
            })
            .addCase(save_all.fulfilled, (state, action) => {
                state.loading = false;
                state.errorSave = action.payload.errorOccured;
                state.project.ProjectCode = action.payload.id;

            })
            .addCase(save_all.rejected, (state) => {
                state.loading = false;
                state.error = true;
            })
            //******************************************************* */
            .addCase(saveimg_u.pending, (state) => {
                state.loading = true;
            })
            .addCase(saveimg_u.fulfilled, (state, action) => {
                state.loading = false;
                state.imgName_u = action.payload;
            })
            .addCase(saveimg_u.rejected, (state) => {
                state.loading = false;
                state.error = true;
            })
            //******************************************************* */
            .addCase(deleteAll.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteAll.fulfilled, (state, action) => {
                state.loading = false;
                state.deleted = action.payload;
            })
            .addCase(deleteAll.rejected, (state) => {
                state.loading = false;
                state.error = true;
            })
            //******************************************************* */
            .addCase(searchMaster.pending, (state) => {
                state.loading = true;
            })
            .addCase(searchMaster.fulfilled, (state, action) => {
                state.loading = false;
                state.projects = action.payload;
            })
            .addCase(searchMaster.rejected, (state) => {
                state.loading = false;
                state.error = true;
            })
            //******************************************************* */
            .addCase(getdtlsByMaster.pending, (state) => {
                state.loading = true;
            })
            .addCase(getdtlsByMaster.fulfilled, (state, action) => {
                state.loading = false;
                state.units = action.payload;
            })
            .addCase(getdtlsByMaster.rejected, (state) => {
                state.loading = false;
                state.error = true;
            })
    }
})
export const { showunitMdl, changeVls, ClearInputs, changeVls_U, ClearModalvls,
    fromMdlTotbl, showdeleteUnitRowModal, DeleteRow, hideDelmdl, calcTotalPrice, showDeleteProjectModal,
    showSearchm, getRowIndexOfS,SetRowIndexvalue,GetProjectCode
} = projectSlice.actions;
const projReducer = projectSlice.reducer;
export default projReducer;