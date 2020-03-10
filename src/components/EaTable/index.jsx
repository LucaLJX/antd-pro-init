import React, { Component } from 'react';
import {
  Table,
  Pagination,
  Tag,
  Icon,
  Button,
  Slider,
  Radio,
  Input,
  Alert,
  Select,
  Checkbox,
  AutoComplete,
  InputNumber,
  Divider,
  Switch,
  Dropdown,
  Menu,
} from 'antd';
import style from './index.less';

const verticalSize = {
  1: 's',
  2: 's',
  3: 'xs',
  4: 'xs',
  5: 'xxs',
  6: 'xxs',
};
const filterIcon = {
  input: 'search',
  search: 'filter',
  checkbox: 'filter',
  searchCheckbox: 'filter',
  radio: 'filter',
};

const FILTER_DATA = 'filterData';
const FILTER_EXTEND_DATA = 'filterExtendData';
const EDIT_DATA = 'editData';

const FILTER_DEFAULT = 0;
const FILTER_EXTEND = 1;

const KEY_CODE_ENTER = 13;
const KEY_CODE_ESC = 27;
const KEY_CODE_TAB = 9;
const KEY_CODE_SHIFT = 16;
const KEY_CODE_CTRL = 17;
const KEY_CODE_ALT = 18;
const KEY_CODE_COMMAND_LEFT = 91;
const KEY_CODE_COMMAND_RIGHT = 93;

class TableData {
  constructor() {
    this.keyMap = {};
    this.filterMap = {};
    this.agent = null;
    this.updateAgent = null;
    this.editMode = false;
    this.page = 1;
    this.source = [];
    this.rowKey = 'key';
    this.clearTable();
    window.onkeydown = this.onKeydown;
    window.onkeyup = this.onKeyup;
    window.onClick = this.onClick;
  }

  getTable() {
    if (!this.table) this.table = document.getElementsByTagName('table')[0].parentNode;
    return this.table;
  }

  clearTable() {
    this.selectRow = {};
    this.selectKey = {};
    this.selectRowCB = {};
    this.endEditCB = null;
    this.startEditCB = null;
    this.cancelEditCB = null;
    this.enterEditCB = null;
    this.enterCB = null;
    this.table = null;
  }

  setAgent(agent, updateAgent) {
    this.agent = agent;
    this.updateAgent = updateAgent;
  }

  onUpdateAgent(data) {
    if (this.updateAgent) this.updateAgent(data);
  }

  onClick = e => {};

  onKeydown = e => {
    let active = false;
    if (this.keyMap[e.keyCode]) return false;
    switch (e.keyCode) {
      case KEY_CODE_ENTER:
        this.onEnter(true);
        active = true;
        break;
      case KEY_CODE_ESC:
        this.onEsc(true);
        active = true;
        break;
      case KEY_CODE_TAB:
        this.onTab(true);
        active = true;
        break;
      case KEY_CODE_SHIFT:
      case KEY_CODE_CTRL:
      case KEY_CODE_ALT:
      case KEY_CODE_COMMAND_LEFT:
      case KEY_CODE_COMMAND_RIGHT:
        active = true;
        break;
    }
    if (active) {
      this.keyMap[e.keyCode] = true;
      return false;
    }
  };

  onKeyup = e => {
    let active = false;
    switch (e.keyCode) {
      case KEY_CODE_ENTER:
        this.onEnter(false);
        active = true;
        break;
      case KEY_CODE_ESC:
        this.onEsc(false);
        active = true;
        break;
      case KEY_CODE_TAB:
        this.onTab(false);
        active = true;
        break;
      case KEY_CODE_SHIFT:
      case KEY_CODE_CTRL:
      case KEY_CODE_ALT:
      case KEY_CODE_COMMAND_LEFT:
      case KEY_CODE_COMMAND_RIGHT:
        active = true;
        break;
    }
    if (active) {
      this.keyMap[e.keyCode] = false;
      return false;
    }
  };

  onEnter(b) {
    if (b) if (this.enterEditCB) this.enterEditCB();
    if (b) if (this.enterCB) this.enterCB();
  }

  onEsc() {
    this.cancelEdit();
  }

  onTab() {}

  isShift() {
    return this.keyMap[KEY_CODE_SHIFT];
  }

  isAlt() {
    return this.keyMap[KEY_CODE_ALT];
  }

  isCtrl() {
    return this.keyMap[KEY_CODE_CTRL] || this.keyMap[KEY_CODE_COMMAND_LEFT] || this.keyMap[KEY_CODE_COMMAND_RIGHT];
  }

