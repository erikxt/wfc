import { AxiosRequestConfig } from "axios";
import http from "./http";

const ApiService = {
  getSubject(id: number) {
    return http.get("/subject/" + id);
  },
  getSubjectIds() {
    return http.get("/subject", { params: {"fields": "id"} });
  },
};

export default ApiService;
