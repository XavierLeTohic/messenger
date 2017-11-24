import { Component } from 'react'
import Router from 'next/router'
import { Form, Icon, Input, Button, message } from 'antd'
import { observable } from 'mobx'
import { observer } from 'mobx-react'
import io from 'socket.io-client'

const FormItem = Form.Item;

@observer
class ConversationInput extends Component {

    // When the user submit de login form
    handleSubmit = (e) => {
        e.preventDefault();

        this.props.form.validateFields((err, values) => {
            if (!err) {
                return this.socket.emit('login', values.username)
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <Form onSubmit={this.handleSubmit}>
                    <FormItem>
                        {getFieldDecorator('message', {
                            rules: [{ required: true, message: 'Please enter a username' }],
                        })(
                            <input type="text" placeholder="Type here !" className="conversationInput"/>
                        )}
                    </FormItem>
                </Form>
                <style jsx global>
                    {`
                        .conversationInput {
                            position: fixed;
                            bottom: 0px;
                            left: 0px;
                            right: 0px;
                            width: 100%;
                            height: 50px;
                            z-index: 99;
                            background: white;
                            border: none;
                            outline: none;
                            padding-left: 55px;
                            padding-right: 55px;
                            color: #666;
                            font-weight: 400;
                        }
                    `}
                </style>
            </div>
        );
    }
}

export default Form.create()(ConversationInput)