  onEnterCB(cb) {
    this.enterCB = cb;
  }

  cancelEnterCB() {
    this.enterCB = null;
  }

  startEdit(type, cb) {
    if (!this.editMode && type == 'click') {
      if (!this.isAlt()) return;
    }
    if (this.editMode && type == 'click') {
      if (this.isCtrl() || this.isShift()) return;
    }
    if (this.endEditCB) {
      this.startEditCB = cb;
    } else {
      cb();
    }
  }

  endEdit() {
    if (this.endEditCB) {
      this.endEditCB(() => {
        this.endEditCB = null;
        this.cancelEditCB = null;
        this.enterEditCB = null;
        if (this.startEditCB) {
          this.startEditCB();
          this.startEditCB = null;
        }
      });
    }
  }

  cancelEdit() {
    if (this.cancelEditCB) {
      this.cancelEditCB(() => {
        this.cancelEditCB = null;
        this.endEditCB = null;
        this.enterEditCB = null;
      });
    }
  }

  onEndEdit(cb) {
    this.endEditCB = cb;
  }

  onCancelEdit(cb) {
    this.cancelEditCB = cb;
  }

  onEnterEdit(cb) {
    this.enterEditCB = cb;
  }

  onSelectRow(key, cb) {
    this.selectRowCB[key] = cb;
  }

  emitSelectRow(key, selected, position = '') {
    if (this.selectRowCB[key]) this.selectRowCB[key](selected, position);
  }

  setSelectRow(index) {
    if (!this.selectRow[this.page]) this.selectRow[this.page] = [];
    const key = this.source[index][this.rowKey];
    const unSelected = [];
    if (this.isCtrl()) {
      if (this.selectKey[key]) {
        this.selectRow[this.page].splice(this.selectRow[this.page].indexOf(index), 1);
        delete this.selectKey[key];
        unSelected.push(key);
      } else {
        this.selectRow[this.page].push(index);
        this.selectKey[key] = true;
      }
    } else if (this.isShift()) {
      const last =
        this.selectRow[this.page].length > 0 ? this.selectRow[this.page][this.selectRow[this.page].length - 1] : index;
      for (let i = last; last > index ? i >= index : i <= index; last > index ? (i -= 1) : (i += 1)) {
        if (!this.selectKey[this.source[i][this.rowKey]]) {
          this.selectRow[this.page].push(i);
          this.selectKey[this.source[i][this.rowKey]] = true;
        }
      }
    } else {
      for (let k in this.selectKey) {
        unSelected.push(k);
      }
      if ((!this.editMode && this.isAlt()) || (this.editMode && !this.isCtrl() && !this.isShift())) {
        this.selectRow = { [this.page]: [] };
        this.selectKey = {};
      } else {
        this.selectRow = { [this.page]: [index] };
        this.selectKey = { [key]: true };
      }
    }
    const selected = [];
    this.selectRow[this.page].forEach(i => {
      const k = this.source[i][this.rowKey];
      let p = '';
      if (!this.source[i - 1] || !this.selectKey[this.source[i - 1][this.rowKey]]) {
        p += ' top';
      }
      if (!this.source[i + 1] || !this.selectKey[this.source[i + 1][this.rowKey]]) {
        p += ' bottom';
      }
      this.emitSelectRow(k, true, p);
      selected.push(k);
    });
    unSelected.forEach(k => {
      this.emitSelectRow(k, false);
    });

    if (this.agent && this.agent.onSelectedChange) this.agent.onSelectedChange(selected);
  }

  getSelectByKey(key) {
    let position = '';
    let i = 0;
    for (; i < this.source.length; i += 1) {
      if (this.source[i][this.rowKey] === key) break;
    }
    if (!this.source[i - 1] || !this.selectKey[this.source[i - 1][this.rowKey]]) {
      position += ' top';
    }
    if (!this.source[i + 1] || !this.selectKey[this.source[i + 1][this.rowKey]]) {
      position += ' bottom';
    }
    return { selected: this.selectKey[key], position };
  }

  getAllSelect() {
    return this.selectKey;
  }

  setTableData({ current, dataSource, rowKey }) {
    this.page = current;
    this.source = dataSource;
    this.rowKey = rowKey;
  }

  setEditMode(checked) {
    this.editMode = checked;
  }

  getEditMode() {
    return this.editMode;
  }

