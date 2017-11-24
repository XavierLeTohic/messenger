import { Component } from 'react'
import { LocaleProvider, message } from 'antd'
import { observable } from 'mobx'
import { observer, Provider } from 'mobx-react'
import shortid from 'shortid'
import io from 'socket.io-client'
import frFR from 'antd/lib/locale-provider/fr_FR'
import Cookies from 'js-cookie'
import 'isomorphic-fetch'

import Layout from '../index'
import ConversationInput from '../components/ConversationInput'
import ConversationMessage from '../components/ConversationMessage'


@observer
class Conversation extends Component {

    @observable messages = []

    static async getInitialProps(context) {

        const isServer = !!context.req;
        let sessionId = null;

        // If we are server-side and a sessionId cookie exist
        if(isServer && typeof context.req.cookies.sessionId !== 'undefined') {

            // Request the server if there is an active session
            const checkSession = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ sessionId: context.req.cookies.sessionId })
            }).then(res => res.json())


            if(checkSession.exist === false) {
                // The session does not exist, redirecting the user to login page
                context.res.redirect('/')
            } else {
                sessionId = context.req.cookies.sessionId
            }
        } else if(isServer && typeof context.req.cookies.sessionId === 'undefined') {
            // No session cookie, redirecting the user to login page
            context.res.redirect('/')
        } else if(!isServer) {

            const session = Cookies.get('sessionId')

            sessionId = session
        }

        return { sessionId }
    }

    constructor(props) {
        super(props);

        console.log(props.sessionId)

        this.sessionId = props.sessionId
    }

    // Listening for message incoming when component displaying
    componentDidMount () {
        this.socket = io();

        this.socket.on('userJoinedGeneral', (username) => {
            this.messages.push({ type: 'system', message: `${username} joined the conversation` })
        });

        this.socket.on('userLeftGeneral', (username) => {
            this.messages.push({ type: 'system', message: `${username} is now disconnected` })
        });

        this.socket.on('messageIncoming', (data) => {
            const { message, username } = data;
            this.messages.push({ type: 'user', message, username })
        })

    }

    render() {
        return (
            <Layout>
                <LocaleProvider locale={frFR}>
                    <Provider sessionId={this.sessionId}>
                        <div>
                            <div className="row center-xs header">
                                <h2>Conversation</h2>
                            </div>

                            <ConversationInput />

                            <div className="container">
                                {this.messages.map((message) => {
                                    return <ConversationMessage message={message} key={shortid.generate()} />
                                })}
                            </div>

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
                    </Provider>
                </LocaleProvider>
            </Layout>
        );
    }
}

export default Conversation
