import { configureStore } from "@reduxjs/toolkit";
import pageReducer from "./pageSlice";

const store = configureStore({
  reducer: {
    pageInfo: pageReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;