  onFilterShow(key, cb) {
    if (!this.filterMap[key]) this.filterMap[key] = {};
    this.filterMap[key].show = cb;
  }
  onFilterHide(key, cb) {
    if (!this.filterMap[key]) this.filterMap[key] = {};
    this.filterMap[key].hide = cb;
  }

  showFilter(show, key) {
    if (this.filterMap[key]) {
      if (show && this.filterMap[key].show) this.filterMap[key].show();
      if (!show && this.filterMap[key].hide) this.filterMap[key].hide();
    }
  }

  onContextMenu(record, column) {
    let menu = [];
    if (this.agent && this.agent.onContextMenu) {
      menu = this.agent.onContextMenu(record, column) || [];
      if (!(menu instanceof Array)) menu = [];
    }
    this.onUpdateAgent({ menu });
  }

  onHeadContextMenu(column) {
    let menu = [];
    if (this.agent && this.agent.onHeadContextMenu) {
      menu = this.agent.onHeadContextMenu(column) || [];
      if (!(menu instanceof Array)) menu = [];
    }
    this.onUpdateAgent({ menu });
  }

  onChangeValue(record, column, value, cb) {
    if (this.agent && this.agent.onChangeValue) this.agent.onChangeValue(record, column, value, cb);
  }

  getSelectData(type, column, cb) {
    if (this.agent && this.agent.getSelectData) this.agent.getSelectData(type, column, cb);
  }
}

const tableData = new TableData();

function hasClass(ele, cls) {
  return ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}
//为指定的dom元素添加样式
function addClass(ele, cls) {
  if (!hasClass(ele, cls)) ele.className += ' ' + cls;
}
//删除指定dom元素的样式
function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
    ele.className = ele.className.replace(reg, ' ');
  }
}
//如果存在(不存在)，就删除(添加)一个样式
function toggleClass(ele, cls) {
  if (hasClass(ele, cls)) {
    removeClass(ele, cls);
  } else {
    addClass(ele, cls);
  }
}

function fullScreen(id, system = false) {
  var element = document.getElementById(id);
  if (system) {
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    }
  } else {
    toggleClass(element, 'full-screen');
  }
}

//退出全屏
function exitFullscreen(id, system = false) {
  var element = document.getElementById(id);
  if (system) {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  } else {
    toggleClass(element, 'full-screen');
  }
}

let INDEX_KEY = 0;

function refreshKey() {
  INDEX_KEY += 1;
  tableData.clearTable();
  return INDEX_KEY;
}

class EaTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editMode: tableData.getEditMode(),
      columns:
        props.columns.map(column => {
          return this.formatHeader(column);
        }) || [],
      size: 10,
      full: false,
      filter: false,
      key: refreshKey(),
      menu: [],
    };
    tableData.setAgent(this.props, data => {
      this.setState(data);
    });
  }

  componentWillReceiveProps(newProps) {
    this.state.columns =
      newProps.columns.map((column, index) => {
        if (index === 0) column.position = 'start';
        if (index === newProps.columns.length - 1) column.position = 'end';
        return this.formatHeader(column);
      }) || [];
  }

  formatHeader(column) {
    if (!column.key) column.key = column.dataIndex;
    if (!column.onHeaderCell)
      column.onHeaderCell = () => ({
        column,
      });
    if (!column.onCell)
      column.onCell = (record, index) => ({
        record,
        column,
        index,
      });
    if (column.filter && !column.filterDropdown)
      column.filterDropdown = props => <FilterItem {...props} column={column} />;
    if (column.filter && !column.filterIcon)
      column.filterIcon = filtered => (
        <Icon
          type={filterIcon[column.filterType]}
          theme={filterIcon[column.filterType] == 'search' ? 'outlined' : 'filled'}
          style={{ color: filtered ? '#1890ff' : undefined }}
        />
      );
    if (column.filter && !column.onFilterDropdownVisibleChange)
      column.onFilterDropdownVisibleChange = visible => tableData.showFilter(visible, column.key);
    return column;
  }

  switchFull() {
    const { full } = this.state;
    const { fullId } = this.props;
    if (fullId) {
      if (full) {
        exitFullscreen(fullId);
      } else {
        fullScreen(fullId);
      }
    }
    this.setState({ full: !full });
  }

  clearFilters() {
    const { key } = this.state;
    const { onChange, pageSize } = this.props;
    this.onChange({ current: 1, pageSize }, {}, {});
  }

  onChange(pagination, filters, sorter) {
    const { filter, key } = this.state;
    const { onChange } = this.props;
    if (onChange) onChange(pagination, filters, sorter);
    let _filter = false;
    if (sorter.order) _filter = true;
    if (!_filter) {
      for (let k in filters) {
        if (filters[k] && filters[k].length > 0) {
          _filter = true;
          continue;
        }
      }
    }
    if (filter != _filter) {
      this.setState({ filter: _filter, key: !_filter ? refreshKey() : key });
    }
  }

  onEditChange(checked) {
    tableData.setEditMode(checked);
    this.setState({ editMode: tableData.getEditMode() });
  }

  getMenu(item) {
    if (item.divider) return <Menu.Divider />;
    if (item.children) {
      return (
        <Menu.SubMenu {...item}>
          {item.children.map(_item => {
            return this.getMenu(_item);
          })}
        </Menu.SubMenu>
      );
    }
    return <Menu.Item {...item}>{item.title}</Menu.Item>;
  }

  render() {
    const { columns, scaleType, size, full, filter, key, editMode, menu = [] } = this.state;
    const {
      fullId,
      totalInfo,
      rowKey,
      loading,
      dataSource,
      current,
      pageSize,
      total,
      onChange,
      onChangePage,
      onShowSizeChange,
      onMenuClick,
      pagination = true,
      edit = true,
    } = this.props;
    tableData.setTableData(this.props);
    return (
      <div className={style.body}>
        <div className="info-warpper">
          <div className="total-info">
            <Alert
              message={
                <div>
                  {totalInfo}
                  <Button hidden={!filter} className="clear" type="link" onClick={() => this.clearFilters()}>
                    全部重置
                  </Button>
                </div>
              }
              type="info"
              showIcon
            />
          </div>
          <div className="action-list">
            {edit && (
              <div className="action">
                <span className="edit-mode">
                  编辑模式 : <Switch checked={editMode} onChange={value => this.onEditChange(value)} />
                </span>
              </div>
            )}
            <div className="action">
              <Icon hidden={!fullId} type={full ? 'fullscreen-exit' : 'fullscreen'} onClick={() => this.switchFull()} />
              <Select value={size} onChange={value => this.setState({ size: value })}>
                <Select.Option value={10}>100%</Select.Option>
                <Select.Option value={9}>90%</Select.Option>
                <Select.Option value={8}>80%</Select.Option>
                <Select.Option value={7}>70%</Select.Option>
              </Select>
            </div>
          </div>
        </div>
        <Dropdown
          overlay={
            <Menu onClick={item => onMenuClick && onMenuClick(item)}>
              {menu.map(item => {
                return this.getMenu(item);
              })}
            </Menu>
          }
          trigger={['contextMenu']}
        >
          <div className={`table-wrapper scale s-${size}`}>
            <Table
              key={key}
              rowKey={rowKey}
              size="small"
              bordered={false}
              loading={loading}
              getPopupContainer={() => tableData.getTable()}
              components={{
                header: { row: TableHeaderRow, cell: TableHeaderCell },
                body: { row: TableBodyRow, cell: TableBodyCell },
              }}
              dataSource={dataSource}
              pagination={
                pagination
                  ? {
                      size: 'small',
                      current,
                      pageSize,
                      pageSizeOptions: ['10', '20', '30', '40'],
                      total,
                      showSizeChanger: true,
                      showQuickJumper: true,
                    }
                  : false
              }
              columns={columns}
              onChange={(pagination, filters, sorter) => this.onChange(pagination, filters, sorter)}
            ></Table>
          </div>
        </Dropdown>
      </div>
    );
  }
}

class TableHeaderRow extends Component {
  render() {
    return <tr {...this.props} className={this.props.className + 'ea-table-header-row'} />;
  }
}

class TableHeaderCell extends Component {
  onContextMenu() {
    const { column } = this.props;
    tableData.onHeadContextMenu(column);
  }

  format(column, children) {
    switch (column.headerType) {
      case 'vertical':
        return <div className={`${verticalSize[column.title.length] || 'xxs'}`}>{children}</div>;
      default:
        break;
    }
    return children;
  }

  render() {
    const { children, column } = this.props;
    return (
      <th
        {...this.props}
        style={column.minWidth ? { minWidth: column.minWidth } : {}}
        className={`${this.props.className || ''} ${column.headerType} ea-table-header-cell`}
        onContextMenu={() => this.onContextMenu()}
      >
        {this.format(column, children)}
      </th>
    );
  }
}

