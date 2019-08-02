import { getMenu, logout, getInfo } from '@/services/BasicLayout'

const Model = {
  namespace: 'basicLayout',
  state: {
    projectListData: [],
    projectTypesData: [],
    menuData: [],
    breadcrumbData: [],
    nickName: '',
    avatarUrl: ''
  },
  effects: {
    *getInfo ({ payload, callback }, { call, put }) {
      const data = yield call(getInfo, payload)
      const res = data.data.data
      yield put({
        type: 'save',
        payload: {
          nickName: res.nickName,
          avatarUrl: res.avatarUrl
        }
      })
    },
    *logout ({ payload, callback }, { call, put }) {
      const data = yield call(logout, payload)
      if (callback && data.data.code === 0) {
        callback({ code: 0 })
      }
    },
    *getMenu ({ payload, callback }, { call, put }) {
      const data = yield call(getMenu, payload)
      const list = data.data.data
      const menuData = list.map((item) => {
        if (item.name && item.path) {
          if (item.path.substring(0, 1) !== '/') {
            item.path = '/' + item.path
          }
          return item
        }
      })
      yield put({
        type: 'save',
        payload: {
          menuData: menuData
        }
      })
    },
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
export default Model;
