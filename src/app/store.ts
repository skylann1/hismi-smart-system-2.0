import { configureStore } from "@reduxjs/toolkit";
import modalReducer from "@/features/modal/modalSlice";
import userReducer from "@/features/user/userSlice";
import alertReducer from "@/features/alert/alertSlice";

export const store = configureStore({
    reducer: {
        modal: modalReducer,
        user: userReducer,
        alert: alertReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;