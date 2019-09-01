import { DefaultFooter, getMenuData, getPageTitle, PageHeaderWrapper } from '@ant-design/pro-layout';
import DocumentTitle from 'react-document-title';
import Link from 'umi/link';
import React, { useState } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import SelectLang from '@/components/SelectLang';
import router from 'umi/router';
import logo from '../assets/logo.svg';
import styles from './UserLayout.less';
import { Layout, Menu, Breadcrumb, Dropdown, Icon, message, Avatar } from 'antd';
const { Header, Content, Footer } = Layout;

const UserLayout = props => {
  const {
    dispatch,
    children,
    basicLayout: { nickName, avatarUrl },
  } = props;

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
            message.success('登出成功！');
            window.localStorage.removeItem('token');
            window.localStorage.removeItem('userName');
            router.push('/login');
          }
        },
      });
    }
  };

  /**
   * 获取动态菜单
   */
  useState(() => {
    if (dispatch) {
      dispatch({
        type: 'basicLayout/getInfo',
        payload: {},
      });
    }
  });

  const menu = (
    <Menu theme="dark">
      <Menu.Item onClick={() => logout()}>登出</Menu.Item>
    </Menu>
  );
  return (
    <Layout className="layout">
      <Header>
        <div className={styles.logo}>
          <img src="https://easyaction-file-1.oss-cn-hangzhou.aliyuncs.com/shot_photo/easyaction/logo/LOGOFULLB260.png" />
        </div>
        <div className={styles.commonHeader}>
          <Dropdown className={styles.DropdownWrapper} overlay={menu}>
            <a href="#">
              <Avatar className={styles.avatar} src={avatarUrl} />
              <span className={styles.nickName}>{nickName}</span>
              <Icon type="down" />
            </a>
          </Dropdown>
        </div>
      </Header>
      <Content>
        <div style={{ background: '#F0F2F5', padding: 24 }}>{children}</div>
      </Content>
    </Layout>
  );
};

export default connect(({ settings, basicLayout }) => ({ ...settings, basicLayout }))(UserLayout);
