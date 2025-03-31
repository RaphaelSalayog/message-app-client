import axiosHelper from "@/util/axios";

const url = process.env.NEXT_PUBLIC_API_URL;

interface ISubmitLoginApi {
    payload: {
        email: string;
        password: string;
    };
}

export const submitLoginApi = async ({ payload }: ISubmitLoginApi) => {
    return await axiosHelper({
        url: url,
        pathname: "/login/submitLogin",
        method: "POST",
        payload: payload,
    });
};
