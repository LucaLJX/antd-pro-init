import React from 'react'
import { connect } from 'dva'
import styles from './index.less'
import { Layout, Row, Col, Button, Modal, Form, Select, Input, Table, Pagination, Tag, Card } from 'antd'
import ProjectCard from '@/components/ProjectCard'
import _ from 'lodash'

const { Column, ColumnGroup } = Table

@connect(({ senceManage }) => ({ senceManage }))
@Form.create()
export default class Characters extends React.Component {
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

  componentWillMount () {
  }

  componentWillUnmount () {
    const { dispatch } = this.props
  }

  // 初始化
  componentDidMount() {
    console.log('componentDidMount')
  }

  render() {
    return (
      <div className={styles.wrapper} style={{width: '100%', margin: 'auto', paddingTop: '20px'}}>
        <div className={styles.ContentWrapper}>
          <p>角色内容</p>
        </div>
      </div>
    )
  }
}
