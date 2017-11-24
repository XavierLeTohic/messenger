import { Component } from 'react'
import { LocaleProvider, message } from 'antd'
import { observable } from 'mobx'
import { observer } from 'mobx-react'
import io from 'socket.io-client'
import frFR from 'antd/lib/locale-provider/fr_FR'

import Layout from '../index'
import ConversationInput from '../components/ConversationInput'


@observer
class Conversation extends Component {

    // Listening for message incoming when component displaying
    componentDidMount () {
        this.socket = io();


    }

    // Stop listening for message incoming when the component will be unmount
    componentWillUnmount () {
    }


    render() {
        return (
            <Layout>
                <LocaleProvider locale={frFR}>
                    <div>
                        <div className="row center-xs header">
                            <h2>Conversation</h2>
                        </div>
                        
                        <ConversationInput />

                        <style jsx global>
                            {`
                                body {
                                    background-color: #eaeaea;
                                }

                                .header {
                                    background-color: white;
                                    padding: 10px 20px;
                                }
                            `}
                        </style>
                    </div>
                </LocaleProvider>
            </Layout>
        );
    }
}

export default Conversation
