import React from 'react'
import { connect } from 'dva'
import styles from './index.less'
import { Layout, Row, Col, Button, Modal, Form, Select, Input, Table, Pagination, Tag, Card } from 'antd'
import ProjectCard from '@/components/ProjectCard'
import _ from 'lodash'

const { Column, ColumnGroup } = Table

@connect(({ senceManage }) => ({ senceManage }))
@Form.create()
export default class ProjectList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      loading: false,
      searchParams: {
        projectId: null,
        pageIndex: 0,
        pageNum: 20,
        addActor: false
      }
    }
  }

  // 初始化
  componentDidMount() {
    const { dispatch, match: {params: {id}} } = this.props
    this.state.searchParams.projectId = id
    this.getSenceData()
  }

  // 获取表格数据
  getSenceData () {
    this.setState({ loading: true })
    const { dispatch, senceManage: { getHeader } } = this.props
    const params = this.state.searchParams
    dispatch({
      type: 'senceManage/getSenceData',
      payload: {
        params: params,
        getHeader: getHeader
      },
      callback: (res) => {
        this.setState({ loading: false })
        if (!getHeader) {
          this.formatHeaders(res.header)
        }
      }
    })
  }

  // 翻页
  changePage (page, pageSize) {
    const pageIndex = page - 1
    this.state.searchParams.pageIndex = pageIndex
    this.getSenceData()
  }

  // 修改每页的条数
  changePageSize(current, size) {
    const { searchParams } = this.state
    this.state.searchParams.pageNum = size
    this.state.searchParams.pageIndex = current - 1
    this.getSenceData()
  }

  // 表头渲染
  getHeader (columnName = '') {
    const width = 12
    return (
      <p
        style={{
          minWidth: columnName.length * 14 + 'px'
        }}
      >{ columnName }</p>
    )
  }

  // 主演的高度
  getChartHeader (columnName = '') {
    const font = 12
    const name = columnName.split('')
    return (
      <div
        style={{
          width: '37px',
          height: '37px',
          position: 'absolute',
          top: '10px',
          left: '0'
        }}
      >
        {
          name.map((item, i) => <p
            key={item + i}
            style={{
              textAlign: 'center',
              fontSize: (14 - (columnName.length - 1) * 2) + 'px',
              height: columnName ? ((37 / columnName.length) + 'px') : '37px',
              lineHeight: columnName ? ((37 / columnName.length) + 'px') : '37px'
            }}
          >{item}</p>)
        }
      </div>
    )
  }

  // 格式化表头
  formatHeaders (data) {
    const { dispatch, match: {params: {id}} } = this.props
    if (!data || data.length === 0) {
      return []
    }
    let list = []
    for (let i = 0; i < data.length; i++) {
      const item = data[i]
      // 一级菜单
      if (item.columnKey && !item.subColumns) {
        // 特约
        if (item.columnName === '特约') {
          list.push({
            title: this.getHeader(item.columnName),
            dataIndex: 'characterFreelance',
            render: (data, record) => {
              if (data && data.length !== 0) {
                return <div
                  style={{
                    whiteSpace: 'nowrap',
                  }}
                >
                  {
                    data.map((tagItem, x) => <Tag
                      style={{
                        display: 'inline-block'
                      }}
                      key={tagItem.fullName + x}>
                      { tagItem.fullName }
                    </Tag>)
                  }
                </div>
              }
            }
          })
        } else if (item.columnName === '群演') {
          // 群演
          list.push({
            title: this.getHeader(item.columnName),
            dataIndex: 'characterGroup',
            render: (data, record) => {
              if (data && data.length !== 0) {
                return <div
                  style={{
                    whiteSpace: 'nowrap',
                  }}
                >
                  {
                    data.map((tagItem, x) => <Tag
                      style={{
                        display: 'inline-block'
                      }}
                      key={tagItem.fullName + x}>
                      { tagItem.fullName }
                    </Tag>)
                  }
                </div>
              }
            }
          })
        } else {
          list.push({
            title: this.getHeader(item.columnName),
            dataIndex: item.columnKey,
            render: (data, record) => {
              const dataType = typeof(data)
              if (dataType !== 'string' && dataType !== 'number') {
                return <p></p>
              }
              return <p
                style={{
                  display: 'block',
                  whiteSpace: 'nowrap',
                }}
              >{ data }</p>
            }
          })
        }
      } else if (item.columnName === 'location') {
        // 场次
        for (let j = 0; j < item.subColumns.length; j++) {
          const subItem = item.subColumns[j];
          const locationId = Number((subItem.columnKey.split('-'))[1])
          list.push({
            title: this.getHeader(subItem.columnName),
            dataIndex: 'location',
            render: (data, record) => {
              const arr = _.filter(data, locationItem => {
                return locationItem.columnId === locationId
              })
              return arr.map((tagItem, y) => <p
                style={{
                  display: 'block',
                  whiteSpace: 'nowrap',
                }}
                key={ tagItem.locationName + y }>{ tagItem.locationName }</p>)
            }
          })
        }
      } else if (item.columnName === 'charact') {
        // 主演
        for (let x = 0; x < item.subColumns.length; x++) {
          const subItem = item.subColumns[x]
          const charactId = Number((subItem.columnKey.split('-'))[1])
          list.push({
            title: this.getChartHeader(subItem.columnName),
            dataIndex: 'characterHead',
            key: 'characterHead' + x,
            render: (data, record) => {
              const arr = _.filter(data, characterHeadItem => characterHeadItem.id === charactId)
              if (arr && arr.length !== 0) {
                return arr.map((tagItem, u) => <p
                  style={{
                    display: 'block',
                    whiteSpace: 'nowrap',
                    textAlign: 'center',
                  }}
                  key={ tagItem.statusName + u }
                >
                  { tagItem.statusName }
                </p>)
              }
            }
          })
        }
      } else {
        list.push({
          title: this.getHeader(item.columnName),
          dataIndex: item.columnKey,
          render: (data, record) => {
            return <p
              style={{
                display: 'block',
                whiteSpace: 'nowrap',
              }}
            >{ data }</p>
          }
        })
      }
    }
    dispatch({
      type: 'senceManage/setHeader',
      payload: {
        header: list
      },
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const {
      visible,
      searchParams: {
        pageIndex,
        pageNum
      },
      loading
    } = this.state
    const { senceManage: { senceList, senceHeader, totalCount, header } } = this.props
    const currentPage = pageIndex + 1
    
    return (
      <div className={styles.wrapper} style={{width: '100%', margin: 'auto', paddingTop: '20px'}}>
        <div className={styles.SearchWrapper}>
          {/* <Button type='primary' onClick={() => this.createHeader()}>添加角色</Button>
          <br/>
          <Button type='primary' onClick={() => this.createTableData()}>添加表格数据</Button> */}
        </div>

        <Card className={styles.CardWrapper}>
          <div className={styles.TableWrapper}>
            {/* table */}
            <Table
              className={styles.table}
              bordered
              loading={loading}
              dataSource={senceList}
              size='small'
              pagination={false}
              columns={header}
              >
            </Table>
          </div>
          <div className={styles.PageWrapper}>
            <Pagination
              size="small"
              defaultPageSize={pageNum}
              pageSize={pageNum}
              pageSizeOptions={['10', '20', '30', '40']}
              defaultCurrent={currentPage}
              total={totalCount}
              showSizeChanger
              showQuickJumper
              onChange={(page, pageSize) => this.changePage(page, pageSize)}
              onShowSizeChange={(current, size) => this.changePageSize(current, size)}
              />
          </div>
        </Card>
      </div>
    )
  }
}
