import { AxiosRequestConfig } from "axios";
import http from "./http";

interface Param {
  [key: string] : string
}

const ApiService = {
  getSubject(id: number) {
    return http.get("/subject/" + id);
  },
  getSubjectIds() {
    return http.get("/subject", { params: { fields: "id" } });
  },
  getCategories() {
    return http.get("/category");
  },
  getCategory(id: number) {
    return http.get("/category/" + id);
  },
  getInfos(primaryCateId: number) {
    return http.get("/category/" + primaryCateId + "/info");
  },
  getInfo(primaryCateId: number, id: number) {
    return http.get("/category/" + primaryCateId + "/info/" + id);
  },
  getPage(params: Param) {
    return http.get("/page", { params: params });
  },
};

export default ApiService;
