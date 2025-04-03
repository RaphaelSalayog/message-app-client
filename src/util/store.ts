import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import userSlice from "./storeSlices/userSlice";
import chatSlice from "./storeSlices/chatSlice";

export const store = configureStore({
    reducer: {
        user: userSlice,
        chat: chatSlice,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
