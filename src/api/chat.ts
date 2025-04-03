import axiosHelper from "@/util/axios";

const url = process.env.NEXT_PUBLIC_API_URL;

interface IGetAllUsersApiApi {
    payload: {
        userId: number;
    };
}

interface IGetMessagesByConversationApi {
    payload: {
        conversationId: number;
    };
}

export interface ICreateConversationApi {
    payload: {
        user1Id: number;
        user2Id: number;
    };
}

interface ISendMessageApi {
    payload: {
        senderId: number;
        receiverId: number;
        conversationId: number;
        content: string;
    };
}

export const getAllUsersApi = async ({ payload }: IGetAllUsersApiApi) => {
    return await axiosHelper({
        url: url,
        pathname: "/users/getAllUsers",
        method: "POST",
        payload: payload,
    });
};

export const getMessagesByConversationApi = async ({ payload }: IGetMessagesByConversationApi) => {
    return await axiosHelper({
        url: url,
        pathname: "/conversation/getMessagesByConversation",
        method: "POST",
        payload: payload,
    });
};

export const createConversationApi = async ({ payload }: ICreateConversationApi) => {
    return await axiosHelper({
        url: url,
        pathname: "/conversation/createConversation",
        method: "POST",
        payload: payload,
    });
};

export const sendMessageApi = async ({ payload }: ISendMessageApi) => {
    return await axiosHelper({
        url: url,
        pathname: "/message/sendMessage",
        method: "POST",
        payload: payload,
    });
};
