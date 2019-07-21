import React from 'react'
import { connect } from 'dva'
import styles from './index.less'
import { Layout, Row, Col, Button, Modal, Form, Select, Input } from 'antd'
import ProjectCard from '@/components/ProjectCard'


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
    const { dispatch } = this.props
    dispatch({
      type: 'projectList/getCurrentProjects',
    })
    dispatch({
      type: 'projectList/getProjectsAllTypes',
    })
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
        <div className={styles.createButton}>
          <Button type='primary'>新建项目</Button>
        </div>
        <div className={styles.cardWrapper}>
          <Row gutter={16} className={styles.rowCard}>
            {
              projectListData.map((item, i) => (
                <Col span={6} key={i}>
                  <ProjectCard key={`ProjectCard${i}`} projectInfo={item} to={item.projectId}/>
                </Col>
              ))
            }
          </Row>
        </div>
      </div>
    );
  }
}
