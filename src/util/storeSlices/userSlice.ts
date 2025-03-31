import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
    token: string;
    id: number;
    email: string;
    name: string;
}

const initialState: UserState = {
    token: "",
    id: 0,
    email: "",
    name: "",
};

const counterSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, { payload }: PayloadAction<UserState>) => payload,
    },
});

export const { setUser } = counterSlice.actions;
export default counterSlice.reducer;
