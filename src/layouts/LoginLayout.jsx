import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, Icon, Input, Button, Checkbox, Tabs } from 'antd'
import defaultSettings from '../../config/defaultSettings';
import axios from '@/utils/axios';
import styles from './Layout.less';

const FormItem = Form.Item;
const TabsTabPane = Tabs.TabPane;

@connect(({ login, userInfo }) => ({
  login, userInfo
}))
@Form.create()
class LoginLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  // 切换tab页面
  changeTab = (key) => {
    if (key === '2') {
      setTimeout(() => {
        const wx = new WxLogin({
          id: 'qrCode',
          appid: 'wx44d1872f2e508d50',
          scope: 'snsapi_login',
          redirect_uri: encodeURIComponent('http://easyaction.cn/weixin/easyaction/publicNumber/wxLoginAuth')
        })
        return wx
      }, 100)
    }
  }

  // 提交登陆
  handleSubmit = (e) => {
    e.preventDefault()
    const { form, dispatch } = this.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      // 以下写死调用
      // axios.defaults.headers.token = 'b2f8491f52e54c8d9a0ba53c4f00b056'
      // window.localStorage.setItem('token', 'b2f8491f52e54c8d9a0ba53c4f00b056');
      // window.localStorage.setItem('userName', values.name);
      // dispatch(routerRedux.replace('/list'));
      // return false
      // ----
      dispatch({
        type: 'login/UserLogin',
        payload: {
          appId: 2,
          loginName: values.name,
          password: values.password,
        },
        callback: (res) => {
          if (res.code === 0) {
            dispatch(routerRedux.replace('/list'));
            dispatch({
              type: 'userInfo/saveCurrentUser',
              payload: {
                userName: values.name
              }
            })
            // axios.defaults.headers.token = res.data.token;
            window.localStorage.setItem('token', res.data.token);
            window.localStorage.setItem('userName', values.name);
          }
        }
      });
    })
  }

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;

    return (
      <div className={styles.loginContainer}>
        <h1 className={styles.name}>{defaultSettings.title}</h1>
        <Tabs defaultActiveKey='1' onChange={this.changeTab}>
          <TabsTabPane tab='账号密码登录' key='1'>
            <Form onSubmit={this.handleSubmit} className={styles.loginForm}>
              <FormItem hasFeedback>
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: '请输入用户名!' }]
                })(
                  <Input size='large' prefix={<Icon type='user' />} placeholder='用户名' />
                )}
              </FormItem>
              <FormItem hasFeedback>
                {getFieldDecorator('password', {
                  rules: [{ required: true, message: '请输入密码!' }]
                })(
                  <Input size='large' prefix={<Icon type='lock' />} type='password' placeholder='密码' />
                )}
              </FormItem>
              <FormItem className='remember'>
                {getFieldDecorator('remember', {
                  valuePropName: 'checked',
                  initialValue: true
                })(
                  <Checkbox>记住我</Checkbox>
                )}
              </FormItem>
              <FormItem>
                <Button type='primary' size='large' block htmlType='submit'>登录</Button>
              </FormItem>
            </Form>
          </TabsTabPane>
          <TabsTabPane tab='微信登录' key='2'>
            <div id='qrCode' />
          </TabsTabPane>
        </Tabs>
      </div>
    )
  }
}

export default LoginLayout;