class TableBodyRow extends Component {
  constructor(props) {
    super(props);
    this.state = tableData.getSelectByKey(props['data-row-key']);
    tableData.onSelectRow(props['data-row-key'], (selected, position) => {
      this.setState({ selected, position });
    });
  }
  render() {
    const { selected, position } = this.state;
    return (
      <tr
        {...this.props}
        className={`${this.props.className} ea-table-body-row ${selected ? 'selected' : ''} ${position}`}
      />
    );
  }
}

class TableBodyCell extends Component {
  constructor(props) {
    super(props);
    this.state = { value: null, edit: false, error: false, list: [], oList: [] };
    this.editEnding = false;
    this.searching = false;
  }

  formatData(column, record) {
    const { value } = this.state;
    if (value !== null) return value;
    let data = record[column.dataIndex];
    switch (column.dataType) {
      case 'find':
        data = record[column.dataIndex].find(_item => {
          return _item[column.findKey] == column.id;
        });
      default:
        break;
    }
    if (data instanceof Array) {
      data = data.map((item, index) => ({
        label: column.showKey ? item[column.showKey] : item,
        key: column.showKey ? item[column.showKey] : item,
      }));
    } else if (typeof data === 'object' && column.showKey) {
      data = data[column.showKey];
    }
    return data;
  }

  getValue(column, record) {
    const data = this.formatData(column, record);
    if (column.getValue && data) return column.getValue(column, data);
    return data;
  }

  getLabel(column, record) {
    const data = this.formatData(column, record);
    if (column.getLabel && data) return column.getLabel(column, data);
    return data;
  }

  format(column, record) {
    const { edit } = this.state;
    const data = this.getLabel(column, record);
    switch (column.type) {
      case 'tag':
        return (
          <div>
            {data &&
              data.map((item, i) => (
                <Tag closable={edit} key={i} style={edit ? { marginRight: 15 } : {}}>
                  {item.label}
                </Tag>
              ))}
          </div>
        );
      default:
        break;
    }
    return data;
  }

  onSearch(value) {
    if (!value) {
      this.searching = false;
      this.setState({ list: [] });
    } else {
      const { oList } = this.state;
      const { column } = this.props;
      const list = [];
      if (column.editAllowAdd) list.push({ label: value, value });
      for (let i = 0; i < oList.length; i += 1) {
        if (column.editAllowAdd && oList[i].label == value) continue;
        if (oList[i].label.indexOf(value) >= 0) {
          list.push({ label: oList[i].label, value: oList[i].label });
        }
      }
      this.setState({ list });
      this.searching = true;
    }
  }

  onChange(value) {
    this.setState({ value });
    setTimeout(() => {
      const { column } = this.props;
      if (column.editType == 'radio') this.onEnter();
      this.searching = false;
    }, 1);
  }

  onEnd() {
    if (this.editEnding) return;
    tableData.endEdit();
  }

  onOut() {
    this.onEnd();
  }

  onEnter() {
    if (!this.state.edit) return;
    if (this.searching) return;
    this.onEnd();
  }

  onSelect() {
    this.setState({ list: [] });
    setTimeout(() => {
      this.searching = false;
    }, 1);
  }

  onDeselect() {}

  onContextMenu() {
    const { column, record } = this.props;
    tableData.onContextMenu(record, column);
  }

  onDoubleClick() {
    const { edit } = this.state;
    if (edit) return;
    tableData.startEdit('doubleClick', () => {
      this.openEdit();
    });
  }

  onClick() {
    const { edit } = this.state;
    if (edit) return;
    const { index } = this.props;
    tableData.setSelectRow(index);
    tableData.startEdit('click', () => {
      this.openEdit();
    });
  }

  openEdit() {
    const { column } = this.props;
    this.setState({ edit: true });
    tableData.getSelectData(EDIT_DATA, column, list => {
      this.setState({ oList: list });
    });
    tableData.onCancelEdit(cb => {
      this.setState({ edit: false, error: false, value: null });
      cb();
    });
    tableData.onEndEdit(cb => {
      this.editEnding = true;
      this.onChangeValue(this.state.value, err => {
        if (err) {
          this.setState({ error: true });
        } else {
          this.setState({ edit: false, error: false, value: null });
          cb();
        }
        this.editEnding = false;
      });
    });
    tableData.onEnterEdit(() => {
      this.onEnter();
    });
  }

  onChangeValue(value, cb) {
    const { column, record } = this.props;
    if (this.isChange()) {
      tableData.onChangeValue(record, column, value, cb);
    } else {
      cb();
    }
  }

