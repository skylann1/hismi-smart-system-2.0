import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/app/store";

interface AlertState {
    isOpen: boolean
    status: boolean;
    title: string;
    message: string;
}

const initialState: AlertState = {
    isOpen: false,
    status: false,
    title: "",
    message: "",
}

const alertSlice = createSlice({
    name: "alert",
    initialState,
    reducers: {
        alertIsAktif: (
            state,
            action: PayloadAction<Omit<AlertState, "isOpen"> & { isOpen?: boolean }>
        ) => {
            state.isOpen = action.payload.isOpen ?? true;
            state.status = action.payload.status;
            state.title = action.payload.title;
            state.message = action.payload.message;
        },
        alertIsClose: (state) => {
            state.isOpen = false;
            state.status = false;
            state.title = "";
            state.message = "";
        }
    }
})

export const { alertIsAktif, alertIsClose } = alertSlice.actions;
export const selectAlert = (state: RootState) => state.alert;

export default alertSlice.reducer;