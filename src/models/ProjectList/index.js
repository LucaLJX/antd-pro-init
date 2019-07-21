import { getCurrentProjects, getProjectsAllTypes } from '@/services/ProjectList';

const Model = {
  namespace: 'projectList',
  state: {
    projectListData: [],
    projectTypesData: [],
  },
  effects: {
    *getCurrentProjects({ payload, callback }, { call, put }) {
      const { data } = yield call(getCurrentProjects, payload);
      if (data && data.code === 0) {
        yield put({ type: 'save', payload: { projectListData: data.data } });
      }
    },
    *getProjectsAllTypes({ payload, callback }, { call, put }) {
      const { data } = yield call(getProjectsAllTypes, payload);
      if (data && data.code === 0) {
        yield put({ type: 'save', payload: { projectTypesData: data.data } });
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
