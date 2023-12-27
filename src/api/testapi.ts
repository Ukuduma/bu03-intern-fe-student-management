import { APICore } from "./axios";
const api = new APICore();

export const getApi = () => {
    return api.get("/api/v1/admin/courses")
}