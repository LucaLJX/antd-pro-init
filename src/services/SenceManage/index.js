import { http } from '@/utils/http';

// 获取场次数据
export const getSenceData = params => {
  return http.postRequestBody('/web/easyaction/scene/queryOptions', params);
};

// 场景-查询场景表单补全信息
export const getLocationSimple = params => {
  return http.postRequestParam('/web/easyaction/LineProducer/location/querySimple', params, 'params');
};

// 角色-查询角色表单补全信息
export const getCharacterSimple = params => {
  return http.postRequestParam('/web/easyaction/LineProducer/characters/querySimple', params, 'params');
};

export const getPlaceSimple = params => {
  return http.postRequestParam('/web/easyaction/place/querySimple', params);
};

// 修改场次数据
export const modifySenceSimple = params => {
  return http.postRequestBody('/web/easyaction/scene/modifySimple', params);
};

// 修改场次数据
export const modifySenceCharacterState = params => {
  return http.postRequestParam('/web/easyaction/scene/modifyCharacterState', params, 'params');
};
