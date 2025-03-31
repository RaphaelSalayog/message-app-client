import axios from "axios";

interface IAxiosHelper {
    url?: string;
    pathname: string;
    method: "POST" | "GET" | "PUT" | "PATCH" | "DELETE";
    payload?: any;
}

const axiosHelper = async ({ url, pathname, method, payload }: IAxiosHelper) => {
    let headers: any = {
        "Content-Type": "application/json",
        Authorization: `Bearer `,
    };

    try {
        let resp = await axios({ url: `${url}${pathname}`, method, headers, data: payload });
        if (resp.statusText === "OK") {
            (resp as any).ok = true;
        }
        return resp;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                return error.response.data;
            }
        } else {
            return {
                status: 500,
                message: "Unexpected error!",
            };
        }
    }
};

export default axiosHelper;
