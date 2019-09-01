import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import classNames from 'classnames';
import { Card, Avatar, Icon } from 'antd';
import styles from './index.less';
const { Meta } = Card;

class ProjectCard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  jumpTo = to => {
    if (to) {
      router.push(`/project/${to}`);
    }
  };

  render() {
    const { projectInfo, to } = this.props;

    return (
      <Card
        hoverable
        className={styles.card}
        cover={
          <div className="img">
            <span>{projectInfo.name.substring(0, 1)}</span>
            <div className="image">
              <img src={projectInfo.pictureUrl[0]} />
            </div>
          </div>
        }
        onClick={() => {
          this.jumpTo(to);
        }}
      >
        <Icon className={classNames('pushpin', { active: !!projectInfo.starFlag })} type="pushpin" theme="filled" />
        <Meta title={projectInfo.name} description={projectInfo.remark} />
        <div className={styles.bottominfo}>
          <span>{projectInfo.createDate.split(' ')[0]}</span>
          <div>
            {projectInfo.memberList.map((item, i) => (
              <Avatar key={`Avatar${i}`} src={item.avatarUrl} />
            ))}
          </div>
        </div>
      </Card>
    );
  }
}

export default ProjectCard;
