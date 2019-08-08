import React, { Component } from 'react';
import { Table, Pagination, Tag, Icon, Button } from 'antd';
import style from './index.less';
const verticalSize = {
  1: 's',
  2: 's',
  3: 'xs',
  4: 'xs',
  5: 'xxs',
  6: 'xxs',
};
class SuperTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      columns:
        props.columns.map(column => {
          return this.formatHeader(column);
        }) || [],
    };
  }

  componentWillReceiveProps(newProps) {
    this.state.columns =
      newProps.columns.map(column => {
        return this.formatHeader(column);
      }) || [];
  }

  formatHeader(column) {
    if (!column.key) column.key = column.dataIndex;
    if (typeof column.title === 'string') this.formatTitle(column.headerType, column);
    if (column.render === undefined) this.formatRender(column.type, column);

    return column;
  }

  formatTitle(type, column) {
    let className = 'table-header';
    let title = column.title;
    switch (type) {
      case 'vertical':
        className = `${className} vertical ${verticalSize[column.title.length] || 'xxs'}`;
        column.align = 'center';
        break;
      default:
        break;
    }
    column.title = <div className={className}>{title}</div>;
  }

  formatRender(type, column) {
    let className = 'table-row';
    let cell = data => data;
    switch (type) {
      case 'tag':
        cell = data => data.map((item, i) => <Tag key={i}>{column.showKey ? item[column.showKey] : item}</Tag>);
        break;
      case 'find':
        cell = data => {
          const item = data.find(_item => _item[column.findId] === column.id);
          if (item) return <div className="table-row">{column.showKey ? item[column.showKey] : item}</div>;
        };
        break;
      default:
        break;
    }
    column.render = data => <div className={className}>{cell(data)}</div>;
  }

  render() {
    const { columns } = this.state;
    const { loading, dataSource, currentPage, pageSize, count, onChange, onChangePage, onShowSizeChange } = this.props;
    return (
      <div className={style.body}>
        <div className="table-wrapper">
          <Table
            size="small"
            bordered
            loading={loading}
            dataSource={dataSource}
            pagination={false}
            columns={columns}
            onChange={(p, f, s) => onChange && onChange(f, s)}
          ></Table>
        </div>
        <div className="pagination-warpper">
          <Pagination
            size="small"
            current={currentPage}
            pageSize={pageSize}
            pageSizeOptions={['10', '20', '30', '40']}
            total={count}
            showSizeChanger
            showQuickJumper
            onChange={p => onChangePage && onChangePage(p)}
            onShowSizeChange={(p, s) => onShowSizeChange && onShowSizeChange(p, s)}
          />
        </div>
      </div>
    );
  }
}

export default SuperTable;
