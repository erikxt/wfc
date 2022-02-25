import { createSlice } from "@reduxjs/toolkit";

const pageSlice = createSlice({
  name: "page",
  initialState: { page: 1, cateId: 0, infoId: 0, assembleId: "" },
  reducers: {
    updatePage: (state, action) => {
      state.page = action.payload;
    },
  },
});

export const { updatePage } = pageSlice.actions;

export default pageSlice.reducer;
