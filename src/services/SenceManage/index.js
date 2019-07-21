import axios from '@/utils/axios'
import data from './data.json'
import headerData from './header.json'
import oldData from './allData.json'
import roleData from './newRole.json'

// 获取场次数据
export const getSenceData = (params) => {
  // return data
  // return axios.post('/v2/web/easyaction/scene/queryTable', params)
  return axios({
    method: 'post',
    url: '/v2/web/easyaction/scene/queryTable',
    params: params
  })
}

// 获取旧角色
export const getOldHeader = () => {
  // return new Promise((resolve, reject) => {
  //   setTimeout(() => {
  //     resolve(headerData)
  //   }, 2000)
  // })
  return headerData
}

export const getOldData = () => {
  return oldData.data.recordList
}

// 处理角色数据
export const initHeader = async (params) => {
  return axios({
    method: 'post',
    url: '/web/easyaction/character/create',
    data: params
  })
}

// 获取新角色
export const getNewRole = () => {
  return roleData
}

// 添加场次
export const createSence = async (params) => {
  return axios({
    method: 'post',
    url: '/web/easyaction/scene/createScene',
    data: params
  })
}

// 获取项目列表
export function getCurrentProjects(params) {
  return axios.post('/web/easyaction/user/getCurrentProjects', params);
}

// 获取项目类型
export function getProjectsAllTypes(params) {
  return axios.post('/web/easyaction/projectType/queryAll', params);
}
