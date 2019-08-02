import {
  getSenceData,
  getOldHeader,
  initHeader,
  getOldData,
  getNewRole,
  createSence
} from '@/services/SenceManage';
import _ from 'lodash'

const Model = {
  namespace: 'senceManage',
  state: {
    senceList: [],
    senceHeader: [],
    totalCount: 0,
    getHeader: false,
    header: []
  },
  effects: {
    *clearHeader ({ payload, callback }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          header: [],
          getHeader: false
        }
      })
    },
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
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
export default Model;
