import { http } from '@/utils/http';

// 获取角色数据
export const getCharacterData = params => {
  return http.postRequestParam('/web/easyaction/LineProducer/character/queryAll', params);
};
