import {
  getSenceData,
  getOldHeader,
  initHeader,
  getOldData,
  getNewRole,
  createSence
} from '@/services/SenceManage';
import _ from 'lodash'

// 获取某个类型的数据
const initData = (data, type, projectId) => {
  console.log(data)
  console.log(type)
  let typeName = ''
  if (type === 'charact2') {
    typeName = '4'
  } else if (type === 'charact4') {
    typeName = '2'
  } 
  if (type !== 'charact2' && type !== 'charact4') {
    return []
  }
  if (!data || data.length === 0 || !type) {
    return []
  }
  let list = []
  for (let i = 0; i < data.length; i++) {
    const node = data[i]
    if (node[type] && node[type].length !== 0) {
      for (let j = 0; j < node[type].length; j++) {
        const characterNode = node[type][j]
        list.push({
          projectId: projectId,
          gender: '',
          shortName: '',
          fullName: characterNode.name || '',
          alias: '',
          characterType: typeName
        })
      }
    }
  }
  const res = _.uniqBy(list, 'fullName')
  return res
}

// 处理数据
const initOldTableData = async (data, projectId) => {
  const roleData = await getNewRole()
  console.log(data)
  console.log(projectId)
  console.log(roleData)
  // 先处理主演的数组
  const oldHeader = (await getOldHeader()).data
  console.log(oldHeader)
  const type_1_filter = _.filter(oldHeader, (item) => {
    const key = item.key
    return key.indexOf('character-') !== -1
  })
  const old_type_1 = type_1_filter.map((item) => {
    return {
      name: item.name,
      key: item.key
    }
  })
  console.log('old_type_1')
  console.log(old_type_1)
  // 主演 character-
  const type_1_data = roleData.type_1
  // 群演 charact4
  const type_2_data = roleData.type_2
  // 特约 charact2
  const type_4_data = roleData.type_4
  let list = []
  if (!projectId || !data) {
    return []
  }
  for (let i = 0; i < data.length; i++) {
    const node = data[i]
    let newSenceitem = {
      projectId: projectId,
      episodeNum: node.episodeNum,
      sceneNum: node.sceneNum,
      wuPage: node.wuPage,
      wenPage: node.wenPage,
      pages: node.pages,
      space: node.space,
      time: node.time,
      summary: node.summary,
      location: [
        {
          locationName: node.location,
          columnId: 15
        }
      ]
    }
    // 找群演 type 为 2 
    let type_2_arr = []
    if (node.charact4) {
      // 判断是不是数组
      if (node.charact4 instanceof Array) {
        for (let j = 0; j < node.charact4.length; j++) {
          const charact4Node = node.charact4[j];
          const newRole = _.find(type_2_data, (item) => {
            return item.name === charact4Node.name
          })
          if (newRole) {
            type_2_arr.push({
              id:newRole.id
            })
          }
        }
      }
    }
    newSenceitem.characterGroup = type_2_arr
    // 找特约 type 为 4
    let type_4_arr = []
    if (node.charact2) {
      // 判断是不是数组
      if (node.charact2 instanceof Array) {
        for (let j = 0; j < node.charact2.length; j++) {
          const charact2Node = node.charact2[j];
          const newRole = _.find(type_4_data, (item) => {
            return item.name === charact2Node.name
          })
          if (newRole) {
            type_4_arr.push({
              id: newRole.id
            })
          }
        }
      }
    }
    newSenceitem.characterFreelance = type_4_arr
    // 找主演 type 为 1
    // 获取所有的key
    const keys = Object.keys(node)
    let names = []
    let type_1_arr = []
    for (let x = 0; x < keys.length; x++) {
      const x_node = keys[x];
      const x_obj = _.find(old_type_1, (item) => {
        return x_node === item.key
      })
      if (x_obj) {
        names.push(x_obj.name)
      }
    }
    if (names.length !== 0) {
    }
    for (let y = 0; y < names.length; y++) {
      const names_y = names[y];
      const newRole = _.find(type_1_data, (item) => {
        return names_y === item.name
      })
      if (newRole) {
        type_1_arr.push({
          id: newRole.id
        })
      }
    }
    newSenceitem.characterHead = type_1_arr
    list.push(newSenceitem)
  }
  return list
}

