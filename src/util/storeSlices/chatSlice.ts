import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IGetConversationState {
    id: number;
    conversationId: number;
    senderId: number;
    receiverId: number;
    content: string;
    timestamp: string;
    createdAt: string;
    updatedAt: string;
}

interface InitialState {
    getConversation: IGetConversationState[];
}

const initialState: InitialState = {
    getConversation: [],
};

const chatSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setReceivedMessage: (state, { payload }: PayloadAction<IGetConversationState>) => {
            if (Object.keys(payload).length !== 0) {
                state.getConversation.push(payload);
            }
        },
    },
});

export const { setReceivedMessage } = chatSlice.actions;
export default chatSlice.reducer;
