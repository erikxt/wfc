import { AxiosRequestConfig } from "axios";
import http from "./http";

interface Param {
  [key: string]: object;
}

const ApiService = {
  getSubject(id: number) {
    return http.get("/subject/" + id);
  },
  getSubjectIds() {
    return http.get("/subject", { params: { fields: "id" } });
  },
  getAllSubjectIds() {
    return http.get("/subject/id/all");
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
  getLabels(primaryCateId: number, id: number) {
    return http.get("/category/" + primaryCateId + "/info/" + id + "/label/");
  },
  getPage(params: any) {
    return http.get("/page", { params: params });
  },
};

export default ApiService;
