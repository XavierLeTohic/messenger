import { Component } from 'react'
import Router from 'next/router'
import { Form, Icon, Input, Button, message } from 'antd'
import { observable } from 'mobx'
import { observer } from 'mobx-react'
import io from 'socket.io-client'

const FormItem = Form.Item;

@observer
class LoginForm extends Component {
    @observable loading = false

    // Listening for login response when component displaying
    componentDidMount () {
        this.socket = io();

        // Checking is the username is available
        this.socket.on('usernameAvailable', (isAvailable) => {
            if(!isAvailable) {
                this.loading = false;
                return message.error('This username is not available')
            }

            Router.push('/conversation')
        });
    }

    // Stop listening for login response when the component will be unmount
    componentWillUnmount () {
        this.socket.off('usernameAvailable');
    }

    // When the user submit de login form
    handleSubmit = (e) => {
        e.preventDefault();
        this.loading = true;

        this.props.form.validateFields((err, values) => {
            if (!err) {
                return this.socket.emit('login', values.username)
            }
            this.loading = false;
        });
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="container">
                <div
                    className="row middle-xs center-xs"
                    style={{
                        minHeight: '100vh'
                    }}
                >
                    <div
                        style={{
                            maxWidth: 500
                        }}
                    >
                        <h1>Join the conversation !</h1>
                        <Form onSubmit={this.handleSubmit} className="login-form">
                            <FormItem>
                                {getFieldDecorator('username', {
                                    rules: [{ required: true, message: 'Please enter a username' }],
                                })(
                                    <Input
                                        prefix={<Icon type="user" style={{ fontSize: 13 }} />}
                                        placeholder="Username"
                                        size="large"
                                    />
                                )}
                            </FormItem>
                            <FormItem>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    disabled={this.loading}
                                >
                                    Log in
                                </Button>
                            </FormItem>
                        </Form>
                    </div>
                </div>
                <style jsx>
                    {`
                        h1 {
                            margin-bottom: 20px;
                        }
                    `}
                </style>
            </div>
        );
    }
}

export default Form.create()(LoginForm)
