/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout from '@ant-design/pro-layout';
import React, { useEffect, useState } from 'react';
import Link from 'umi/link';
import { connect } from 'dva';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import { isAntDesignPro } from '@/utils/utils';
import logo from '../assets/logo.svg';

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
const footerRender = (_, defaultDom) => {
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
          <img
            src="https://www.netlify.com/img/global/badges/netlify-color-bg.svg"
            width="82px"
            alt="netlify logo"
          />
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
    match: { params: { id } },
    basicLayout: { menuData }
  } = props;
  /**
   * constructor
   */

  // useEffect(() => {
  //   console.log('useEffect')
  //   if (dispatch) {
  //     dispatch({
  //       type: 'basicLayout/getMenu'
  //     })
  //   }
  // });

  /**
   * 获取动态菜单
   */
  useState(() => {
    if (dispatch) {
      dispatch({
        type: 'basicLayout/getMenu',
        payload: {
          projectId: id
        }
      });
      // dispatch({
      //   type: 'settings/getSetting',
      // });
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
      logo={null}
      title={'易制片'}
      menu={{ locale: false }}
      onCollapse={handleMenuCollapse}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (menuItemProps.isUrl) {
          return defaultDom;
        }

        return <Link to={menuItemProps.path.replace(/:id/, id)}>{defaultDom}</Link>;
      }}
      breadcrumbRender={(routers = []) => [
        ...routers
      ]}
      footerRender={footerRender}
      menuDataRender={() => menuData}
      // menuDataRender={menuDataRender}
      formatMessage={null}
      rightContentRender={rightProps => <RightContent {...rightProps} />}
      {...props}
      {...settings}
    >
      {children}
    </ProLayout>
  );
};

export default connect(({ global, settings, basicLayout }) => ({
  collapsed: global.collapsed,
  settings,
  basicLayout
}))(BasicLayout);
