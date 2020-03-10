import {
  getSenceData,
  getCharacterSimple,
  getLocationSimple,
  getPlaceSimple,
  modifySenceSimple,
  modifySenceCharacterState,
} from '@/services/SenceManage';
import {
  getLocationData
} from '@/services/Location'
import _ from 'lodash';

const Model = {
  namespace: 'location',
  state: {},
  effects: {
    *getLocationData({ payload, success, fail }, { call, put }) {
      try {
        const { data } = yield call(getLocationData, payload.params);
        if (data.code == 0 && success) success(data.data);
        if (data.code != 0 && fail) fail(data.msg);
      } catch (err) {
        if (fail) fail(err);
      }
    },
    *getSenceData({ payload, success, fail }, { call, put }) {
      try {
        const { data } = yield call(getSenceData, payload.params);
        const res = data.data;
        if (data.code == 0 && success) success(data.data);
        if (data.code != 0 && fail) fail(data.msg);
      } catch (err) {
        if (fail) fail(err);
      }
    },
    *modifySenceSimple({ payload, success, fail }, { call, put }) {
      try {
        const key = payload.key;
        let handler = null;
        const params = {};
        params.projectId = payload.id;
        params.sceneId = payload.sceneId;
        switch (key) {
          case 'character':
            handler = modifySenceCharacterState;
            params.characterId = payload.characterId;
            params.state = payload.value;
            break;
          default:
            handler = modifySenceSimple;
            params[payload.key] = payload.value;
            break;
        }
        if (!handler && success) return success();
        const { data } = yield call(handler, params);
        if (data.code == 0 && success) success(data.data);
        if (data.code != 0 && fail) fail(data.msg);
      } catch (err) {
        if (fail) fail(err);
      }
    },
    *getSelectData({ payload, success, fail }, { call, put }) {
      try {
        const key = payload.key;
        let handler = null;
        const params = { projectId: payload.id };
        switch (key) {
          case 'location':
            handler = getLocationSimple;
            params.columnId = payload.value;
            break;
          case 'character':
            handler = getCharacterSimple;
            params.characterType = payload.value;
            break;
          case 'place':
            handler = getPlaceSimple;
            break;
        }
        if (!handler && success) return success([]);
        const { data } = yield call(handler, params);
        const res = data.data;
        if (params.all && success) success(res);
        const list = [];
        switch (key) {
          case 'location':
            res.forEach(item => {
              list.push({ label: item.locationName, value: item.id });
            });
            break;
          case 'character':
            res.forEach(item => {
              list.push({ label: item.characterFullName, value: item.characterId });
            });
            break;
          case 'place':
            res.forEach(item => {
              list.push({ label: item, value: item });
            });
            break;
        }
        if (data.code == 0 && success) success(data.data);
        if (data.code != 0 && fail) fail(data.msg);
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
