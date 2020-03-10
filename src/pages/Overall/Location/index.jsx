import React from 'react';
import { connect } from 'dva';
import styles from './index.less';
import { Layout, Row, Col, Button, Modal, Form, Select, Input, Table, Pagination, Tag, Card, Tabs } from 'antd';
import ProjectCard from '@/components/ProjectCard';
import EaTable from '@/components/EaTable';

const { TabPane } = Tabs;

const { Column, ColumnGroup } = Table;

const columnMap = {
  wenPageSum: {
  },
  wuPageSum: {
  },
  location: {
    dataType: 'find',
    findKey: 'columnId',
    showKey: 'locationName',
    dataIndex: 'location',
  },
  space: {
    type: 'tag'
  },
  time: {
    type: 'tag'
  },
  place: {
  },
  summary: {
  }
};

const KEY = 'sceneId';

@connect(({ location }) => ({ location }))
@Form.create()
export default class LocationManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      loading: false,
      searchParams: {
        projectId: null,
        pageIndex: 0,
        pageNum: 20,
        addActor: false,
      },
      result: { locationList: [], locationHeader: [], totalCount: 0, wupageSumCount: 0, wenpageSumCount: 0 },
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
    this.getLocationData();
  }

  // 获取表格数据
  getLocationData(params = {}) {
    this.setState({ loading: true });
    const { dispatch } = this.props;
    params = Object.assign({}, this.state.searchParams, params);
    const newParams = {
      projectId: params.projectId
    }
    dispatch({
      type: 'location/getLocationData',
      payload: {
        params: newParams,
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
        locationList: res.recordList,
        locationHeader: this.formatHeaders(res.recordHead),
        totalCount: res.recordCount,
        wenpageSumCount: res.wenpageSumCount,
        wupageSumCount: res.wupageSumCount,
      },
    });
  }

  // 格式化表头
  formatHeaders(data) {
    if (!data || data.length === 0) {
      return [];
    }
    let list = [];
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const _item = {};
      if (item.columnKey.indexOf('location') !== -1) {
        const key = item.columnKey.split('-')[0]
        const locationId = Number(item.columnKey.split('-')[1])
        _item.title = item.columnName
        _item.key = item.columnKey
        _item.id = locationId
        list.push(Object.assign({}, _item, columnMap['location']));
      } else if (item.columnKey === 'wenPageSum') {
        _item.title = item.columnName;
        _item.dataIndex = 'wenPageRate';
        list.push(Object.assign(_item, columnMap[item.columnKey]));
      } else if (item.columnKey === 'wuPageSum') {
        _item.title = item.columnName;
        _item.dataIndex = 'wuPageRate';
        list.push(Object.assign(_item, columnMap[item.columnKey]));
      } else {
        _item.title = item.columnName;
        _item.dataIndex = item.columnKey;
        list.push(Object.assign(_item, columnMap[item.columnKey]));
      }
    }
    return list;
  }

  render() {
    const {
      visible,
      searchParams: { pageIndex, pageNum },
      result: { locationList, locationHeader, totalCount, wenpageSumCount, wupageSumCount },
      loading,
    } = this.state;
    const currentPage = pageIndex + 1;
    return (
      <div className={styles.Wrapper} style={{ width: '100%', margin: 'auto', paddingTop: '0px' }}>
        <Tabs defaultActiveKey="1" onChange={() => console.log('change tabs')}>
          <TabPane tab="场景" key="1" className={styles.LocationTabPane}>
            <Card id="full-screen" className={styles.CardWrapper}>
              <EaTable
                rowKey={KEY}
                totalInfo={
                  <div style={{ display: 'inline-block' }}>
                    <span style={{ color: '#1890FF' }}>{totalCount}</span>个场景；文戏：{' '}
                    <span style={{ color: '#1890FF' }}>{wenpageSumCount}</span> 页；武戏：
                    <span style={{ color: '#1890FF' }}>{wupageSumCount}</span> 页
                  </div>
                }
                fullId="full-screen"
                loading={loading}
                columns={locationHeader}
                dataSource={locationList}
                total={totalCount}
                pagination={false}
                edit={false}
              />
            </Card>
          </TabPane>
          <TabPane tab="实拍地" key="2" className={styles.LocationTabPane}>
            <div>实拍地</div>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
