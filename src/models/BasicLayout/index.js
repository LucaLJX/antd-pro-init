import { getMenu } from '@/services/BasicLayout'

const Model = {
  namespace: 'basicLayout',
  state: {
    projectListData: [],
    projectTypesData: [],
    menuData: []
  },
  effects: {
    *getMenu ({ payload, callback }, { call, put }) {
      console.log('getMenu')
      const data = yield call(getMenu, payload)
      console.log(data)
      // -------
      // todo: del
      // yield put({
      //   type: 'save',
      //   payload: {
      //     menuData: data
      //     // menuData: []
      //   }
      // })
      // return 
      // ------
      const list = data.data.data
      const menuData = list.map((item) => {
        if (item.name && item.path) {
          return item
        }
      })
      menuData.unshift({
        path: '/project/:id',
        name: '控制台',
        icon: 'fund'
      })
      console.log(menuData)
      yield put({
        type: 'save',
        payload: {
          menuData: menuData
          // menuData: []
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
