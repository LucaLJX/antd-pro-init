import { getCharacterData } from '@/services/CharacterManage';
import _ from 'lodash';

const Model = {
  namespace: 'characterManage',
  state: {},
  effects: {
    *getCharacterData({ payload, success, fail }, { call, put }) {
      try {
        const { data } = yield call(getCharacterData, payload.params);
        const res = data.data;
        if (data.code == 0 && success) success(data.data);
        if (data.code != 0 && fail) throw new Error(data.msg);
      } catch (err) {
        if (fail) fail(err);
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
