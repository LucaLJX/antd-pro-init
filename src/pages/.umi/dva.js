import dva from 'dva';
import { Component } from 'react';
import createLoading from 'dva-loading';
import history from '@tmp/history';

let app = null;

export function _onCreate() {
  const plugins = require('umi/_runtimePlugin');
  const runtimeDva = plugins.mergeConfig('dva');
  app = dva({
    history,
    
    ...(runtimeDva.config || {}),
    ...(window.g_useSSR ? { initialState: window.g_initialData } : {}),
  });
  
  app.use(createLoading());
  (runtimeDva.plugins || []).forEach(plugin => {
    app.use(plugin);
  });
  
  app.model({ namespace: 'index', ...(require('/Users/luca_ljx/LJX/others/PRO/FM/cxykz/lukai/antd-pro-init/src/models/BasicLayout/index.js').default) });
app.model({ namespace: 'senceManage', ...(require('/Users/luca_ljx/LJX/others/PRO/FM/cxykz/lukai/antd-pro-init/src/models/catch/senceManage.js').default) });
app.model({ namespace: 'global', ...(require('/Users/luca_ljx/LJX/others/PRO/FM/cxykz/lukai/antd-pro-init/src/models/global.js').default) });
app.model({ namespace: 'login-1', ...(require('/Users/luca_ljx/LJX/others/PRO/FM/cxykz/lukai/antd-pro-init/src/models/login-1.js').default) });
app.model({ namespace: 'login', ...(require('/Users/luca_ljx/LJX/others/PRO/FM/cxykz/lukai/antd-pro-init/src/models/login.js').default) });
app.model({ namespace: 'index', ...(require('/Users/luca_ljx/LJX/others/PRO/FM/cxykz/lukai/antd-pro-init/src/models/ProjectList/index.js').default) });
app.model({ namespace: 'index', ...(require('/Users/luca_ljx/LJX/others/PRO/FM/cxykz/lukai/antd-pro-init/src/models/SenceManage/index.js').default) });
app.model({ namespace: 'setting', ...(require('/Users/luca_ljx/LJX/others/PRO/FM/cxykz/lukai/antd-pro-init/src/models/setting.js').default) });
app.model({ namespace: 'user', ...(require('/Users/luca_ljx/LJX/others/PRO/FM/cxykz/lukai/antd-pro-init/src/models/user.js').default) });
app.model({ namespace: 'userInfo', ...(require('/Users/luca_ljx/LJX/others/PRO/FM/cxykz/lukai/antd-pro-init/src/models/userInfo.js').default) });
  return app;
}

export function getApp() {
  return app;
}

export class _DvaContainer extends Component {
  render() {
    const app = getApp();
    app.router(() => this.props.children);
    return app.start()();
  }
}
