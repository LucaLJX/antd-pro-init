import React from 'react';
import { connect } from 'dva';
import styles from './index.less';
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
        <div className="top">
          <Input.Search
            key={key}
            className="search"
            placeholder="请输入"
            enterButton="搜索"
            size="large"
            onSearch={value => this.setState({ search: value })}
          />
          <div className="right">
            <Button type="link">新建项目</Button>
            <div className="action">
              <Icon type="lock" theme="filled" />
              <Icon type="delete" theme="filled" />
            </div>
          </div>
        </div>
        {search && (
          <div className="filter">
            <Icon type="exclamation-circle" theme="filled" />
            找到{list.length}个项目
            <Button type="link" onClick={() => this.setState({ search: '', key: key + 1 })}>
              重置
            </Button>
          </div>
        )}
        <div className="list">
          {list.map((item, i) => (
            <div className="item" key={i}>
              <ProjectCard key={`ProjectCard${i}`} projectInfo={item} to={item.projectId} />
            </div>
          ))}
        </div>
      </div>
    );
  }
}
