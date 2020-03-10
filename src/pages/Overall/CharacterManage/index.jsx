import React from 'react';
import { connect } from 'dva';
import styles from './index.less';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Layout, Row, Col, Button, Modal, Form, Select, Input, Table, Pagination, Tag, Card } from 'antd';
import ProjectCard from '@/components/ProjectCard';
import EaTable from '@/components/EaTable';

const { Column, ColumnGroup } = Table;

const header = [
  { title: '类型', dataIndex: 'characterType' },
  { title: '角色名', dataIndex: 'fullName' },
  { title: '简称', dataIndex: 'shortName' },
  { title: '演员', dataIndex: 'actorName' },
  { title: '场次量', dataIndex: 'sceneCountRate' },
  { title: '场景量', dataIndex: 'loctionCountRate' },
  { title: '文戏量', dataIndex: 'wenPageRate' },
  { title: '武戏量', dataIndex: 'wuPageRate' },
  { title: '完成进度', dataIndex: 'finishedRate' },
];

const KEY = 'id';

@connect(({ characterManage }) => ({ characterManage }))
@Form.create()
export default class CharacterManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: '1',
      loading: false,
      searchParams: {
        projectId: null,
        characterType: 0,
      },
      result: { list: [], totalCount: 0 },
    };
  }

  // 初始化
  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    this.state.searchParams.projectId = id;
    this.getData();
  }

  // 获取表格数据
  getData(params = {}) {
    this.setState({ loading: true });
    const { dispatch } = this.props;
    params = Object.assign({}, this.state.searchParams, params);
    dispatch({
      type: 'characterManage/getCharacterData',
      payload: {
        params: params,
      },
      success: res => {
        this.setState({ loading: false });
        res && this.formatData(res);
      },
      fail: err => {
        this.setState({ loading: false });
      },
    });
  }

  formatData(res) {
    this.setState({
      result: {
        list: res.recordList,
        totalCount: res.recordCount,
      },
    });
  }

  render() {
    const {
      visible,
      searchParams: { pageIndex, pageNum },
      result: { list, totalCount },
      loading,
      tab,
    } = this.state;
    const currentPage = pageIndex + 1;
    return (
      <PageHeaderWrapper
        title={false}
        tabActiveKey={tab}
        tabList={[{ key: '1', tab: '角色' }, { key: '2', tab: '演员' }]}
        onTabChange={tab => this.setState({ tab })}
      >
        <Card id="full-screen" className={styles.CardWrapper}>
          <EaTable
            rowKey={KEY}
            totalInfo={
              <div style={{ display: 'inline-block' }}>
                <span style={{ color: '#1890FF' }}>{totalCount}</span>个角色
              </div>
            }
            fullId="full-screen"
            loading={loading}
            columns={header}
            dataSource={list}
            pagination={false}
            edit={false}
            total={totalCount}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}
