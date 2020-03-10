import React from 'react';
import { connect } from 'dva';
import styles from './index.less';
import router from 'umi/router';
import classNames from 'classnames';
import { Card, Steps, Form, Button, Upload, message, Icon, Input, Select, DatePicker } from 'antd';

const step1FormLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
    md: { span: 4 },
    lg: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
    md: { span: 20 },
    lg: { span: 18 },
  },
};
const step2FormLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
    md: { span: 4 },
    lg: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
    md: { span: 20 },
    lg: { span: 20 },
  },
};
const productionId = ['一', '二', '三', '四', '五', '六', '七', '八', '九'];
const productionName = ['A组', 'B组', 'C组', 'D组', 'E组', 'F组', 'G组'];
const productionType = ['文戏组', '动作组', '航拍组', 'VFX组'];
@connect(({ projectList }) => ({ projectList }))
@Form.create()
export default class ProjectList extends React.Component {
  constructor(props) {
    super(props);
    this.file = null;
    this.id = null;
    this.state = {
      step: 0,
      productions: [0],
      project: {},
      loading: false,
      previewImage: null,
      imageUploadError: false,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'projectList/getProjectsAllTypes',
    });
    dispatch({
      type: 'projectList/getProjectsAllDepartments',
    });
  }

  beforeUpload(file) {
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片不可大于2MB');
    }
    if (isLt2M) {
      this.file = file;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => this.setState({ previewImage: reader.result });
    }
    if (this.id) this.uploadFile();
    return false;
  }

  uploadFile(cb) {
    const { dispatch } = this.props;
    const { project = {} } = this.state;
    if (!this.file) return;
    dispatch({
      type: 'basicLayout/uploadPhoto',
      payload: { id: this.id },
      file: this.file,
      success: res => {
        this.editProject({ projectId: this.id, name: project.name, pictureUrl: res.pictureUrl });
        cb();
      },
      fail: err => {
        this.setState({ imageUploadError: true });
        cb();
      },
    });
  }

  editProject(values) {
    const { dispatch } = this.props;
    dispatch({
      type: 'projectList/editProject',
      payload: values,
      success: data => {
        this.setState({ project: data, imageUploadError: false });
      },
      fail: err => {},
    });
  }

  next() {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { step } = this.state;
        this.setState({ step: step + 1, loading: false });
      }
    });
  }

  prev() {
    const { step } = this.state;
    this.setState({ step: step - 1 });
  }

  addProduction() {
    const { productions = [] } = this.state;
    productions.push(productions.length);
    this.setState({ productions });
  }

  minusProduction(index) {
    const { productions } = this.state;
    const data = this.props.form.getFieldsValue();
    data.productions.splice(index, 1);
    this.props.form.setFieldsValue(data);
    productions.splice(index, 1);
    this.setState({ productions });
  }

  submit() {
    const { dispatch } = this.props;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (values.productions) {
          values.productions = values.productions.map(item => {
            item.openDate = item.date[0].format('YYYY-MM-DD');
            item.endDate = item.date[1].format('YYYY-MM-DD');
            return item;
          });
        }
        this.setState({ loading: true });
        dispatch({
          type: 'projectList/addProject',
          payload: values,
          success: data => {
            this.id = data.projectId;
            this.setState({ project: data });
            this.uploadFile(() => {
              this.next();
            });
          },
          fail: err => {},
        });
      }
    });
  }

  render() {
    const { step } = this.state;
    return (
      <Card className={styles.create}>
        <div className="steps">
          <Steps size="small" current={step}>
            <Steps.Step title="填写项目信息" />
            <Steps.Step title="部门与组" />
            <Steps.Step title="完成" />
          </Steps>
        </div>
        {this.renderStep0()}
        {this.renderStep1()}
        {this.renderStep2()}
      </Card>
    );
  }

  renderStep0() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const {
      projectList: { projectTypesData },
    } = this.props;
    const { step, previewImage } = this.state;
    return (
      <div className={classNames('body', 'step-0', { show: step == 0 })}>
        <div className="layout">
          <div className="upload">
            {previewImage ? (
              <img src={previewImage} />
            ) : (
              <Upload.Dragger className="upload" showUploadList={false} beforeUpload={file => this.beforeUpload(file)}>
                <p className="ant-upload-text">
                  <Icon type="plus" />
                </p>
                <p className="ant-upload-text">上传照片</p>
              </Upload.Dragger>
            )}
          </div>
          <div className="form">
            <Form {...step1FormLayout}>
              <Form.Item label="项目类型">
                {getFieldDecorator('projectType', {
                  rules: [
                    {
                      required: true,
                      message: '请选择项目类型',
                    },
                  ],
                })(
                  <Select>
                    {projectTypesData.map(type => {
                      return <Select.Option key={type.type_id}>{type.type_name}</Select.Option>;
                    })}
                  </Select>,
                )}
              </Form.Item>
              <Form.Item label="项目名称">
                {getFieldDecorator('name', {
                  rules: [
                    {
                      required: true,
                      message: '请输入项目名称',
                    },
                  ],
                })(<Input />)}
              </Form.Item>
              <Form.Item label="项目概述">{getFieldDecorator('remark', {})(<Input.TextArea rows={3} />)}</Form.Item>
            </Form>
          </div>
        </div>
        <div className="btns">
          <Button>取消</Button>
          <Button type="primary" onClick={() => this.next()}>
            下一步
          </Button>
        </div>
      </div>
    );
  }

  renderStep1() {
    const { productions } = this.state;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const {
      projectList: { projectDepartmentsData },
    } = this.props;
    const { step, loading } = this.state;
    const selectMap = {};
    productions.forEach(index => {
      selectMap[getFieldValue(`productions[${index}].productionName`)] = index;
    });
    return (
      <div className={classNames('body', 'step-1', { show: step == 1 })}>
        <div className="layout">
          <div className="form">
            <Form className="step2-1" {...step2FormLayout}>
              <Form.Item label="我的部门" extra="选择本人所在的部门">
                {getFieldDecorator('departId', {
                  rules: [
                    {
                      required: true,
                      message: '请选择部门',
                    },
                  ],
                  hidden: step != 1,
                })(
                  <Select>
                    {projectDepartmentsData.map(type => {
                      return <Select.Option key={type.id}>{type.name}</Select.Option>;
                    })}
                  </Select>,
                )}
              </Form.Item>
            </Form>
            {productions.map(index => {
              return (
                <Form key={index} className="step2-2" {...step2FormLayout}>
                  <Form.Item label={`第${productionId[index]}摄制组`}>
                    {getFieldDecorator(`productions[${index}].productionName`, {
                      rules: [
                        {
                          required: true,
                          message: '请选择摄制组',
                        },
                      ],
                      hidden: step != 1,
                    })(
                      <Select>
                        {productionName.map(name => {
                          return (
                            <Select.Option disabled={selectMap[name] >= 0 && selectMap[name] !== index} key={name}>
                              {name}
                            </Select.Option>
                          );
                        })}
                      </Select>,
                    )}
                    {index > 0 && (
                      <Icon className="minus-product" type="minus-circle" onClick={() => this.minusProduction(index)} />
                    )}
                  </Form.Item>
                  <Form.Item label="组类型">
                    {getFieldDecorator(`productions[${index}].productionType`, {
                      rules: [
                        {
                          required: true,
                          message: '请选择组类型',
                        },
                      ],
                      hidden: step != 1,
                    })(
                      <Select>
                        {productionType.map(name => {
                          return <Select.Option key={name}>{name}</Select.Option>;
                        })}
                      </Select>,
                    )}
                  </Form.Item>
                  <Form.Item label="拍摄日期">
                    {getFieldDecorator(`productions[${index}].date`, {
                      rules: [
                        {
                          required: true,
                          message: '请选择拍摄日期',
                        },
                      ],
                      hidden: step != 1,
                    })(<DatePicker.RangePicker />)}
                  </Form.Item>
                </Form>
              );
            })}
            <Form className="step2-3" {...step2FormLayout}>
              <Form.Item label="添加组">
                <Icon type="plus-circle" onClick={() => this.addProduction()} />
                如有第二摄制组可继续添加
              </Form.Item>
            </Form>
          </div>
          <div className="btns">
            <Button onClick={() => this.prev()}>上一步</Button>
            <Button loading={loading} type="primary" onClick={() => this.submit()}>
              完成
            </Button>
          </div>
        </div>
      </div>
    );
  }

  renderStep2() {
    const { project, imageUploadError } = this.state;
    const {
      projectList: { projectDepartmentsData },
    } = this.props;
    const departmentMap = {};
    projectDepartmentsData.forEach(d => {
      departmentMap[d.id] = d.name;
    });
    const { step } = this.state;
    return (
      <div className={classNames('body', 'step-2', { show: step == 2 })}>
        <div className="info">
          <div className="icon">
            <Icon type="check-circle" theme="filled" />
            <div className="text">创建成功</div>
          </div>
          <div className="detail">
            <div className="upload">
              {project.pictureUrl && project.pictureUrl[0] ? (
                <img src={project.pictureUrl[0]} />
              ) : (
                <Upload.Dragger
                  className="upload"
                  showUploadList={false}
                  beforeUpload={file => this.beforeUpload(file)}
                >
                  <p className="ant-upload-text">
                    <Icon type="plus" />
                  </p>
                  <p className="ant-upload-text">上传照片</p>
                  {!imageUploadError && <p className="empty">无图片</p>}
                  {imageUploadError && <p className="error">图片上传失败,请重新上传</p>}
                </Upload.Dragger>
              )}
            </div>
            <div className="desc">
              <div className="t">
                项目名称: <span>《{project.name}》</span>
              </div>
              <div className="t">所在部门: {departmentMap[project.departId]}</div>
              {project.productions &&
                project.productions.map((item, index) => {
                  return (
                    <div className="text" key={index}>
                      {item.productionName}:<span>{item.productionType}</span>
                      <span>
                        {item.openDate} ~ {item.endDate}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
        <div className="btns">
          <Button onClick={() => router.push(`/`)}>返回首页</Button>
          <Button type="primary" onClick={() => router.push(`/project/${project.projectId}`)}>
            进入项目
          </Button>
        </div>
      </div>
    );
  }
}
