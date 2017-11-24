import { Component } from 'react'
import { observable } from 'mobx'
import { observer } from 'mobx-react'
import io from 'socket.io-client'


@observer
export default class ConversationMessage extends Component {

    renderSystemMessage(message) {
        return (
            <div className="row center-xs">
                <div className="col-xs-12 col-md-6">
                    {message}
                </div>
                <style jsx>
                    {`

                    `}
                </style>
            </div>
        );
    }


    render() {

        console.log(this.props.message)
        if(this.props.message.type === 'system') {
            return this.renderSystemMessage(this.props.message.message)
        }

        return (
            <div>
                {this.props.message.username}: {this.props.message.message}
                <style jsx global>
                    {`

                    `}
                </style>
            </div>
        );
    }
}

