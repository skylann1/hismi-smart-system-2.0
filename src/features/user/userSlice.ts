import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/app/store";
import type { UserType } from "@/types";


const initialState: UserType = {
    id: "",
    nama: "",
    email: "",
    tanggal_lahir: "",
    no_hp: "",
    nim: "",
    jenjang_pendidikan: "",
    semester: 1,
    tipe_kelas: "",
    tahun_masuk: "",
    divisi: "",
    role: "",
    imageUrl: "",
    access: [],
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<UserType>) => {
            state.id = action.payload.id;
            state.nama = action.payload.nama;
            state.email = action.payload.email;
            state.tanggal_lahir = action.payload.tanggal_lahir;
            state.no_hp = action.payload.no_hp;
            state.nim = action.payload.nim;
            state.jenjang_pendidikan = action.payload.jenjang_pendidikan;
            state.semester = action.payload.semester;
            state.tipe_kelas = action.payload.tipe_kelas;
            state.tahun_masuk = action.payload.tahun_masuk;
            state.divisi = action.payload.divisi;
            state.role = action.payload.role;
            state.image = action.payload.image;
            state.imageUrl = action.payload.imageUrl;
            state.access = action.payload.access;
        },

        resetUser() {
            return initialState
        }
    },
});

export const { setUser } = userSlice.actions;
export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer