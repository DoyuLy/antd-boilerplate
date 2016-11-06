import React from 'react'
import {Row, Col, Form, Icon, Input, Button, Checkbox} from 'antd'
import {FormComponentProps, FormComponent} from 'antd/lib/form/Form'
import {browserHistory} from 'react-router'
import FormEvent = __React.FormEvent;
import {login, checkInfo}from '../../utils/session'
import {passwordValidate}from '../../utils/validator'
const FormItem = Form.Item
const style: any = require('./style.scss')

interface LoginForm {
    email: string
    password: string
}
class Login extends FormComponent {
    constructor(props) {
        super(props)
    }

    handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        let {email, password} = this.props.form.getFieldsValue() as LoginForm
        login(email, password)
            .then(() => {
                return checkInfo()
            })
            .then(({id, email, developer, pages, exportLimit}) => {
                // let state = getState()
                // let u = state.router.currentParams.u || state.router.prevState.name || ''
                // if (!u || u === 'signup' || u === 'login' || u === '404' || u === '403' || u === 'forget' || u === 'reset-pwd' || u === 'main') {
                //     // 这里要使用默认逻辑
                //     if (pages.findIndex(p => p.value === 'search') > -1) {
                //         u = 'main'
                //     } else if (pages.findIndex(p => p.value === 'aggregation') > -1) {
                //         u = 'main'
                //     } else if (pages.findIndex(p => p.value.indexOf('action.') > -1 && p.value !== 'action.database' && p.value !== 'action.ttpDetail') > -1) {
                //         u = pages.find(p => p.value.indexOf('action.') > -1 && p.value !== 'action.database' && p.value !== 'action.ttpDetail').value
                //     } else if (pages.findIndex(p => p.value.indexOf('visualize.') === 0) > -1) {
                //         u = pages.find(p => p.value.indexOf('visualize.') === 0).value
                //     } else {
                //         u = 'main'
                //     }
                // }
                // if (pages.findIndex(p => p.value === u) === -1) {
                //     u = 'main'
                // }
                browserHistory.push('/')
            })
            .catch(data => {
            })
    }

    render() {
        const {getFieldDecorator} = this.props.form
        return (
            <div className={style.container}>
                <Row className={style.middle}>
                    <Col span={12} offset={6}>
                        <Form onSubmit={this.handleSubmit}>
                            <FormItem hasFeedback={true}>
                                {getFieldDecorator('email', {
                                    rules: [
                                        {type: 'email'},
                                        {required: true, message: 'Please input your username!'}],
                                })(
                                    <Input addonBefore={<Icon type="user" />} type="email" placeholder="Username"/>
                                )}
                            </FormItem>
                            <FormItem hasFeedback={true}>
                                {getFieldDecorator('password', {
                                    rules: [
                                        {required: true, message: 'Please input your Password!'},
                                        {
                                            type: 'string',
                                            min: 8,
                                            message: 'Password should be no less than 8 characters.'
                                        },
                                        (rule, value, callback, source, options) => {
                                            if (value) {
                                                if (!passwordValidate(value)) {
                                                    callback([new Error('Password is too Simple.')])
                                                }
                                            }
                                        }
                                    ],
                                })(
                                    <Input addonBefore={<Icon type="lock" />} type="password" placeholder="Password"/>
                                )}
                            </FormItem>
                            <FormItem>
                                <a className={style.loginFormForgot}>Forgot password</a>
                                <Button type="primary" htmlType="submit" className={style.loginFormButton}>
                                    Log in
                                </Button>
                                Or <a>register now!</a>
                            </FormItem>
                        </Form>
                    </Col>
                </Row>
            </div>
        )
    }
}
const formLogin = Form.create({})(Login)
export default formLogin
