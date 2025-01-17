/* eslint-disable @typescript-eslint/no-unused-vars */
//import logger from 'redux-logger'

import rootReducer from "./rootReducer";
import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

const store = configureStore({
  reducer: rootReducer,
});
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export default store;
