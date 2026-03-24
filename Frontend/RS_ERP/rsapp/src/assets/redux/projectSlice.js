import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'
import { variables } from "../variables";
import { toast } from 'react-toastify';
import { formatCurrency } from "../helpers";
const initialState = {
    project: {
         ProjectCode: 0, ProjectName:"", ProjectType: "-1", 
         Location: "", TotalUnits: 0, ProjectStatus: "-1", ProjectImage: "" 
        },
    projectsList: [],
    selectedUnit: {},
    unitsList: [], 
    //set variables
    projectImageName: "", 
    unitImageName: "",
    calculatedUnitTotalPrice: "",
    //Modal state
    isUnitModalOpen: false,
    isDeleteUnitModalOpen: false,
    isDeleteProjectModalOpen: false,
    isSearchModalOpen: false,
    // pending and rejected status
    isLoading: false,
    hasError: false,
    // create status 
    unitFormMode: -1, 
    isDeleted:false, 
    saveErrorStatus: false,
    isAvailableUnit:"متاحة",
    //set row indexs and row id 
    unitTableRowIndex:"",
    selectedProjectRowIndex: "",
    selectedProjectCode:"",
    
}
//********************************************************************************** */
const projectSlice = createSlice({
    name: 'projects',
    initialState,
    reducers: {
        toggleUnitModal: (state, action) => {
            state.isUnitModalOpen = action.payload;
        },
        setProjectData: (state, action) => {
            state.project = { ...state.project, ...action.payload }
        },
        resetProjectForm: (state) => {
            state.project = { ProjectCode: 0, ProjectName: '', ProjectType: '-1', Location: '', TotalUnits: 0, ProjectStatus: '-1', ProjectImage: '' };
            state.projectImageName = '';
            state.unitsList = [];
        },
        setUnitData: (state, action) => {
            state.selectedUnit = { ...state.selectedUnit, ...action.payload };
        },
        prepareUnitModal: (state, action) => {
            state.unitImageName = '';
            state.selectedUnit = {};
            state.selectedUnit.serial = action.payload;
            state.selectedUnit.unitStatus=state.isAvailableUnit;
        },
        setUnitEditingIndex:(state,action)=>{
            state.unitFormMode = action.payload;
                if (action.payload !== -1) {
                    state.selectedUnit = state.unitsList[action.payload];
                    state.unitImageName = state.unitsList[action.payload].unitImage;
                 }
          },
        saveUnitToTable: (state, action) => {
            if (state.unitFormMode === -1) {
                state.unitsList = [...state.unitsList, state.selectedUnit];
            }
            else {
                state.unitsList[state.unitFormMode] = state.selectedUnit;
            }
            state.isUnitModalOpen = false;
        },
        showDeleteUnitModal: (state, action) => {
            state.unitTableRowIndex = action.payload;
            state.isDeleteUnitModalOpen = true;
        },
        deleteUnitFromList: (state, action) => {
            state.unitsList = state.unitsList.filter((items, index) => index !== state.unitTableRowIndex);
            state.isDeleteUnitModalOpen = false;
        },
        hideDeleteUnitModal: (state) => {
            state.isDeleteUnitModalOpen = false;
        },
        calculateUnitTotalPrice: (state) => {
            if (state.selectedUnit.TotalArea.length > 0 && state.selectedUnit.MeterPrice.length > 0) {
                state.calculatedUnitTotalPrice = state.selectedUnit.TotalArea * state.selectedUnit.MeterPrice;
                state.selectedUnit.TotalPrice = state.calculatedUnitTotalPrice;
            } else {
                state.calculatedUnitTotalPrice = 0;
                state.selectedUnit.TotalPrice = 0;
            }
        },
        toggleDeleteProjectModal: (state, action) => {
            state.isDeleteProjectModalOpen= action.payload;
        },
        toggleSearchModal: (state, action) => {
            state.isSearchModalOpen = action.payload;
            state.selectedProjectRowIndex = "";
        },
         selectProjectFromSearch: (state, action) => {
            state.project = state.projectsList[action.payload]
            state.selectedProjectRowIndex = state.projectsList[action.payload].ProjectCode;

        }, 
        updateSelectedProjectCode:(state,action)=>{
            state.selectedProjectCode=state.projectsList[action.payload].ProjectCode;
        } 
       
    },
    extraReducers: (builder) => {
        builder.
            addCase(uploadProjectImage.pending, (state) => {
                state.loading = true;
            })
            .addCase(uploadProjectImage.fulfilled, (state, action) => {
                state.loading = false;
                state.imgName = action.payload;
                
            })
            .addCase(uploadProjectImage.rejected, (state) => {
                state.loading = false;
                state.error = true;
            })
            //******************************************************* */
            .addCase(saveCompleteProject.pending, (state) => {
                state.loading = true;
            })
            .addCase(saveCompleteProject.fulfilled, (state, action) => {
                state.loading = false;
                state.errorSave = action.payload.errorOccured;
                state.project.ProjectCode = action.payload.id;

            })
            .addCase(saveCompleteProject.rejected, (state) => {
                state.loading = false;
                state.error = true;
            })
            //******************************************************* */
            .addCase(uploadUnitImage.pending, (state) => {
                state.loading = true;
            })
            .addCase(uploadUnitImage.fulfilled, (state, action) => {
                state.loading = false;
                state.imgName_u = action.payload;
            })
            .addCase(uploadUnitImage.rejected, (state) => {
                state.loading = false;
                state.error = true;
            })
            //******************************************************* */
            .addCase(deleteProject.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteProject.fulfilled, (state, action) => {
                state.loading = false;
                state.deleted = action.payload;
            })
            .addCase(deleteProject.rejected, (state) => {
                state.loading = false;
                state.error = true;
            })
            //******************************************************* */
            .addCase(fetchProjectsList.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchProjectsList.fulfilled, (state, action) => {
                state.loading = false;
                state.projectsList = action.payload;
            })
            .addCase(fetchProjectsList.rejected, (state) => {
                state.loading = false;
                state.error = true;
            })
            //******************************************************* */
            .addCase(fetchProjectUnits.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchProjectUnits.fulfilled, (state, action) => {
                state.loading = false;
                state.unitsList = action.payload;
            })
            .addCase(fetchProjectUnits.rejected, (state) => {
                state.loading = false;
                state.error = true;
            })
    }
})
export const { 
    toggleUnitModal, 
    setProjectData, 
    resetProjectForm, 
    setUnitData, 
    prepareUnitModal,
    setUnitEditingIndex, 
    saveUnitToTable, 
    showDeleteUnitModal,
    deleteUnitFromList,
    hideDeleteUnitModal,
    calculateUnitTotalPrice,
    toggleDeleteProjectModal,
    toggleSearchModal, 
    selectProjectFromSearch,
    updateSelectedProjectCode,
} = projectSlice.actions;
const projReducer = projectSlice.reducer;
export default projReducer;