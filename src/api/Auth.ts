import axios from "axios";
import { LoginSuccessResponse } from "../utils/type/AuthInterface";
import { NormalizedResponse } from "../utils/type/common";
import { getRefreshToken } from "./browser";
import { handleError, handleResponse } from "./generics";
const axiosApi = axios.create();
// intercepting to capture errors
axiosApi.interceptors.response.use(
  async (response): Promise<NormalizedResponse<any>> => {
    return handleResponse(response);
  },
  async (error): Promise<NormalizedResponse<any>> => {
    return handleError(error);
  }
);

export function login(params: { username: string; password: string }) {
  const baseUrl = "/api/v1/auth/login";
  console.log({
    username: params.username,
    password: params.password
  });

  const payload = new URLSearchParams();
  // payload.set("username", params.username);
  // payload.set("password", params.password);
  // payload.set("grant_type", "password");
  // payload.set("client_id", "hieunht");

  return axiosApi.post(baseUrl, {
    username: params.username,
    password: params.password
  }, {
    // headers: {
    //   "Content-type": "application/x-www-form-urlencoded",
    // },
  }) as Promise<
    NormalizedResponse<LoginSuccessResponse>
  >;
}

export function refreshLogin() {
  // const baseUrl = "/realms/base-react/protocol/openid-connect/token";
  const baseUrl = "/api/v1/auth/login";
  const payload = new URLSearchParams();
  // payload.set("grant_type", "refresh_token");
  // payload.set("client_id", "hieunht");
  // payload.set("refresh_token", getRefreshToken() || "");
  return axiosApi.post(baseUrl, payload.toString()) as Promise<
    NormalizedResponse<LoginSuccessResponse>
  >;
}
