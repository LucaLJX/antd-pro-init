import { http } from '@/utils/http'

// 获取场次数据
export const getSenceData = (params) => {
  return http.postRequestParam('/v2/web/easyaction/scene/queryTable', params, 'params')
}
