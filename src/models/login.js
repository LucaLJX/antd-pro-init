import { UserLogin } from '@/services/login';

const Model = {
  namespace: 'login',
  state: {
    status: undefined,
  },
  effects: {
    *UserLogin({ payload, callback }, { call, put }) {
      const { data } = yield call(UserLogin, payload);
      if (data && data.code === 0) {
        if (callback) callback(data);
      }
    },
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      return { ...state, status: payload.status, type: payload.type };
    },
  },
};
export default Model;
