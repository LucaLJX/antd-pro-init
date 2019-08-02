/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout, { PageHeaderWrapper } from '@ant-design/pro-layout'
import React, { useEffect, useState } from 'react'
import Link from 'umi/link'
import { connect } from 'dva'
import Authorized from '@/utils/Authorized'
import RightContent from '@/components/GlobalHeader/RightContent'
import { isAntDesignPro } from '@/utils/utils'
import logo from '../assets/logo.svg'
import router from 'umi/router'
import styles from './BasicLayout.less'
import { Menu, Dropdown, Icon, message, Avatar } from 'antd'

/**
 * use Authorized check all menu item
 */
const menuDataRender = menuList =>
  menuList.map(item => {
    const localItem = { ...item, children: item.children ? menuDataRender(item.children) : [] }
    return Authorized.check(item.authority, localItem, null)
  })


/**
 * 页脚的渲染方法，返回null
 * @param {*} _
 * @param {*} defaultDom 默认的返回dom
 */
const footerRender = (_, defaultDom) => {
  if (!isAntDesignPro()) {
    return null
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
  )
}

const BasicLayout = props => {
  const {
    dispatch,
    children,
    settings,
    match: { params: { id } },
    basicLayout: {
      menuData,
      nickName,
      avatarUrl
    },
  } = props
  /**
   * constructor
   */

  /**
   * 登出
   */
  const logout = () => {
    if (dispatch) {
      dispatch({
        type: 'basicLayout/logout',
        payload: {},
        callback: res => {
         if (res.code === 0) {
          // 登出成功
          message.success('登出成功！')
          window.localStorage.removeItem('token')
          window.localStorage.removeItem('userName')
          router.push('/login')
         }
        }
      })
    }
  }

  const menu = (
    <Menu>
      <Menu.Item onClick={() => logout()}>
        登出
      </Menu.Item>
    </Menu>
  )

  /**
   * 页头的渲染方法，返回null
   * @param {*} _
   * @param {*} defaultDom 默认的返回dom
   */
  const headerRender = (_, defaultDom) => {
    return (
      <div className={styles.commonHeader}>
        <Dropdown className={styles.DropdownWrapper} overlay={menu}>
          <a href='#'>
            <Avatar className={styles.avatar} src={avatarUrl} />
            <span className={styles.nickName}>{nickName}</span>
            <Icon type="down" />
          </a>
        </Dropdown>
      </ div>
    )
  }

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
      })
      dispatch({
        type: 'basicLayout/getInfo',
        payload: {}
      })
    }
  })

  /**
   * init variables
   */

  const handleMenuCollapse = payload =>
    dispatch &&
    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload,
    })

  return (
    <ProLayout
      trigger={null}
      logo={() => (
        <img onClick={() => {
          router.push(`/list`)
        }} src={require('@/assets/LOGOBULE.png')} alt='' />
      )}
      siderWidth={200}
      menu={{ locale: false }}
      onCollapse={handleMenuCollapse}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (menuItemProps.isUrl) {
          return defaultDom
        }

        return <Link to={menuItemProps.path.replace(/:id/, id)}>{defaultDom}</Link>
      }}
      breadcrumbRender={(routers = []) => {
        return [
          {
            path: '/list',
            breadcrumbName: '首页',
          },
          ...routers,
        ]
      }}
      headerRender={headerRender}
      footerRender={footerRender}
      menuDataRender={() => menuData}
      formatMessage={null}
      rightContentRender={rightProps => <RightContent {...rightProps} />}
      {...props}
      {...settings}
      title={''}
      collapse={false}
      fixSiderbar={true}
    >
      {/* PageHeaderWrapper， 不添加则无法展示面包屑 */}
      <PageHeaderWrapper />
      {/* 登出 */}
      <div className={styles.Person}></div>
      {children}
    </ProLayout>
  )
}

export default connect(({ global, settings, basicLayout }) => ({
  collapsed: global.collapsed,
  settings,
  basicLayout
}))(BasicLayout)