  isChange() {
    const { value } = this.state;
    if (value === null) return false;
    const { record, column } = this.props;
    let data = record[column.dataIndex];
    switch (column.dataType) {
      case 'find':
        data = record[column.dataIndex].find(_item => {
          return _item[column.findKey] == column.id;
        });
      default:
        break;
    }
    if (data instanceof Array) {
      if (!value && data.length == 0) return false;
      if (!value && data.length > 0) return true;
      return data.map(item => (column.showKey ? item[column.showKey] : item)).join('') != value.map(item => item.label);
    } else if (typeof data === 'object' && column.showKey) {
      return data[column.showKey] != value;
    } else {
      return data != value;
    }
  }

  formatEdit(column, record) {
    const { list = [], oList = [] } = this.state;
    const value = this.getValue(column, record);
    switch (column.editType) {
      case 'input':
        return (
          <Input autoFocus onBlur={() => this.onOut()} value={value} onChange={e => this.onChange(e.target.value)} />
        );
      case 'number':
        return (
          <Input
            autoFocus
            onBlur={() => this.onOut()}
            value={value}
            onChange={e => {
              const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]?)?$/;
              const value = e.target.value;
              if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
                this.onChange(value);
              }
            }}
          />
        );
      case 'auto':
        return (
          <AutoComplete
            ref={ref => (this.ele = ref)}
            autoFocus
            filterOption={false}
            notFoundContent={null}
            onSearch={value => this.onSearch(value)}
            getPopupContainer={() => tableData.getTable()}
            onBlur={() => this.onOut()}
            value={value}
            onChange={value => this.onChange(value)}
            dropdownMatchSelectWidth={false}
          >
            {list.map(item => {
              return (
                <AutoComplete.Option className={item.className} key={item.value}>
                  {item.label}
                </AutoComplete.Option>
              );
            })}
          </AutoComplete>
        );
      case 'radio':
        return (
          <Select
            autoFocus
            showArrow={false}
            defaultOpen
            getPopupContainer={() => tableData.getTable()}
            onBlur={() => this.onOut()}
            value={value}
            onChange={value => this.onChange(value)}
            dropdownMatchSelectWidth={false}
          >
            {oList.map(item => {
              return (
                <Select.Option className={item.className} key={item.value}>
                  {item.label}
                </Select.Option>
              );
            })}
          </Select>
        );
      case 'checkbox':
        return (
          <Select
            mode="multiple"
            autoFocus
            showArrow={false}
            labelInValue
            filterOption={false}
            notFoundContent={null}
            onSearch={value => this.onSearch(value)}
            getPopupContainer={() => tableData.getTable()}
            onBlur={() => this.onOut()}
            value={value}
            onChange={value => this.onChange(value)}
            dropdownMatchSelectWidth={false}
            onSelect={() => this.onSelect()}
            onDeselect={() => this.onDeselect()}
          >
            {list.map(item => {
              return (
                <Select.Option className={item.className} key={item.value}>
                  {item.label}
                </Select.Option>
              );
            })}
          </Select>
        );
      default:
        break;
    }
    return '';
  }

  render() {
    const { column, record } = this.props;
    const { edit, error } = this.state;
    return (
      <td
        {...this.props}
        className={`${this.props.className} ea-table-body-cell ${column.position ? column.position : ''}`}
        onDoubleClick={() => this.onDoubleClick()}
        onClick={() => this.onClick()}
        onContextMenu={() => this.onContextMenu()}
      >
        {this.format(column, record)}
        {edit && <div className={`edit ${error ? 'error' : ''}`}>{this.formatEdit(column, record)}</div>}
      </td>
    );
  }
}

class FilterItem extends Component {
  constructor(props) {
    super(props);
    const { column } = props;
    this.state = {
      value: [column.filterDefault || [], column.filterExtendDefault || []],
      searchValue: '',
      list: [],
      oList: [],
      extendList: [],
      key: 1,
      indeterminate: false,
      checkAll: false,
    };
    this.searching = false;
    this.tmp = null;
    tableData.onFilterShow(props.column.key, () => this.onShow());
    tableData.onFilterHide(props.column.key, () => this.onHide());
  }

