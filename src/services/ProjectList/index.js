import axios from '@/utils/axios'

// 获取项目列表
export function getCurrentProjects(params) {
  return axios.post('/web/easyaction/user/getCurrentProjects', params);
}

// 获取项目类型
export function getProjectsAllTypes(params) {
  return axios.post('/web/easyaction/projectType/queryAll', params);
}
