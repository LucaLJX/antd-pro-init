/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout, { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { useState } from 'react';
import Link from 'umi/link';
import { connect } from 'dva';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import { isAntDesignPro } from '@/utils/utils';
import router from 'umi/router';
import './BasicLayout.less';

/**
 * use Authorized check all menu item
 */
const menuDataRender = menuList =>
  menuList.map(item => {
    const localItem = { ...item, children: item.children ? menuDataRender(item.children) : [] };
    return Authorized.check(item.authority, localItem, null);
  });

/**
 * 页脚的渲染方法，返回null
 * @param {*} _
 * @param {*} defaultDom 默认的返回dom
 */
const footerRender = () => {
  if (!isAntDesignPro()) {
    return null;
  }

  return (
    <>
      {defaultDom}
      <div
        style={{
          padding: '0px 24px 24px',
          textAlign: 'center',
        }}
      >
        <a href="https://www.netlify.com" target="_blank" rel="noopener noreferrer">
          <img src="https://www.netlify.com/img/global/badges/netlify-color-bg.svg" width="82px" alt="netlify logo" />
        </a>
      </div>
    </>
  );
};

const BasicLayout = props => {
  const {
    dispatch,
    children,
    settings,
    match: {
      params: { id },
    },
    route,
    basicLayout,
  } = props;
  const { menuData } = basicLayout;
  /**
   * 获取动态菜单
   */
  const _setting = route.settings ? Object.assign({}, settings, route.settings) : settings;

  useState(() => {
    if (dispatch) {
      if (id) {
        dispatch({
          type: 'basicLayout/getMenu',
          payload: {
            projectId: id,
          },
        });
      }
      dispatch({
        type: 'user/getInfo',
        payload: {},
      });
    }
  });

  /**
   * init variables
   */

  const handleMenuCollapse = payload =>
    dispatch &&
    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload,
    });

  return (
    <ProLayout
      logo={
        <a href="/">
          <img src="https://easyaction-file-1.oss-cn-hangzhou.aliyuncs.com/shot_photo/easyaction/logo/LOGOFULLB260.png" />
        </a>
      }
      siderWidth={200}
      onCollapse={handleMenuCollapse}
      collapsedButtonRender={route.hideRoute ? false : undefined}
      menuRender={route.hideRoute ? false : undefined}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (route.hideRoute) return;
        if (menuItemProps.isUrl) {
          return defaultDom;
        }
        return <Link to={menuItemProps.path.replace(/:id/, id)}>{defaultDom}</Link>;
      }}
      breadcrumbRender={(routers = []) => {
        return [
          {
            path: '/',
            breadcrumbName: '首页',
          },
          ...routers,
        ];
      }}
      footerRender={footerRender}
      menuDataRender={() => (route.routeLocal ? route.routes : menuData)}
      rightContentRender={rightProps => <RightContent {...rightProps} />}
      {...props}
      {..._setting}
    >
      {route.hideBread ? props.children : <PageHeaderWrapper>{props.children}</PageHeaderWrapper>}
    </ProLayout>
  );
};

export default connect(({ global, settings, basicLayout }) => ({
  collapsed: global.collapsed,
  settings,
  basicLayout,
}))(BasicLayout);
