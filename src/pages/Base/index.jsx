import React from 'react'
import { connect } from 'dva'
import styles from './index.less'
import { Layout, Row, Col, Button, Modal, Form, Select, Input } from 'antd'

@connect(({ projectList }) => ({ projectList }))
@Form.create()
export default class ProjectList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false
    }
  }

  componentDidMount() {
    console.log('componentDidMount')
  }

  render() {
    const { visible } = this.state
    const { projectList: { projectListData, projectTypesData }, loading, form } = this.props
    const { getFieldDecorator } = form
    console.log(projectListData)
    
    return (
      <div
        style={{
          width: '100%',
          margin: 'auto',
        }}
      >
        <h3>控制台</h3>
      </div>
    );
  }
}
