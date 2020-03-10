import { getMenu, logout, getInfo, applayToUpload, uploadFile } from '@/services/BasicLayout';

const Model = {
  namespace: 'basicLayout',
  state: {
    projectListData: [],
    projectTypesData: [],
    menuData: [],
    breadcrumbData: [],
  },
  effects: {
    *getMenu({ payload, callback }, { call, put }) {
      const data = yield call(getMenu, payload);
      const list = data.data.data;
      const menuData = list.map(item => {
        if (item.name && item.path) {
          if (item.path.substring(0, 1) !== '/') {
            item.path = '/' + item.path;
          }
          return item;
        }
      });
      yield put({
        type: 'save',
        payload: {
          menuData: menuData,
        },
      });
    },
    *uploadPhoto({ payload, file, success, fail }, { call, put }) {
      try {
        const fileName = file.name.split('.');
        fileName.splice(fileName.length - 1, 1);
        const { data } = yield call(applayToUpload, Object.assign(payload, { busiType: 'photo', fileName: file.name }));
        const res = data.data;
        res.key = res.dir + res.key;
        if (data.code != 0) throw new Error(data.msg);
        const result = yield call(uploadFile, res.uploadUrl, Object.assign(res, { file }));
        if (success) success(result.data);
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
