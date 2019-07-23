import { http } from '@/utils/http'
import data from './data.json'
import headerData from './header.json'
import oldData from './allData.json'
import roleData from './newRole.json'

// 获取场次数据
export const getSenceData = (params) => {
  return http.postRequestParam('/v2/web/easyaction/scene/queryTable', params, 'params')
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
  return http.postRequestParam('/web/easyaction/character/create', params)
}

// 获取新角色
export const getNewRole = () => {
  return roleData
}

// 添加场次
export const createSence = async (params) => {
  return http.postRequestBody('/web/easyaction/scene/createScene', params)
}
