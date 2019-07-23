import React from 'react'
import { connect } from 'dva'
import styles from './index.less'
import { Layout, Row, Col, Button, Modal, Form, Select, Input, Table, Pagination, Tag } from 'antd'
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
      searchParams: {
        projectId: null,
        pageIndex: 0,
        pageNum: 20,
        addActor: false
      }
    }
  }

  componentDidMount() {
    const { dispatch, match: {params: {id}} } = this.props
    this.state.searchParams.projectId = id
    this.getSenceData()
  }

  // 获取表格数据
  getSenceData () {
    const { dispatch } = this.props
    const params = this.state.searchParams
    dispatch({
      type: 'senceManage/getSenceData',
      payload: params
    })
  }

  createHeader () {
    const { dispatch } = this.props
    const params = this.state.searchParams
    // dispatch({
    //   type: 'senceManage/initHeader',
    //   payload: params.projectId
    // })
  }

  createTableData () {
    const { dispatch } = this.props
    const params = this.state.searchParams
    dispatch({
      type: 'senceManage/initTableData',
      payload: params.projectId
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

  // 取消添加角色
  addActorCancel = () => {
    this.setState({ addActor: false })
    this.props.form.resetFields()
  }

  // 确认添加角色
  addActorConfirm = () => {
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return
      }
      fieldsValue.actorType = 1
      this.props.addCharacter(this.getId(), fieldsValue).then(() => {
        this.addActorCancel()
        this.refreshColumn()
      })
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const {
      visible,
      searchParams: {
        pageIndex,
        pageNum
      }
    } = this.state
    const { senceManage: { senceList, senceHeader, totalCount }, loading } = this.props
    const currentPage = pageIndex + 1
    
    return (
      <div style={{width: '100%', margin: 'auto'}}>
        <div className='styles.SearchWrapper'>
          {/* <Button type='primary' onClick={() => this.createHeader()}>添加角色</Button>
          <br/>
          <Button type='primary' onClick={() => this.createTableData()}>添加表格数据</Button> */}
        </div>
        {/* table */}
        <Table
          bordered
          scroll={{x: true}}
          dataSource={senceList} size='small'
          pagination={false}
          >
          {
            (senceHeader && senceHeader.length !== 0) &&
            senceHeader.map((item, i) => {
              // 一级菜单
              if (item.columnKey && !item.subColumns) {
                if (item.columnName === '特约') {
                  // 特约 根据场的id获取table中的对应场
                  return <Column
                    width='auto'
                    style={{
                      minWidth: '50px',
                      display: 'block',
                      whiteSpace: 'nowrap'
                    }}
                    title={item.columnName}
                    dataIndex={'characterFreelance'}
                    key={item.columnKey + i + '特约'}
                    render={(data) => {
                      if (data && data.length !== 0) {
                        return data.map((tagItem, x) => <Tag key={tagItem.fullName + x}>{ tagItem.fullName }</Tag>)
                      }
                      return <div
                      style={{
                        minWidth: '50px'
                      }}
                      ></div>
                    }}
                    />
                } else if (item.columnName === '群演') {
                  // 群演 根据场的id获取table中的对应场
                  return <Column
                    style={{
                      minWidth: '50px',
                      display: 'block',
                      whiteSpace: 'nowrap'
                    }}
                    width='auto'
                    title={item.columnName}
                    dataIndex={'characterGroup'}
                    key={item.columnKey + i}
                    render={(data) => {
                      if (data && data.length !== 0) {
                        return data.map((tagItem, z) => <Tag key={tagItem.fullName + z}>{ tagItem.fullName }</Tag>)
                      }
                      return <div
                      style={{
                        minWidth: '50px'
                      }}
                      ></div>
                    }}
                    />
                } else {
                  return <Column width='auto' title={item.columnName}  dataIndex={item.columnKey} key={item.columnKey + i}
                  render={data => {
                    return <p
                    style={{
                      minWidth: '50px',
                      display: 'block',
                      whiteSpace: 'nowrap'
                    }}
                    >{ data }</p>
                  }}
                  />
                }
              } else if (item.columnName === 'location') {
                // 场次 根据场的id获取table中的对应场
                return item.subColumns.map((subItem, j) => {
                  const locationId = Number((subItem.columnKey.split('-'))[1])
                  return <Column
                    width='auto'
                    title={subItem.columnName}
                    dataIndex={'location'}
                    key={'sub' + subItem.columnKey + i + j}
                    render={(data) => {
                      const arr = _.filter(data, item => item.columnId === locationId)
                      return arr.map((tagItem, y) => <p
                        style={{
                          minWidth: '50px',
                          display: 'block',
                          whiteSpace: 'nowrap'
                        }}
                        key={ tagItem.locationName + y }>{ tagItem.locationName }</p>)
                    }}
                    />
                })
              } else if (item.columnName === 'charact') {
                // 主演 根据场的id获取table中的对应场
                return item.subColumns.map((subItem, q) => {
                  const charactId = Number((subItem.columnKey.split('-'))[1])
                  return <Column
                    width='auto'
                    title={subItem.columnName}
                    dataIndex={'characterHead'}
                    key={'sub' + subItem.columnKey + i + q}
                    render={(data) => {
                      const arr = _.filter(data, item => item.id === charactId)
                      if (arr && arr.length !== 0) {
                        return arr.map((tagItem, u) => <p
                          style={{
                            minWidth: '50px',
                            display: 'block',
                            whiteSpace: 'nowrap'
                          }}
                          key={ tagItem.statusName 
                            + u }>{ tagItem.statusName 
                            }</p>)
                      }
                      return <div
                      style={{
                        minWidth: '50px'
                      }}
                      ></div>
                    }}
                  />
                })
              } else {
                return item.subColumns.map((subItem, j) => {
                  return <Column width='auto' title={subItem.columnName} dataIndex={subItem.columnKey} key={'sub' + subItem.columnKey + i + j} />
                })
              }
            })
          }
        </Table>
        {/* table page */}
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
      </div>
    )
  }
}
