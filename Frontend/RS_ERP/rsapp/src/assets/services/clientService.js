import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { variables } from "../variables";


export const fetchProjects = createAsyncThunk("fetchProjects/clients", async () => {
    const resp = await axios.get(variables.URL_API_C + "GetProjects")
        .then((res) => res.data);
    return resp;
})
export const fetchUnitsByProject = createAsyncThunk("fetchUnitsByProject/clients", async (projectname) => {
    const resp = await axios.post(variables.URL_API_C + "getUnits?projectname=" + projectname)
        .then((res) => res.data);
    return resp;
})
export const fetchPriceByUnit = createAsyncThunk("fetchPriceByUnit/clients", async (unitname) => {
    const resp = await axios.post(variables.URL_API_C + "getPriceOfUnit?unitname=" + unitname)
        .then((res) => res.data);
    return resp;
})
export const saveClient=createAsyncThunk("saveClient/clients",async(parms)=>{
    const resp=await axios.post(variables.URL_API_C+"SaveClients",parms)
        .then((res)=>res.data);
    return resp;
})
export const deleteClientData=createAsyncThunk("deleteClientData/clients",async(id)=>{
    const resp=await axios.delete(variables.URL_API_C+"DeleteClient?id="+id)
    .then((res)=>res.data);
    return resp;
})
export const fetchClients=createAsyncThunk("fetchClients/clients",async()=>{
    const resp=await axios.get(variables.URL_API_C+"SearchClients")
    .then((res)=>res.data);
    return resp;
})
export const fetchNegotiationsByClient=createAsyncThunk("fetchNegotiationsByClient/clients",async(clientid)=>{
    const resp=await axios.post(variables.URL_API_C+"GetNegotiationsByClient?ClientID="+clientid)
    .then((res)=>res.data);
    return resp;
})
export const fetchFirstClient=createAsyncThunk("fetchFirstClient/clients",async()=>{
    const resp=await axios.get(variables.URL_API_C+"GetFirstClient")
    .then((res)=>res.data);
    return resp;
})
export const fetchLastClient=createAsyncThunk("fetchLastClient/clients",async()=>{
    const resp=await axios.get(variables.URL_API_C+"GetLastClient")
    .then((res)=>res.data);
    return resp;
})
export const fetchNextClient=createAsyncThunk("fetchNextClient/clients",async(id)=>{
    const resp=await axios.post(variables.URL_API_C+"GetNextClient?id="+id)
    .then((res)=>res.data);
    return resp;
})
export const fetchPreviousClient=createAsyncThunk("fetchPreviousClient/clients",async(id)=>{
    const resp=await axios.post(variables.URL_API_C+"GetpreviousClient?id="+id)
    .then((res)=>res.data);
    return resp;
})