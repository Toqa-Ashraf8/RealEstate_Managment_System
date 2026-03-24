import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: 'ui',
  initialState: { globalError: false, globalMessage: "" },
  reducers: {
    clearGlobalError: (state) => { state.globalError = false; }
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      (action) => action.type.endsWith('/rejected'),
      (state, action) => {
        state.globalError = true;
        state.globalMessage = "حدث خطأ غير متوقع، برجاء المحاولة لاحقاً";
      }
    );
  }
});
const uiReducer=uiSlice.reducer;
export default uiReducer;