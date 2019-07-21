import axios from '@/utils/axios';

// 登录接口
export function UserLogin(params) {
  return axios.post('/web/easyaction/user/userLogin', params);
}
