import React from 'react'
import { connect } from 'dva'
import styles from './index.less'
import { Layout, Row, Col, Button, Modal, Form, Select, Input, Table, Pagination } from 'antd'
import ProjectCard from '@/components/ProjectCard'


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
        pageNum: 10,
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
    console.log(this.props)
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

  // 处理表头
  formatColumns (list) {
    if (!list) {
      return []
    }
    const columns = []
    for (let i = 0; i < list.length; i++) {
      const listItem = list[i];
      if (listItem.columnKey && !listItem.subColumns) {
        columns.push({
          title: listItem.columnName,
          dataIndex: listItem.columnKey
        })
      } else {
        listItem.subColumns.map((item) => {
          columns.push({
            title: item.columnName,
            dataIndex: item.columnKey
          })
        })
      }
    }
    return columns
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
          columns={this.formatColumns(senceHeader)}
          dataSource={senceList} size="small"
          pagination={false}
          />
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
        {/* 创建角色 */}
        {/* <Modal
          visible={this.state.addActor}
          title={`添加角色`}
          okText='添加'
          cancelText='取消'
          onCancel={this.addActorCancel}
          onOk={this.addActorConfirm}>
          <Form>
            <Form.Item {...formItemLayout} label='性别:'>
              {getFieldDecorator('gender', {
                initialValue: actorGenderType[0].value,
                hidden: !this.state.addActor
              })(
                <Select placeholder='请选择性别'>
                  {actorGenderType.map((item, index) => {
                    return <Select.Option value={item.value}>{item.label}</Select.Option>
                  })}
                </Select>
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label='全称:'>
              {getFieldDecorator('fullName', {
                rules: [{ type: 'string', required: true, message: '全称不能为空' }, { validator: this.checkActorName }],
                validateFirst: true,
                validateTrigger: 'onChange',
                hidden: !this.state.addActor
              })(
                <Input placeholder='请输入全称' />
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label='简称:'>
              {getFieldDecorator('shortName', {
                rules: [{ type: 'string', required: true, message: '简称不能为空' }, { validator: this.checkActorName }],
                validateFirst: true,
                validateTrigger: 'onChange',
                hidden: !this.state.addActor
              })(
                <Input placeholder='请输入简称' />
              )}
            </Form.Item> */}
            {/* <Form.Item {...formItemLayout} label='别名:'>
              {getFieldDecorator('alias', {
                rules: [{ type: 'string', required: true, message: '别名不能为空' }],
                hidden: !this.state.addActor
              })(
                <Input placeholder='请输入别名' />
              )}
            </Form.Item> */}
          {/* </Form>
        </Modal> */}
      </div>
    );
  }
}
