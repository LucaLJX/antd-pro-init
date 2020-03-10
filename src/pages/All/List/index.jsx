import React from 'react';
import { connect } from 'dva';
import styles from './index.less';
import router from 'umi/router';
import { Layout, Row, Col, Button, Modal, Form, Select, Input, Icon } from 'antd';
import ProjectCard from '@/components/ProjectCard';

@connect(({ projectList }) => ({ projectList }))
@Form.create()
export default class ProjectList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      key: 0,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'projectList/getCurrentProjects',
    });
    dispatch({
      type: 'projectList/getProjectsAllTypes',
    });
  }

  render() {
    const { search, key } = this.state;
    const {
      projectList: { projectListData, projectTypesData },
    } = this.props;
    let list = projectListData;
    if (search) {
      list = projectListData.filter(project => project.name.indexOf(search) >= 0);
    }

    return (
      <div className={styles.projectList}>
        <Row gutter={24} className="top">
          <Col xs={24} sm={24} md={24} lg={18} xl={18} xxl={20}>
            <Col xs={0} sm={3} md={4} lg={8} xl={8} xxl={6} />
            <Col xs={24} sm={18} md={16} lg={16} xl={16} xxl={16}>
              <Input.Search
                key={key}
                className="search"
                placeholder="请输入"
                enterButton="搜索"
                size="large"
                onSearch={value => this.setState({ search: value })}
              />
            </Col>
          </Col>
          <Col xs={24} sm={24} md={24} lg={6} xl={6} xxl={4} className="right">
            <Button type="link" onClick={() => router.push(`/all/create`)}>
              新建项目
            </Button>
            <div className="action">
              <Icon type="lock" theme="filled" />
              <Icon type="delete" theme="filled" />
            </div>
          </Col>
        </Row>
        {search && (
          <div className="filter">
            <Icon type="exclamation-circle" theme="filled" />
            找到{list.length}个项目
            <Button type="link" onClick={() => this.setState({ search: '', key: key + 1 })}>
              重置
            </Button>
          </div>
        )}
        <Row gutter={24} className="list">
          {list.map((item, i) => (
            <Col xs={24} sm={24} md={12} lg={8} xl={6} xxl={6}>
              <div className="item" key={i}>
                <ProjectCard key={`ProjectCard${i}`} projectInfo={item} to={item.projectId} />
              </div>
            </Col>
          ))}
        </Row>
      </div>
    );
  }
}
