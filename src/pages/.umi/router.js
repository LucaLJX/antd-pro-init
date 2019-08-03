import React from 'react';
import { Router as DefaultRouter, Route, Switch } from 'react-router-dom';
import dynamic from 'umi/dynamic';
import renderRoutes from 'umi/lib/renderRoutes';
import history from '@tmp/history';
import RendererWrapper0 from '/Users/luca_ljx/LJX/others/PRO/FM/cxykz/lukai/antd-pro-init/src/pages/.umi/LocaleWrapper.jsx'
import _dvaDynamic from 'dva/dynamic'

const Router = require('dva/router').routerRedux.ConnectedRouter;

const routes = [
  {
    "path": "/",
    "redirect": "/list",
    "exact": true
  },
  {
    "path": "/login",
    "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import(/* webpackChunkName: "layouts__LoginLayout" */'../../layouts/LoginLayout'),
      LoadingComponent: require('/Users/luca_ljx/LJX/others/PRO/FM/cxykz/lukai/antd-pro-init/src/components/PageLoading/index').default,
    })
    : require('../../layouts/LoginLayout').default,
    "exact": true
  },
  {
    "path": "/list",
    "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import(/* webpackChunkName: "layouts__UserLayout" */'../../layouts/UserLayout'),
      LoadingComponent: require('/Users/luca_ljx/LJX/others/PRO/FM/cxykz/lukai/antd-pro-init/src/components/PageLoading/index').default,
    })
    : require('../../layouts/UserLayout').default,
    "Routes": [require('../Authorized').default],
    "authority": [
      "admin",
      "user"
    ],
    "routes": [
      {
        "path": "/list",
        "name": "welcome",
        "icon": "",
        "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import(/* webpackChunkName: "p__ProjectList__index" */'../ProjectList/index'),
      LoadingComponent: require('/Users/luca_ljx/LJX/others/PRO/FM/cxykz/lukai/antd-pro-init/src/components/PageLoading/index').default,
    })
    : require('../ProjectList/index').default,
        "exact": true
      },
      {
        "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import(/* webpackChunkName: "p__404" */'../404'),
      LoadingComponent: require('/Users/luca_ljx/LJX/others/PRO/FM/cxykz/lukai/antd-pro-init/src/components/PageLoading/index').default,
    })
    : require('../404').default,
        "exact": true
      },
      {
        "component": () => React.createElement(require('/Users/luca_ljx/LJX/others/PRO/FM/cxykz/lukai/antd-pro-init/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
      }
    ]
  },
  {
    "path": "/project/:id",
    "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import(/* webpackChunkName: "layouts__BasicLayout" */'../../layouts/BasicLayout'),
      LoadingComponent: require('/Users/luca_ljx/LJX/others/PRO/FM/cxykz/lukai/antd-pro-init/src/components/PageLoading/index').default,
    })
    : require('../../layouts/BasicLayout').default,
    "Routes": [require('../Authorized').default],
    "authority": [
      "admin",
      "user"
    ],
    "routes": [
      {
        "path": "/project/:id",
        "redirect": "/project/:id/dashboard",
        "exact": true
      },
      {
        "path": "/project/:id/dashboard",
        "name": "",
        "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import(/* webpackChunkName: "p__Base" */'../Base'),
      LoadingComponent: require('/Users/luca_ljx/LJX/others/PRO/FM/cxykz/lukai/antd-pro-init/src/components/PageLoading/index').default,
    })
    : require('../Base').default,
        "exact": true
      },
      {
        "component": () => React.createElement(require('/Users/luca_ljx/LJX/others/PRO/FM/cxykz/lukai/antd-pro-init/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
      }
    ]
  },
  {
    "path": "/overall/:id",
    "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import(/* webpackChunkName: "layouts__BasicLayout" */'../../layouts/BasicLayout'),
      LoadingComponent: require('/Users/luca_ljx/LJX/others/PRO/FM/cxykz/lukai/antd-pro-init/src/components/PageLoading/index').default,
    })
    : require('../../layouts/BasicLayout').default,
    "Routes": [require('../Authorized').default],
    "authority": [
      "admin",
      "user"
    ],
    "routes": [
      {
        "path": "/overall/:id",
        "redirect": "/overall/:id/sence",
        "exact": true
      },
      {
        "path": "/overall/:id/script",
        "name": "剧本",
        "icon": "smile",
        "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import(/* webpackChunkName: "p__Overall__Script" */'../Overall/Script'),
      LoadingComponent: require('/Users/luca_ljx/LJX/others/PRO/FM/cxykz/lukai/antd-pro-init/src/components/PageLoading/index').default,
    })
    : require('../Overall/Script').default,
        "exact": true
      },
      {
        "path": "/overall/:id/sence",
        "name": "顺场表",
        "icon": "smile",
        "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import(/* webpackChunkName: "p__Overall__SenceManage" */'../Overall/SenceManage'),
      LoadingComponent: require('/Users/luca_ljx/LJX/others/PRO/FM/cxykz/lukai/antd-pro-init/src/components/PageLoading/index').default,
    })
    : require('../Overall/SenceManage').default,
        "exact": true
      },
      {
        "path": "/overall/:id/plan",
        "name": "大计划",
        "icon": "smile",
        "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import(/* webpackChunkName: "p__Overall__Plan" */'../Overall/Plan'),
      LoadingComponent: require('/Users/luca_ljx/LJX/others/PRO/FM/cxykz/lukai/antd-pro-init/src/components/PageLoading/index').default,
    })
    : require('../Overall/Plan').default,
        "exact": true
      },
      {
        "path": "/overall/:id/location",
        "name": "场景",
        "icon": "smile",
        "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import(/* webpackChunkName: "p__Overall__Location" */'../Overall/Location'),
      LoadingComponent: require('/Users/luca_ljx/LJX/others/PRO/FM/cxykz/lukai/antd-pro-init/src/components/PageLoading/index').default,
    })
    : require('../Overall/Location').default,
        "exact": true
      },
      {
        "path": "/overall/:id/characters",
        "name": "角色",
        "icon": "smile",
        "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import(/* webpackChunkName: "p__Overall__Characters" */'../Overall/Characters'),
      LoadingComponent: require('/Users/luca_ljx/LJX/others/PRO/FM/cxykz/lukai/antd-pro-init/src/components/PageLoading/index').default,
    })
    : require('../Overall/Characters').default,
        "exact": true
      },
      {
        "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import(/* webpackChunkName: "p__404" */'../404'),
      LoadingComponent: require('/Users/luca_ljx/LJX/others/PRO/FM/cxykz/lukai/antd-pro-init/src/components/PageLoading/index').default,
    })
    : require('../404').default,
        "exact": true
      },
      {
        "component": () => React.createElement(require('/Users/luca_ljx/LJX/others/PRO/FM/cxykz/lukai/antd-pro-init/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
      }
    ]
  },
  {
    "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import(/* webpackChunkName: "p__404" */'../404'),
      LoadingComponent: require('/Users/luca_ljx/LJX/others/PRO/FM/cxykz/lukai/antd-pro-init/src/components/PageLoading/index').default,
    })
    : require('../404').default,
    "exact": true
  },
  {
    "component": () => React.createElement(require('/Users/luca_ljx/LJX/others/PRO/FM/cxykz/lukai/antd-pro-init/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
  }
];
window.g_routes = routes;
const plugins = require('umi/_runtimePlugin');
plugins.applyForEach('patchRoutes', { initialValue: routes });

// route change handler
function routeChangeHandler(location, action) {
  plugins.applyForEach('onRouteChange', {
    initialValue: {
      routes,
      location,
      action,
    },
  });
}
history.listen(routeChangeHandler);
routeChangeHandler(history.location);

export { routes };

export default function RouterWrapper(props = {}) {
  return (
<RendererWrapper0>
          <Router history={history}>
      { renderRoutes(routes, props) }
    </Router>
        </RendererWrapper0>
  );
}