const Model = {
  namespace: 'catchSenceManage',
  state: {
    senceList: [],
    senceHeader: [],
    totalCount: 0,
    getHeader: false,
    header: []
  },
  effects: {
    *setHeader ({ payload, callback }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          header: payload.header,
          getHeader: true
        }
      })
    },
    *getSenceData ({ payload, callback }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          senceHeader: [],
          senceList: [],
          totalCount: 0
        }
      })
      const { data } = yield call(getSenceData, payload.params)
      const res = data.data
      let list = []
      if (res.recordList && res.recordList.length !== 0) {
        list = res.recordList.map((item, i) => {
          return Object.assign(item, {
            key: `senceList${i}`
          })
        })
      }
      // if (payload.getHeader) {
      //   return yield put({
      //     type: 'save',
      //     payload: {
      //       senceList: list,
      //       totalCount: res.recordCount
      //     }
      //   })
      // }
      yield put({
        type: 'save',
        payload: {
          senceHeader: res.recordHead,
          senceList: list,
          totalCount: res.recordCount,
        }
      })
      if (callback) {
        callback({
          header: res.recordHead,
          getHeader: false
        })
      }
    },
    async initTableData ({payload, callback}, {call, put}) {
      const oldTableData = await getOldData()
      const sences = await initOldTableData(oldTableData, payload)
      console.log('sences')
      console.log(sences)
      // await createSence({
      //   "projectId":"2facc298dc7246e89c65ad426b2b4195",
      //   "episodeNum":"60",
      //   "sceneNum":"1",
      //   "summary":"测试测试",
      //   "time":"日",
      //   "space":"内",
      //   "wenPage":"0.1",
      //   "characterHead":[{"id":8937}],
      //   "characterFreelance":[{"id":"9210"}],
      //   "characterGroup":[{"id":"9031"}]
      // })
      const testParam = {
        projectId: '2facc298dc7246e89c65ad426b2b4195',
        episodeNum: '70',
        sceneNum: '11',
        summary: '测试测试',
        space: '内',
        time: '日',
        wuPage: '0.1',
        wenPage: '0.1',
        characterGroup: [{
          id: 9031
        }],
        characterFreelance: [{
          id: 9210
        }],
        characterHead: [{
          id: 8937
        }]
        
      }
      // await createSence(testParam)
      return 
      for (let i = 0; i < sences.length; i++) {
        const node = sences[i]
        console.log(node)
        const { data } = await createSence(node)
        console.log(data)
      }
    },
    // 初始化角色
    async initHeader ({ payload, callback }, { call, put }) {
      console.log(payload)
      const paramsType = {
        projectId: payload,
        gender: '',
        shortName: '',
        fullName: '',
        alias: '',
        characterType: ''
      }
      const oldTableData = await getOldData()
      console.log('oldTableData')
      console.log(oldTableData)
      // ----------------
      // 获取特约数据 type 4
      const type_4_data = initData(oldTableData, 'charact2', payload)
      console.log('type_4_data')
      console.log(type_4_data)
      let type_4_res = []
      for (let i = 0; i < type_4_data.length; i++) {
        const node = type_4_data[i]
        const { data } = await initHeader(node)
        type_4_res.push({
          name: node.fullName,
          type: '4',
          id: data.data
        })
        // type_4_res.push(node)
      }
      console.log(type_4_res)
      console.log('result')
      console.log(JSON.stringify(type_4_res))
      // ---------------------------------------
      // 获取群演数据 type 2 
      return false
      const type_2_data = initData(oldTableData, 'charact4', payload)
      console.log(type_2_data)
      let type_2_res = []
      for (let i = 0; i < type_2_data.length; i++) {
        const node = type_2_data[i]
        // const { data } = await initHeader(node)
        type_2_res.push({
          name: node.fullName,
          type: '2',
          id: data.data
        })
        // type_2_res.push(node)
      }
      // console.log(type_2_res)
      console.log('result')
      console.log(JSON.stringify(type_2_res))
      // ------------------------------------
      return false
      // 获取主角的角色
      const oldData = await getOldHeader()
      const oldHeader = oldData.data
      let type_1 = [] // 主角 character- 新type 1
      let type_2 = [] // 群演 charact4 新type 2
      let type_3 = [] // 特约 charact2 新type 4
      let type_success_1 = []
      let type_success_2 = []
      let type_success_3 = []
      let type_faild_1 = []
      let type_faild_2 = []
      let type_faild_3 = []
      let type_1_newData = []
      const type_1_filter = _.filter(oldHeader, (item) => {
        const key = item.key
        return key.indexOf('character-') !== -1
      })
      type_1 = type_1_filter.map((item) => {
        return {
          projectId: payload,
          gender: '',
          shortName: item.shtName || '',
          fullName: item.name || '',
          alias: '',
          characterType: '1'
        }
      })
      const type_2_filter = _.filter(oldHeader, (item) => {
        const key = item.key
        return key === 'charact4'
      })
      type_2 = type_2_filter.map((item) => {
        return {
          projectId: payload,
          gender: '',
          shortName: item.shtName || '',
          fullName: item.name || '',
          alias: '',
          characterType: '2'
        }
      })
      const type_3_filter = _.filter(oldHeader, (item) => {
        const key = item.key
        return key === 'charact2'
      })
      type_3 = type_3_filter.map((item) => {
        return {
          projectId: payload,
          gender: '',
          shortName: item.shtName || '',
          fullName: item.name || '',
          alias: '',
          characterType: '4'
        }
      })
      console.log('start')
      console.log(type_1)
      let m = []
      // for (let i = 0; i < type_1.length; i++) {
      //   const node = type_1[i]
      //   const { data } = await initHeader(node)
      //   m.push({
      //     name: node.fullName,
      //     type: '1',
      //     id: data.data
      //   })
      // }
      console.log(JSON.stringify(m))
    }
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
export default Model;
