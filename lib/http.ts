import axios from "axios";
// 创建axios实例
const instance = axios.create({
  baseURL: process.env.API_HOST,
  timeout: 10000,
});
export default instance;