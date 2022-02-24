import axios from "axios";
import getConfig from "next/config";
const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();
// 创建axios实例
const instance = axios.create({
  baseURL: publicRuntimeConfig.apiHost,
  timeout: 10000,
});
instance.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);
export default instance;