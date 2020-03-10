import React from 'react';
import { Router as DefaultRouter, Route, Switch } from 'react-router-dom';
import dynamic from 'umi/dynamic';
import renderRoutes from 'umi/lib/renderRoutes';
import history from '@tmp/history';
import RendererWrapper0 from '/Users/luca_ljx/LJX/others/PRO/FM/cxykz/lukai/web-upload/src/pages/.umi/LocaleWrapper.jsx'
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
      LoadingComponent: require('/Users/luca_ljx/LJX/others/PRO/FM/cxykz/lukai/web-upload/src/components/PageLoading/index').default,
    })
    : require('../../layouts/LoginLayout').default,
    "exact": true
  },
  {
    "path": "/list",
    "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import(/* webpackChunkName: "layouts__BasicLayout" */'../../layouts/BasicLayout'),
      LoadingComponent: require('/Users/luca_ljx/LJX/others/PRO/FM/cxykz/lukai/web-upload/src/components/PageLoading/index').default,
    })
    : require('../../layouts/BasicLayout').default,
    "Routes": [require('../Authorized').default],
    "authority": [
      "admin",
      "user"
    ],
    "hideBread": true,
    "hideRoute": true,
    "settings": {
      "layout": "topmenu"
    },
    "routes": [
      {
        "path": "/list",
        "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import(/* webpackChunkName: "p__All__List__index" */'../All/List/index'),
      LoadingComponent: require('/Users/luca_ljx/LJX/others/PRO/FM/cxykz/lukai/web-upload/src/components/PageLoading/index').default,
    })
    : require('../All/List/index').default,
        "exact": true
      },
      {
        "component": () => React.createElement(require('/Users/luca_ljx/LJX/others/PRO/FM/cxykz/lukai/web-upload/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
      }
    ]
  },
  {
    "path": "/all",
    "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import(/* webpackChunkName: "layouts__BasicLayout" */'../../layouts/BasicLayout'),
      LoadingComponent: require('/Users/luca_ljx/LJX/others/PRO/FM/cxykz/lukai/web-upload/src/components/PageLoading/index').default,
    })
    : require('../../layouts/BasicLayout').default,
    "Routes": [require('../Authorized').default],
    "authority": [
      "admin",
      "user"
    ],
    "settings": {
      "layout": "topmenu"
    },
    "routeLocal": true,
    "hideRoute": true,
    "routes": [
      {
        "path": "/all",
        "name": "项目",
        "redirect": "/",
        "exact": true
      },
      {
        "name": "创建项目",
        "path": "/all/create",
        "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import(/* webpackChunkName: "p__All__Create__index" */'../All/Create/index'),
      LoadingComponent: require('/Users/luca_ljx/LJX/others/PRO/FM/cxykz/lukai/web-upload/src/components/PageLoading/index').default,
    })
    : require('../All/Create/index').default,
        "exact": true
      },
      {
        "component": () => React.createElement(require('/Users/luca_ljx/LJX/others/PRO/FM/cxykz/lukai/web-upload/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
      }
    ]
  },
  {
    "path": "/project/:id",
    "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import(/* webpackChunkName: "layouts__BasicLayout" */'../../layouts/BasicLayout'),
      LoadingComponent: require('/Users/luca_ljx/LJX/others/PRO/FM/cxykz/lukai/web-upload/src/components/PageLoading/index').default,
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
      LoadingComponent: require('/Users/luca_ljx/LJX/others/PRO/FM/cxykz/lukai/web-upload/src/components/PageLoading/index').default,
    })
    : require('../Base').default,
        "exact": true
      },
      {
        "component": () => React.createElement(require('/Users/luca_ljx/LJX/others/PRO/FM/cxykz/lukai/web-upload/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
      }
    ]
  },
  {
    "path": "/overall/:id/characters",
    "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import(/* webpackChunkName: "layouts__BasicLayout" */'../../layouts/BasicLayout'),
      LoadingComponent: require('/Users/luca_ljx/LJX/others/PRO/FM/cxykz/lukai/web-upload/src/components/PageLoading/index').default,
    })
    : require('../../layouts/BasicLayout').default,
    "Routes": [require('../Authorized').default],
    "authority": [
      "admin",
      "user"
    ],
    "hideBread": true,
    "routes": [
      {
        "path": "/overall/:id/characters",
        "name": "角色",
        "icon": "smile",
        "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import(/* webpackChunkName: "p__Overall__CharacterManage" */'../Overall/CharacterManage'),
      LoadingComponent: require('/Users/luca_ljx/LJX/others/PRO/FM/cxykz/lukai/web-upload/src/components/PageLoading/index').default,
    })
    : require('../Overall/CharacterManage').default,
        "exact": true
      },
      {
        "component": () => React.createElement(require('/Users/luca_ljx/LJX/others/PRO/FM/cxykz/lukai/web-upload/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
      }
    ]
  },
  {
    "path": "/overall/:id",
    "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import(/* webpackChunkName: "layouts__BasicLayout" */'../../layouts/BasicLayout'),
      LoadingComponent: require('/Users/luca_ljx/LJX/others/PRO/FM/cxykz/lukai/web-upload/src/components/PageLoading/index').default,
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
        "path": "/overall/:id/sence",
        "name": "顺场表",
        "icon": "smile",
        "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import(/* webpackChunkName: "p__Overall__SenceManage" */'../Overall/SenceManage'),
      LoadingComponent: require('/Users/luca_ljx/LJX/others/PRO/FM/cxykz/lukai/web-upload/src/components/PageLoading/index').default,
    })
    : require('../Overall/SenceManage').default,
        "exact": true
      },
      {
        "path": "/overall/:id/location",
        "name": "场景",
        "icon": "smile",
        "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import(/* webpackChunkName: "p__Overall__Location" */'../Overall/Location'),
      LoadingComponent: require('/Users/luca_ljx/LJX/others/PRO/FM/cxykz/lukai/web-upload/src/components/PageLoading/index').default,
    })
    : require('../Overall/Location').default,
        "exact": true
      },
      {
        "component": () => React.createElement(require('/Users/luca_ljx/LJX/others/PRO/FM/cxykz/lukai/web-upload/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
      }
    ]
  },
  {
    "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import(/* webpackChunkName: "p__404" */'../404'),
      LoadingComponent: require('/Users/luca_ljx/LJX/others/PRO/FM/cxykz/lukai/web-upload/src/components/PageLoading/index').default,
    })
    : require('../404').default,
    "exact": true
  },
  {
    "component": () => React.createElement(require('/Users/luca_ljx/LJX/others/PRO/FM/cxykz/lukai/web-upload/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
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
