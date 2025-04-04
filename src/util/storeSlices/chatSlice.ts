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
        setConversation: (state, { payload }: PayloadAction<IGetConversationState[]>) => {
            state.getConversation = payload;
        },
        pushReceivedMessage: (state, { payload }: PayloadAction<IGetConversationState>) => {
            if (Object.keys(payload).length !== 0) {
                state.getConversation.push(payload);
            }
        },
    },
});

export const { pushReceivedMessage, setConversation } = chatSlice.actions;
export default chatSlice.reducer;
