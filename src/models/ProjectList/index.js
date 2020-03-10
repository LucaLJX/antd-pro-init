import {
  getCurrentProjects,
  getProjectsAllTypes,
  getProjectsAllDepartments,
  addProject,
  editProject,
  getProjectDetail,
} from '@/services/ProjectList';

const Model = {
  namespace: 'projectList',
  state: {
    projectListData: [],
    projectTypesData: [],
    projectDepartmentsData: [],
  },
  effects: {
    *getCurrentProjects({ payload }, { call, put }) {
      const { data } = yield call(getCurrentProjects, payload);
      if (data && data.code === 0) {
        yield put({ type: 'save', payload: { projectListData: data.data } });
      }
    },
    *getProjectsAllTypes({ payload }, { call, put }) {
      const { data } = yield call(getProjectsAllTypes, payload);
      if (data && data.code === 0) {
        yield put({ type: 'save', payload: { projectTypesData: data.data } });
      }
    },
    *getProjectsAllDepartments({ payload }, { call, put }) {
      const { data } = yield call(getProjectsAllDepartments, payload);
      if (data && data.code === 0) {
        yield put({ type: 'save', payload: { projectDepartmentsData: data.data } });
      }
    },
    *addProject({ payload, success, fail }, { call, put }) {
      try {
        const { data } = yield call(addProject, payload);
        if (data.code == 0 && success) success(data.data);
        if (data.code != 0) throw new Error(data.msg);
      } catch (err) {
        if (fail) fail(err);
      }
    },
    *editProject({ payload, success, fail }, { call, put }) {
      try {
        const { data } = yield call(editProject, payload);
        if (data.code !== 0) throw new Error(data.msg);
        const response = yield call(getProjectDetail, payload);
        if (response.data.code == 0 && success) success(response.data.data);
        if (response.data.code != 0) throw new Error(response.data.msg);
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
