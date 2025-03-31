import axiosHelper from "@/util/axios";

const url = process.env.NEXT_PUBLIC_API_URL;

interface IGetMessagesByConversationApi {
    payload: {
        conversationId: number;
    };
}

export interface ICreateConversationApi {
    payload: {
        senderId: number;
        receiverId: number;
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

export const getAllUsersApi = async () => {
    return await axiosHelper({
        url: url,
        pathname: "/users/getAllUsers",
        method: "GET",
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