  onShow() {
    const { column } = this.props;
    this.tmp = {
      searchValue: this.state.searchValue,
      value: [this.state.value[0], this.state.value[1]],
      indeterminate: this.state.indeterminate,
      checkAll: this.state.checkAll,
    };
    tableData.getSelectData(FILTER_DATA, column, list => {
      this.onInit(list);
      this.setState({ key: this.state.key + 1, oList: list });
    });
    if (column.filterExtend)
      tableData.getSelectData(FILTER_EXTEND_DATA, column, list => {
        this.setState({ extendList: list });
      });
    tableData.onEnterCB(() => {
      this.onEnter();
    });
  }

  onHide() {
    if (this.tmp) this.setState(this.tmp);
    tableData.cancelEnterCB();
  }

  onInit(list) {
    const { searchValue, value } = this.state;
    const { column = {} } = this.props;
    const { filterType } = column;
    switch (filterType) {
      case 'searchCheckbox':
        if (!searchValue && this.getValue(FILTER_DEFAULT).length === 0) {
          this.onSearchValue(searchValue, FILTER_DEFAULT, list);
        }
        break;
      case 'checkbox':
      case 'radio':
        this.setState({ list });
        break;
    }
  }

  onConfirm() {
    const { setSelectedKeys, confirm, column } = this.props;
    const { auto, searchValue, value, oList } = this.state;
    if (value[FILTER_DEFAULT].length === 0) return this.onClear();
    this.tmp = null;
    setSelectedKeys([value[FILTER_DEFAULT], value[FILTER_EXTEND]]);
    confirm();
  }

  onClear() {
    const { clearFilters, column } = this.props;
    this.setState({ searchValue: '', value: [column.filterDefault || [], column.filterExtendDefault || []] });
    this.tmp = null;
    clearFilters();
  }

  render() {
    const { column = {} } = this.props;
    const { filterType } = column;
    switch (filterType) {
      case 'input':
        return this.renderInput();
      case 'search':
        return this.renderSearch();
      case 'checkbox':
        return this.renderCheckbox();
      case 'searchCheckbox':
        return this.renderSearchCheckbox();
      case 'radio':
        return this.renderRadio();
      default:
        return <div />;
    }
  }

  onCheckAllChange(checked, type) {
    const { list = [] } = this.state;
    if (checked) {
      this.setValue(list.map(item => item.value), type);
    } else {
      this.setValue([], type);
    }
    this.setState({
      indeterminate: false,
      checkAll: checked,
      auto: false,
    });
  }

  onCheck(value, type) {
    const { list = [] } = this.state;
    this.setValue(value, type);
    this.setState({
      indeterminate: !!value.length && value.length < list.length,
      checkAll: value.length === list.length,
      auto: false,
    });
  }

  onSearchValue(value, type, data) {
    const { oList } = this.state;
    const { column } = this.props;
    const _list = data || oList;
    const list = [];
    const selectList = [];
    for (let i = 0; i < _list.length; i += 1) {
      if (_list[i].label.indexOf(value) >= 0) {
        list.push({ label: _list[i].label, value: _list[i].label });
        selectList.push(_list[i].label);
      }
    }
    this.setValue(selectList, type);
    this.setState({ list, searchValue: value, auto: true, checkAll: true, indeterminate: false });
  }

  onSearch(value) {
    if (!value) {
      this.searching = false;
      this.setState({ list: [] });
    } else {
      const { oList } = this.state;
      const { column } = this.props;
      const list = [];
      if (column.filterAllowAdd) list.push({ label: value, value });
      for (let i = 0; i < oList.length; i += 1) {
        if (column.filterAllowAdd && oList[i].label == value) continue;
        if (oList[i].label.indexOf(value) >= 0) list.push(oList[i]);
      }
      this.setState({ list });
      this.searching = true;
    }
  }

  onSelect() {
    this.setState({ list: [] });
    setTimeout(() => {
      this.searching = false;
    }, 1);
  }

  onDeselect() {}

  onEnter() {
    if (this.searching) return;
    this.onConfirm();
  }

  setValue(v, type) {
    const { value } = this.state;
    value[type] = v;
    this.setState({ value });
  }

  getValue(type) {
    const { value } = this.state;
    return value[type];
  }

  renderInput() {
    const { list = [], key } = this.state;
    return (
      <div className={style.filter}>
        <div className="search-body" key={key}>
          <Input
            prefix={<Icon type="search" />}
            autoFocus
            value={this.getValue(FILTER_DEFAULT)}
            onChange={e => this.setValue(e.target.value, FILTER_DEFAULT)}
          />
        </div>
        {this.renderExtend()}
        <div className="search-btns">
          <Button type="primary" onClick={() => this.onConfirm()} size="small">
            确定
          </Button>
          <Button onClick={() => this.onClear()} size="small">
            重置
          </Button>
        </div>
      </div>
    );
  }

