import { AxiosInstance, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import i18n from "../i18n";
import { LoginSuccessResponse } from "../utils/type/AuthInterface";
import { NormalizedResponse } from "../utils/type/common";
import { refreshLogin } from "./Auth";
import { logoutAndgoToLogin, setToken } from "./browser";

let refreshTokenPromiseResponse:
  | Promise<NormalizedResponse<LoginSuccessResponse>>
  | undefined = undefined;

export const handleResponse = async (
  response: AxiosResponse<any>
): Promise<NormalizedResponse<any>> => {
  return Promise.resolve({
    data: response.data,
    statusCode: response.status,
    isSuccess: true,
  });
};

export const handleError = (error: any, shouldFireMessage?: boolean) => {
  const errorMessage = error?.message || error?.response?.message || "Error";
  shouldFireMessage && toast.error(errorMessage);
  return Promise.resolve({
    errorMessage,
    statusCode: error?.response?.status,
    isSuccess: false,
  });
};

export const handleInvalidAccessToken = async (
  error: any,
  axiosInstance: AxiosInstance
) => {
  if (!refreshTokenPromiseResponse) {
    refreshTokenPromiseResponse = refreshLogin();
  }
  const { statusCode, data } = await refreshTokenPromiseResponse;
  refreshTokenPromiseResponse = undefined;
  // console.log(statusCode, data);

  // if (statusCode === 200 && data?.access_token && data?.refresh_token) {
  //   setToken(data.access_token, data.refresh_token);

  //   const config = {
  //     ...error.config,
  //     headers: {
  //       ...error.config.headers,
  //     },
  //   };
  //   return axiosInstance.request(config) as Promise<NormalizedResponse<any>>;
  // } else {
  //   if (!window.location.pathname.startsWith("/auth")) {
  //     toast.error(i18n.t<string>("Session timeout"));
  //     await logoutAndgoToLogin();
  //   }
  //   return handleError(error, false);
  // }
};
