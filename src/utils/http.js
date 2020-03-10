import axios from 'axios';
import { Component } from 'react';
import Qs from 'qs';
import { message } from 'antd';

let base = '/api';

// 请求前拦截
axios.interceptors.request.use(
  config => {
    // 请求超时时间
    config.timeout = 5000;
    return config;
  },
  err => {
    console.log('请求超时');
    return Promise.reject(err);
  },
);

// 返回后拦截
axios.interceptors.response.use(
  response => {
    // 响应拦截
    // 不是系统接口直接返回response
    if (response.data.code === undefined) return response;
    if (response.data.code !== 0) {
      message.error(response.data.msg);
    }
    if (response.data.code === 18) {
      window.location.replace('/login');
    }
    return response;
  },
  err => {
    // if (err.response.status === 504 || err.response.status === 404) {
    //   console.log('服务器被吃了⊙﹏⊙∥')
    // } else if (err.response.status === 401) {
    //   console.log('登录信息失效⊙﹏⊙∥')
    // } else if (err.response.status === 500) {
    //   console.log('服务器开小差了⊙﹏⊙∥')
    // }
    message.error(err.message);
    return Promise.reject(err);
  },
);

// @RequestBody请求
const postRequestBody = (url, params) => {
  return axios({
    method: 'post',
    url: `${base}${url}`,
    data: params,
    headers: {
      'Content-Type': 'application/json',
      charset: 'utf-8',
      token: window.localStorage.getItem('token'),
    },
  });
};

// @RequsetParam请求
const postRequestParam = (url, params, type = 'data') => {
  return axios({
    method: 'post',
    url: `${base}${url}`,
    data: type === 'data' ? params : null,
    params: type === 'params' ? params : null,
    paramsSerializer: params => {
      return Qs.stringify(params, { arrayFormat: 'brackets' });
    },
    transformRequest: [
      data => {
        return Qs.stringify(data);
      },
      // function(data) {
      //   let ret = ''
      //   for (let it in data) {
      //     ret +=
      //       encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      //   }
      //   return ret
      // }
    ],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      token: window.localStorage.getItem('token'),
    },
  });
};

const get = (url, params) => {
  return axios({
    method: 'get',
    headers: {
      token: window.localStorage.getItem('token'),
    },
    url: `${base}${url}`,
    params: params,
  });
};

const upload = (url, data) => {
  var formData = new FormData();
  for (let key in data) {
    formData.append(key, data[key]);
  }
  return axios.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

const multiple = function(requsetArray, callback) {
  axios.all(requsetArray).then(axios.spread(callback));
};

export const http = {
  get,
  upload,
  postRequestParam: postRequestParam,
  postRequestBody: postRequestBody,
};
