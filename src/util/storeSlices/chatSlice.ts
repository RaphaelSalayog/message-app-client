import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IGetCurrentConversationState {
    id: number;
    user1Id: number;
    user2Id: number;
    createdAt: string;
    updatedAt: string;
}

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
    getCurrentConversation: IGetCurrentConversationState;
    getReceivedMessage: IGetConversationState;
}

const initialState: InitialState = {
    getCurrentConversation: {
        id: 0,
        user1Id: 0,
        user2Id: 0,
        createdAt: "",
        updatedAt: "",
    },
    getReceivedMessage: {
        id: 0,
        conversationId: 0,
        senderId: 0,
        receiverId: 0,
        content: "",
        timestamp: "",
        createdAt: "",
        updatedAt: "",
    },
};

const chatSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setCurrentConversation: (
            state,
            { payload }: PayloadAction<IGetCurrentConversationState>
        ) => {
            state.getCurrentConversation = payload;
        },
        setReceivedMessage: (state, { payload }: PayloadAction<IGetConversationState>) => {
            state.getReceivedMessage = payload;
        },
    },
});

export const { setCurrentConversation, setReceivedMessage } = chatSlice.actions;
export default chatSlice.reducer;
