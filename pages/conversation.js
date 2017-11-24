import { Component } from 'react'
import { LocaleProvider, message } from 'antd'
import { observable } from 'mobx'
import { observer } from 'mobx-react'
import io from 'socket.io-client'
import frFR from 'antd/lib/locale-provider/fr_FR'
import 'isomorphic-fetch'

import Layout from '../index'
import ConversationInput from '../components/ConversationInput'


@observer
class Conversation extends Component {

    static async getInitialProps(context) {

        const isServer = !!context.req;

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
            }
        } else if(isServer && typeof context.req.cookies.sessionId !== 'undefined') {
            // No session cookie, redirecting the user to login page
            context.res.redirect('/')
        }

        return {}
    }

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
