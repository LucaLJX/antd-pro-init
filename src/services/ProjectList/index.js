import { http } from '@/utils/http';

// 获取项目列表
export function getCurrentProjects(params) {
  return http.postRequestParam('/web/easyaction/user/getCurrentProjects', params);
}

// 获取项目类型
export function getProjectsAllTypes(params) {
  return http.postRequestParam('/web/easyaction/projectType/queryAll', params);
}

export function getProjectsAllDepartments(params) {
  return http.postRequestParam('/web/easyaction/department/queryAvailable', params);
}

export function addProject(params) {
  return http.postRequestBody('/web/easyaction/project/addProject', params);
}

export function editProject(params) {
  return http.postRequestParam('/web/easyaction/project/modifyBasic', params);
}

export function getProjectDetail(params) {
  return http.postRequestParam('/web/easyaction/project/queryDetail', params);
}
