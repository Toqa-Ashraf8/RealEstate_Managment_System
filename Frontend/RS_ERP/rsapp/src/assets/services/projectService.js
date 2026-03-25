import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';
import { variables } from "../variables";
//-------------------------------------------------------------------------------
export const uploadProjectImage = createAsyncThunk("uploadProjectImage/projects", async (formdata) => {
    const resp = await axios.post(variables.PROJECTS_API + "SaveImages", formdata)
        .then((res) => res.data);
    return resp;
})
export const saveCompleteProject = createAsyncThunk("saveCompleteProject/projects", async (parms) => {
    const resp = await axios.post(variables.PROJECTS_API + "SaveAll", parms)
        .then((res) => res.data)
    return resp;
})
export const uploadUnitImage = createAsyncThunk("uploadUnitImage/projects", async (formDatau) => {
    const resp = await axios.post(variables.PROJECTS_API + "SaveImagesUnits", formDatau)
        .then((res) => res.data);
    return resp;
})
export const deleteProject = createAsyncThunk("deleteProject/projects", async (id) => {
    const resp = await axios.post(variables.PROJECTS_API + "DeleteAll?id=" + id)
        .then((res) => res.data);
    return resp;
})
export const fetchProjectsList = createAsyncThunk("fetchProjectsList/projects", async () => {
    const resp = await axios.get(variables.PROJECTS_API + "SearchMaster")
        .then((res) => res.data);
    return resp;
})
export const fetchProjectUnits = createAsyncThunk("fetchProjectUnits/projects", async (id) => {
    const resp = await axios.post(variables.PROJECTS_API + "GetDtls?projectId=" + id)
        .then((res) => res.data);
    return resp;
})