  renderCheckbox() {
    const { column } = this.props;
    const { list = [], indeterminate, checkAll } = this.state;
    return (
      <div className={style.filter}>
        <div className="select-body">
          {column.filterCheckboxAll && (
            <Checkbox
              className="ant-checkbox-group-item"
              indeterminate={indeterminate}
              onChange={e => this.onCheckAllChange(e.target.checked, FILTER_DEFAULT)}
              checked={checkAll}
            >
              全部
            </Checkbox>
          )}
          <Checkbox.Group
            options={list}
            value={this.getValue(FILTER_DEFAULT)}
            onChange={value => this.onCheck(value, FILTER_DEFAULT)}
          />
        </div>
        {this.renderExtend()}
        <div className="select-btns">
          <Button type="link" onClick={() => this.onConfirm()} size="small">
            确定
          </Button>
          <Button type="link" onClick={() => this.onClear()} size="small">
            重置
          </Button>
        </div>
      </div>
    );
  }

  renderSearchCheckbox() {
    const { column } = this.props;
    const { list = [], key, auto, searchValue, indeterminate, checkAll } = this.state;
    return (
      <div className={style.filter}>
        <div className="search-auto-body">
          <Input
            autoFocus
            key={key}
            value={searchValue}
            onChange={e => this.onSearchValue(e.target.value, FILTER_DEFAULT)}
          />
        </div>
        <div className={`select-auto-body ${auto ? 'auto' : ''}`}>
          {list.length > 0 && column.filterCheckboxAll && (
            <Checkbox
              className="ant-checkbox-group-item"
              indeterminate={indeterminate}
              onChange={e => this.onCheckAllChange(e.target.checked, FILTER_DEFAULT)}
              checked={checkAll}
            >
              全部
            </Checkbox>
          )}
          <Checkbox.Group
            options={list}
            value={this.getValue(FILTER_DEFAULT)}
            onChange={value => this.onCheck(value, FILTER_DEFAULT)}
          />
        </div>
        {this.renderExtend()}
        <div className="search-btns">
          <Button type="primary" onClick={() => this.onConfirm()} size="small">
            确定
          </Button>
          <Button onClick={() => this.onClear()} size="small">
            重置
          </Button>
        </div>
      </div>
    );
  }

  renderRadio() {
    const { list = [] } = this.state;
    return (
      <div className={style.filter}>
        <div className="select-body">
          <Radio.Group
            options={list}
            value={this.getValue(FILTER_DEFAULT)}
            onChange={e => this.setValue(e.target.value, FILTER_DEFAULT)}
          />
        </div>
        {this.renderExtend()}
        <div className="select-btns">
          <Button type="link" onClick={() => this.onConfirm()} size="small">
            确定
          </Button>
          <Button type="link" onClick={() => this.onClear()} size="small">
            重置
          </Button>
        </div>
      </div>
    );
  }

  renderSearch() {
    const { list = [], key } = this.state;
    return (
      <div className={style.filter}>
        <div className="search-body" key={key}>
          <Select
            mode="multiple"
            autoFocus
            labelInValue
            filterOption={false}
            value={this.getValue(FILTER_DEFAULT)}
            notFoundContent={null}
            onSearch={value => this.onSearch(value)}
            onChange={value => this.setValue(value, FILTER_DEFAULT)}
            dropdownMatchSelectWidth={false}
            onSelect={() => this.onSelect()}
            onDeselect={() => this.onDeselect()}
          >
            {list.map(item => {
              return <Select.Option key={item.value}>{item.label}</Select.Option>;
            })}
          </Select>
        </div>
        {this.renderExtend()}
        <div className="search-btns">
          <Button type="primary" onClick={() => this.onConfirm()} size="small">
            确定
          </Button>
          <Button onClick={() => this.onClear()} size="small">
            重置
          </Button>
        </div>
      </div>
    );
  }

  renderExtend() {
    const { column } = this.props;
    if (!column.filterExtend) return '';
    const { extendList, value } = this.state;
    switch (column.filterExtendType) {
      case 'radio':
        return (
          <div className="extend-body">
            <Radio.Group
              options={extendList}
              value={this.getValue(FILTER_EXTEND)}
              onChange={e => this.setValue(e.target.value, FILTER_EXTEND)}
            />
          </div>
        );
    }
    return '';
  }
}

export default EaTable;
