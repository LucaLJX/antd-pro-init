import axios from 'axios';
import Qs from 'qs';
import { message } from 'antd';

const instance = axios.create({
  baseURL: '/api/',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    // 'Content-Type': "application/json",
    'token': window.localStorage.getItem('token')
  },
  // 超时为5s 上线后是3s
  timeout: 5000,
  paramsSerializer: (params) => {
    return Qs.stringify(params, { arrayFormat: 'brackets' });
  },
  transformRequest: [data => {
    // 对 data 进行任意转换处理
    return Qs.stringify(data); // 编码格式
  }],
});

// 请求拦截处理
// 添加请求拦截器
instance.interceptors.request.use(config => {
  // 在发送请求之前做些什么
  // 能做的事如下 检查权限 增加页面loading  网络状态判断等
  return config;
}, error => {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use(response => {
  // 对响应数据做点什么
  if (response.data.code !== 0) {
    message.error(response.data.msg);
  }
  if (response.data.code === 18) {
    window.location.replace('/login');
  }
  return response;
}, error => {
  // 对响应错误做点什么
  // 例如用户请求失效，返回登录页什么的
  return Promise.reject(error);
});

export default instance;
