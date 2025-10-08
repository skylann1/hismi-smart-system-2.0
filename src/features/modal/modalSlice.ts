import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/app/store";

interface ModalState {
    isOpen: boolean;
    modalProps?: {
        title: string;
        message: string;
        modalStatus: boolean;
        buttonActionTitle: string;
        redirectTo?: string | null
    }
}

const initialState: ModalState = {
    isOpen: false,
    modalProps: {
        title: "",
        message: "",
        modalStatus: false,
        buttonActionTitle: "",
        redirectTo: null
    }
}

export const modalSlice = createSlice({
    name: "modal",
    initialState,
    reducers: {
        modalIsAktif: (
            state,
            action: PayloadAction<Omit<ModalState, "isOpen"> & { isOpen?: boolean }>
        ) => {
            state.isOpen = action.payload.isOpen ?? true; 
            state.modalProps = action.payload.modalProps;
        },
        modalIsClose: (state) => {
            state.isOpen = false;
            state.modalProps = {
                title: "",
                message: "",
                modalStatus: false,
                buttonActionTitle: "",
                redirectTo: null
            }
        }
    }
})

export const { modalIsAktif, modalIsClose } = modalSlice.actions;
export const selectModal = (state: RootState) => state.modal;

export default modalSlice.reducer;