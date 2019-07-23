import { http } from '@/utils/http'

// 登录接口
export function UserLogin(params) {
  return http.postRequestParam('/web/easyaction/user/userLogin', params, 'data');
}
