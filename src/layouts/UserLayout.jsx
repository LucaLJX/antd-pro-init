import { DefaultFooter, getMenuData, getPageTitle } from '@ant-design/pro-layout';
import DocumentTitle from 'react-document-title';
import Link from 'umi/link';
import React from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import SelectLang from '@/components/SelectLang';
import logo from '../assets/logo.svg';
import styles from './UserLayout.less';
import { Layout, Menu, Breadcrumb } from 'antd';
const { Header, Content, Footer } = Layout;

const UserLayout = props => {
  const {
    route = {
      routes: [],
    },
  } = props;
  const { routes = [] } = route;
  const {
    children,
    location = {
      pathname: '',
    },
  } = props;
  const { breadcrumb } = getMenuData(routes);
  return (
    <Layout className="layout">
      <Header>
        <div className="logo" style={{ color: '#fff', fontSize: 30 }}>{ '易制片' }</div>
      </Header>
      <Content>
        <div style={{ background: '#fff', padding: 24 }}>{ children }</div>
      </Content>
    </Layout>
  );
};

export default connect(({ settings }) => ({ ...settings }))(UserLayout);
