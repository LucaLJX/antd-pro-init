import React from 'react';
import { connect } from 'dva';
import styles from './index.less';
import { Layout, Row, Col, Button, Modal, Form, Select, Input, Table, Pagination, Tag, Card, message } from 'antd';
import ProjectCard from '@/components/ProjectCard';
import EaTable from '@/components/EaTable';

const { Column, ColumnGroup } = Table;

const columnMap = {
  episodeNum: {
    sorter: true,
    filter: true,
    filterType: 'input',
    editType: 'input',
  },
  sceneNum: {
    filter: true,
    filterType: 'input',
    editType: 'input',
  },
  location: {
    sorter: true,
    filter: true,
    filterType: 'searchCheckbox',
    filterCheckboxAll: true,
    dataType: 'find',
    editType: 'auto',
    editAllowAdd: true,
    findKey: 'columnId',
    showKey: 'locationName',
    dataIndex: 'location',
  },
  place: {
    sorter: true,
    filter: true,
    filterType: 'searchCheckbox',
    filterCheckboxAll: true,
    editType: 'auto',
    editAllowAdd: true,
    dateIndex: 'place',
  },
  time: {
    sorter: true,
    filter: true,
    filterType: 'checkbox',
    editType: 'radio',
    filterData: [
      { label: '日', value: '日' },
      { label: '夜', value: '夜' },
      { label: '昏', value: '昏' },
      { label: '晨', value: '晨' },
    ],
    editData: [
      { label: '日', value: '日' },
      { label: '夜', value: '夜' },
      { label: '昏', value: '昏' },
      { label: '晨', value: '晨' },
    ],
  },
  space: {
    sorter: true,
    filter: true,
    filterType: 'checkbox',
    editType: 'radio',
    filterData: [{ label: '内', value: '内' }, { label: '外', value: '外' }, { label: '内外', value: '内外' }],
    editData: [{ label: '内', value: '内' }, { label: '外', value: '外' }, { label: '内外', value: '内外' }],
  },
  wenPage: {
    editType: 'number',
  },
  wuPage: {
    editType: 'number',
  },
  summary: {
    filter: true,
    filterType: 'input',
    editType: 'input',
  },
  charact: {
    headerType: 'vertical',
    dataType: 'find',
    findKey: 'id',
    filter: true,
    filterType: 'checkbox',
    filterCheckboxAll: true,
    dataIndex: 'characterHead',
    editType: 'radio',
    filterDataFormat: function(column) {
      return [{ label: column.name, value: '1' }].concat([
        { label: '备', value: '2' },
        { label: '删', value: '3' },
        { label: '替', value: '4' },
        { label: '已拍', value: '5' },
      ]);
    },
    editDataFormat: function(column) {
      return [{ label: column.name, value: '1' }, { label: '无', value: '0', className: 'divider' }].concat([
        { label: '备', value: '2' },
        { label: '删', value: '3' },
        { label: '替', value: '4' },
        { label: '已拍', value: '5' },
      ]);
    },
    getValue: function(column, data) {
      return `${data['statusId']}`;
    },
    getLabel: function(column, data) {
      return data['statusName'];
    },
  },
  freelance: {
    filter: true,
    filterType: 'search',
    type: 'tag',
    showKey: 'fullName',
    dataIndex: 'characterFreelance',
    editType: 'checkbox',
    editAllowAdd: true,
    minWidth: 160,
    filterExtend: true,
    filterExtendType: 'radio',
    filterExtendData: [{ label: '相同场次', value: 1 }, { label: '任意场次', value: 0 }],
    filterExtendDefault: 1,
  },
  group: {
    filter: true,
    filterType: 'search',
    type: 'tag',
    showKey: 'fullName',
    dataIndex: 'characterGroup',
    editType: 'checkbox',
    editAllowAdd: true,
    minWidth: 160,
    filterExtend: true,
    filterExtendType: 'radio',
    filterExtendData: [{ label: '相同场次', value: 1 }, { label: '任意场次', value: 0 }],
    filterExtendDefault: 1,
  },
};

