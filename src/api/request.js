import axios from 'axios';
import { getToken } from '@/utils/token';

const request = axios.create({
  // baseURL: 'http://101.37.87.187:8081/',
  //baseURL: 'http://39.99.234.229:9508/api',
  baseURL: 'http://127.0.0.1:8081/',
  timeout: 2000,
});

//请求拦截
request.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.authorization = token;
  }
  return config;
});

//响应拦截
request.interceptors.response.use(
  (res) => {
    const data = res.data;
    return data;
  },
  (err) => {
    console.log(err);
  },
);

export default request;
