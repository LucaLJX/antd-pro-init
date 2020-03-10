import { http } from '@/utils/http';

export function getInfo() {
  return http.postRequestParam('/web/easyaction/user/getSimpleUserInfo');
}

// 登出
export function logout() {
  return http.postRequestParam('/web/easyaction/user/signout');
}

// 获取左侧菜单
export function getMenu(params) {
  return http.postRequestParam('/web/easyaction/user/queryMenu', params);
}

export function applayToUpload(params) {
  return http.postRequestParam('/web/easyaction/alioss/applyToUpload', params);
}

export function uploadFile(url, params) {
  return http.upload(url, params);
}