const KEY = 'sceneId';

@connect(({ senceManage }) => ({ senceManage }))
@Form.create()
export default class SenceManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      loading: false,
      searchParams: {
        projectId: null,
        pageIndex: 0,
        pageNum: 20,
      },
      result: { senceList: [], senceHeader: [], totalCount: 0, wupageSumCount: 0, wenpageSumCount: 0 },
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
      type: 'senceManage/getSenceData',
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

  // 翻页
  changePage({ current, pageSize }, filters, sorter) {
    this.state.searchParams.pageIndex = current - 1;
    this.state.searchParams.pageNum = pageSize;
    const params = {};
    if (sorter.order) {
      params.orderColumn = sorter.columnKey;
      params.orderType = sorter.order === 'ascend' ? 'asc' : 'desc';
    }
    for (let key in filters) {
      if (!filters[key] || !filters[key][0] || filters[key][0].length == 0) continue;
      if (key === 'characterFreelance') {
        params.characterFreelance = {
          characters: filters[key][0].map(item => ({ characterId: item.key, characterStatus: [1] })),
          pattern: !!filters[key][1],
        };
      } else if (key === 'characterGroup') {
        params.characterGroup = {
          characters: filters[key][0].map(item => ({ characterId: item.key, characterStatus: [1] })),
          pattern: !!filters[key][1],
        };
      } else if (key.indexOf('location') === 0) {
        const id = key.split('-')[1];
        if (!params.location) params.location = [];
        for (let i = 0; i < filters[key][0].length; i += 1) {
          params.location.push({ locationName: filters[key][0][i], columnId: id });
        }
      } else if (key.indexOf('character') === 0) {
        const id = key.split('-')[1];
        if (!params.characterHead) params.characterHead = { characters: [], pattern: true };
        params.characterHead.characters.push({
          characterId: id,
          characterStatus: filters[key][0].map(item => Number(item)),
        });
      } else {
        params[key] = filters[key][0];
      }
    }
    this.getData(params);
  }

  getSelectData(type, column, cb) {
    if (columnMap[column.key] && columnMap[column.key][type]) {
      cb(columnMap[column.key][type]);
    } else if (column.dataIndex === 'characterFreelance' && columnMap['freelance'][type]) {
      cb(columnMap['freelance'][type]);
    } else if (column.dataIndex === 'characterGroup' && columnMap['group'][type]) {
      cb(columnMap['group'][type]);
    } else if (column.dataIndex === 'characterHead') {
      if (!columnMap[column.key]) columnMap[column.key] = {};
      columnMap[column.key][type] = columnMap['charact'][`${type}Format`](column);
      cb(columnMap[column.key][type]);
    } else {
      const {
        dispatch,
        match: {
          params: { id },
        },
      } = this.props;
      const params = { id, value: '', key: column.key };
      switch (column.dataIndex) {
        case 'location':
          params.value = column.id;
          params.key = 'location';
          break;
        case 'characterFreelance':
          params.value = 4;
          params.key = 'character';
          break;
        case 'characterGroup':
          params.value = 2;
          params.key = 'character';
          break;
      }
      dispatch({
        type: 'senceManage/getSelectData',
        payload: params,
        success: res => {
          if (!columnMap[column.key]) columnMap[column.key] = {};
          columnMap[column.key][type] = res;
          cb(columnMap[column.key][type]);
        },
        fail: err => {},
      });
    }
  }

  onChangeValue(record, column, value, cb) {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    const params = { id, value, sceneId: record[KEY], key: column.key };
    switch (column.dataIndex) {
      case 'location':
        params.value = [{ locationName: value, columnId: column.id }];
        params.key = 'location';
        for (let i = 0; i < record.location.length; i += 1) {
          if (record.location[i].columnId !== column.id) params.value.push(record.location[i]);
        }
        break;
      case 'characterFreelance':
        params.value = value ? value.map(item => item.label) : [];
        break;
      case 'characterGroup':
        params.value = value ? value.map(item => item.label) : [];
        break;
      case 'characterHead':
        params.characterId = column.id;
        params.key = 'character';
        break;
    }
    dispatch({
      type: 'senceManage/modifySenceSimple',
      payload: params,
      success: data => {
        this.refreshData(data);
        cb();
      },
      fail: err => {
        cb(err);
      },
    });
  }

  onContextMenu(record, column) {
    return [
      { title: '测试一' + column.title, key: '1' },
      { title: '测试禁用', key: '2', disabled: true },
      {
        title: '测试子菜单',
        key: '3',
        children: [{ title: '测试二', key: '3-1' }, { title: '测试禁用', key: '3-2', disabled: true }],
      },
    ];
  }

  onHeadContextMenu(column) {
    return [
      { title: '列测试一' + column.title, key: '1' },
      { title: '列测试禁用', key: '2', disabled: true },
      {
        title: '列测试子菜单',
        key: '3',
        children: [{ title: '列测试二', key: '3-1' }, { title: '列测试禁用', key: '3-2', disabled: true }],
      },
    ];
  }

  onMenuClick(data) {
    message.info(data.item.props.children);
  }

  refreshData(data) {
    const { result } = this.state;
    for (let i = 0; i < result.senceList.length; i += 1) {
      if (result.senceList[i][KEY] === data[KEY]) {
        result.senceList[i] = data;
        break;
      }
    }
    this.setState({ result });
  }

  formatData(res) {
    this.setState({
      result: {
        senceList: res.recordList,
        senceHeader: this.formatHeaders(res.recordHead),
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
      // 一级菜单
      if (item.columnName === 'location') {
        // 场次
        for (let j = 0; j < item.subColumns.length; j++) {
          const subItem = item.subColumns[j];
          const locationId = Number(subItem.columnKey.split('-')[1]);
          _item.title = subItem.columnName;
          _item.key = subItem.columnKey;
          _item.id = locationId;
          list.push(Object.assign({}, _item, columnMap[item.columnName]));
        }
      } else if (item.columnName === 'charact') {
        // 主演
        for (let x = 0; x < item.subColumns.length; x++) {
          const subItem = item.subColumns[x];
          const charactId = Number(subItem.columnKey.split('-')[1]);
          _item.title = subItem.columnName;
          _item.key = subItem.columnKey;
          _item.name = subItem.shortName;
          _item.id = charactId;
          list.push(Object.assign({}, _item, columnMap[item.columnName]));
        }
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
      result: { senceList, senceHeader, totalCount, wenpageSumCount, wupageSumCount },
      loading,
    } = this.state;
    const currentPage = pageIndex + 1;
    return (
      <Card id="full-screen" className={styles.CardWrapper}>
        <EaTable
          rowKey={KEY}
          totalInfo={
            <div style={{ display: 'inline-block' }}>
              <span style={{ color: '#1890FF' }}>{totalCount}</span>个场次；文戏：{' '}
              <span style={{ color: '#1890FF' }}>{wenpageSumCount}</span> 页；武戏：
              <span style={{ color: '#1890FF' }}>{wupageSumCount}</span> 页
            </div>
          }
          fullId="full-screen"
          loading={loading}
          columns={senceHeader}
          dataSource={senceList}
          current={currentPage}
          pageSize={pageNum}
          total={totalCount}
          onMenuClick={key => this.onMenuClick(key)}
          onContextMenu={(record, column) => this.onContextMenu(record, column)}
          onHeadContextMenu={column => this.onHeadContextMenu(column)}
          getSelectData={(type, column, cb) => this.getSelectData(type, column, cb)}
          onChangeValue={(record, column, value, cb) => this.onChangeValue(record, column, value, cb)}
          onChange={(pagination, filters, sorter) => this.changePage(pagination, filters, sorter)}
        />
      </Card>
    );
  }
}
