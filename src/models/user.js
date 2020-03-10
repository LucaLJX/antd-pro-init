import { queryCurrent, query as queryUsers } from '@/services/user';
import { logout, getInfo } from '@/services/BasicLayout';

const UserModel = {
  namespace: 'user',
  state: {
    currentUser: {},
  },
  effects: {
    *getInfo({ payload, callback }, { call, put }) {
      const data = yield call(getInfo, payload);
      const res = data.data.data;
      yield put({
        type: 'saveCurrentUser',
        payload: res,
      });
    },
    *logout({ payload, callback }, { call, put }) {
      const data = yield call(logout, payload);
      if (callback && data.data.code === 0) {
        callback({ code: 0 });
      }
    },
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },

    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
  },
  reducers: {
    saveCurrentUser(state, action) {
      return { ...state, currentUser: action.payload || {} };
    },

    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};
export default UserModel;
