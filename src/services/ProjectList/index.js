import { http } from '@/utils/http'

// 获取项目列表
export function getCurrentProjects(params) {
  return http.postRequestParam('/web/easyaction/user/getCurrentProjects', params)
}

// 获取项目类型
export function getProjectsAllTypes(params) {
  return http.postRequestParam('/web/easyaction/projectType/queryAll', params)
}
