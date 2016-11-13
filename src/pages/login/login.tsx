import * as React from 'react'
import { Row, Col, Form, Icon, Input, Button, Checkbox } from 'antd'
import { FormComponentProps, FormComponent } from 'antd/lib/form/Form'
import { browserHistory } from 'react-router'
const FormItem = Form.Item
const style: any = require('./style.scss')

interface LoginForm {
    email: string
    password: string
}
class Login extends React.Component<FormComponentProps, {}>{
    constructor(props) {
        super(props)
    }
    handleSubmit = (e: React.FormEvent<Form>) => {
        e.preventDefault()
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
                                        { type: 'email' },
                                        { required: true, message: 'Please input your username!' }],
                                })(
                                    <Input id="123" addonBefore={<Icon type="user" />} type="email" placeholder="Username" />
                                    )}
                            </FormItem>
                            <FormItem hasFeedback={true}>
                                {getFieldDecorator('password', {
                                    rules: [
                                        { required: true, message: 'Please input your Password!' },
                                        {
                                            type: 'string',
                                            min: 8,
                                            message: 'Password should be no less than 8 characters.'
                                        },
                                        (rule, value, callback, source, options) => {
                                            if (value) {
                                                // if (!passwordValidate(value)) {
                                                //     callback([new Error('Password is too Simple.')])
                                                // }
                                            }
                                        }
                                    ],
                                })(
                                    <Input id="" addonBefore={<Icon type="lock" />} type="password" placeholder="Password" />
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