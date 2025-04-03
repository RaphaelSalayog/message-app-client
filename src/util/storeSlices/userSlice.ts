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

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, { payload }: PayloadAction<UserState>) => payload,
    },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
