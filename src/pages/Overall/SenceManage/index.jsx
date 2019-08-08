import React from 'react';
import { connect } from 'dva';
import styles from './index.less';
import { Layout, Row, Col, Button, Modal, Form, Select, Input, Table, Pagination, Tag, Card } from 'antd';
import ProjectCard from '@/components/ProjectCard';
import SuperTable from '@/components/SuperTable';
import _ from 'lodash';

const { Column, ColumnGroup } = Table;

@connect(({ senceManage }) => ({ senceManage }))
@Form.create()
export default class ProjectList extends React.Component {
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
    this.getSenceData();
  }

  // 获取表格数据
  getSenceData() {
    this.setState({ loading: true });
    const {
      dispatch,
      senceManage: { getHeader },
    } = this.props;
    const params = this.state.searchParams;
    dispatch({
      type: 'senceManage/getSenceData',
      payload: {
        params: params,
        getHeader: getHeader,
      },
      callback: res => {
        this.setState({ loading: false });
        if (!getHeader) {
          this.formatHeaders(res.header);
        }
      },
    });
  }

  // 翻页
  changePage(page, pageSize) {
    const pageIndex = page - 1;
    this.state.searchParams.pageIndex = pageIndex;
    this.getSenceData();
  }

  // 修改每页的条数
  changePageSize(current, size) {
    const { searchParams } = this.state;
    this.state.searchParams.pageNum = size;
    this.state.searchParams.pageIndex = current - 1;
    this.getSenceData();
  }

  changeData(filters, sorter) {
    console.log(filters, sorter);
  }

  // 格式化表头
  formatHeaders(data) {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    if (!data || data.length === 0) {
      return [];
    }
    let list = [];
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      // 一级菜单
      if (item.columnName === 'location') {
        // 场次
        for (let j = 0; j < item.subColumns.length; j++) {
          const subItem = item.subColumns[j];
          const locationId = Number(subItem.columnKey.split('-')[1]);
          list.push({
            title: subItem.columnName,
            dataIndex: 'location',
            key: subItem.columnKey,
            id: locationId,
            type: 'find',
            findId: 'columnId',
            showKey: 'locationName',
          });
        }
      } else if (item.columnName === 'charact') {
        // 主演
        for (let x = 0; x < item.subColumns.length; x++) {
          const subItem = item.subColumns[x];
          const charactId = Number(subItem.columnKey.split('-')[1]);
          list.push({
            headerType: 'vertical',
            title: subItem.columnName,
            dataIndex: 'characterHead',
            key: subItem.columnKey,
            id: charactId,
            type: 'find',
            findId: 'id',
            showKey: 'statusName',
          });
        }
      } else {
        if (item.columnKey === 'freelance') {
          list.push({
            title: item.columnName,
            dataIndex: 'characterFreelance',
            type: 'tag',
            showKey: 'fullName',
          });
        } else if (item.columnKey === 'group') {
          // 群演
          list.push({
            title: item.columnName,
            dataIndex: 'characterGroup',
            type: 'tag',
            showKey: 'fullName',
          });
        } else {
          list.push({
            title: item.columnName,
            dataIndex: item.columnKey,
            sorter: true,
            filters: [{ text: 'London', value: 'London' }, { text: 'New York', value: 'New York' }],
          });
        }
      }
    }
    dispatch({
      type: 'senceManage/setHeader',
      payload: {
        header: list,
      },
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      visible,
      searchParams: { pageIndex, pageNum },
      loading,
    } = this.state;
    const {
      senceManage: { senceList, senceHeader, totalCount, header },
    } = this.props;
    const currentPage = pageIndex + 1;

    return (
      <div className={styles.wrapper} style={{ width: '100%', margin: 'auto', paddingTop: '20px' }}>
        <div className={styles.SearchWrapper}>
          {/* <Button type='primary' onClick={() => this.createHeader()}>添加角色</Button>
          <br/>
          <Button type='primary' onClick={() => this.createTableData()}>添加表格数据</Button> */}
        </div>

        <Card className={styles.CardWrapper}>
          <SuperTable
            columns={header}
            loading={loading}
            dataSource={senceList}
            currentPage={currentPage}
            pageSize={pageNum}
            count={totalCount}
            getFilterData={column => this.getFilterData(column)}
            onChange={(filters, sorter) => this.changeData(filters, sorter)}
            onChangePage={(page, size) => this.changePage(page, size)}
            onShowSizeChange={(page, size) => this.changePageSize(page, size)}
          />
        </Card>
      </div>
    );
  }
}
