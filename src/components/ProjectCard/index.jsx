import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Card, Avatar } from 'antd';
import styles from './index.less';
const { Meta } = Card;

class ProjectCard extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  jumpTo = (to) => {
    if (to) {
      router.push(`/project/${to}`)
    }
  }

  render() {
    const { projectInfo, to } = this.props;

    return (
      <Card
        hoverable
        className={styles.card}
        cover={<img alt={projectInfo.name} src={projectInfo.pictureUrl[0]} />}
        onClick={() => { this.jumpTo(to) }}
      >
        <Meta title={projectInfo.name} description={projectInfo.remark} />
        <div className={styles.bottominfo}>
          <span>{projectInfo.createDate.split(' ')[0]}</span>
          <div>
            {
              projectInfo.memberList.map((item, i) => (
                <Avatar key={`Avatar${i}`} src={item.avatarUrl} />
              ))
            }
          </div>
        </div>
      </Card>
    )
  }
}

export default ProjectCard;
