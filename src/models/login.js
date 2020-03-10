import { UserLogin } from '@/services/login';
import { parse, stringify } from 'qs';
import { routerRedux } from 'dva/router';
export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}

const Model = {
  namespace: 'login',
  state: {
    status: undefined,
  },
  effects: {
    *UserLogin({ payload, callback }, { call, put }) {
      const { data } = yield call(UserLogin, payload);
      if (data && data.code === 0) {
        window.localStorage.setItem('token', data.data.token);
        if (callback) callback(data);
      }
    },
    *logout(_, { put }) {
      const { redirect } = getPageQuery(); // redirect
      window.localStorage.removeItem('token');
      window.localStorage.removeItem('userName');
      if (window.location.pathname !== '/login' && !redirect) {
        yield put(
          routerRedux.replace({
            pathname: '/login',
            search: stringify({
              redirect: window.location.href,
            }),
          }),
        );
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
