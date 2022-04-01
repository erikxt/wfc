import { createSlice } from "@reduxjs/toolkit";

const pageSlice = createSlice({
  name: "page",
  initialState: {
    page: 1,
    cateId: 93,
    infoId: 0,
    assembleId: "0",
    infos: [],
    labels: [],
  },
  reducers: {
    updatePage: (state, action) => {
      state.page = action.payload;
    },
    updateCate: (state, action) => {
      state.cateId = action.payload;
    },
    updateInfo: (state, action) => {
      state.infoId = action.payload;
    },
    updateLabel: (state, action) => {
      state.assembleId = action.payload;
    },
    updateInfos: (state, action) => {
      state.infos = action.payload;
    },
    updateLabels: (state, action) => {
      state.labels = action.payload;
    },
  },
});

export const { updatePage, updateCate, updateInfo, updateLabel, updateInfos, updateLabels } = pageSlice.actions;

export default pageSlice.reducer;
