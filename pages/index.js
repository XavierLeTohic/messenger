import { Component } from 'react'
import Layout from '../index.js'
import { LocaleProvider, message } from 'antd'
import { Provider } from 'mobx-react'
import frFR from 'antd/lib/locale-provider/fr_FR'
import LoginForm from '../components/LoginForm'
import 'isomorphic-fetch'

export default class extends Component {

    /**
     * Here we will check is a session exist.
     * If the session has expired we pass a "sessionExpired" props via "return" to be use in componentDidMount.
     * @param context
     * @returns {Promise.<{sessionExpired: boolean}>}
     */
    static async getInitialProps(context) {

        const isServer = !!context.req;
        let sessionExpired = false;
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

            if(checkSession.exist === true) {
                // The session exist, redirecting the user
                sessionId = context.req.cookies.sessionId;
                context.res.redirect('/conversation')
            } else {
                sessionExpired = true
            }
        }

        return { sessionExpired }
    }

    componentDidMount() {
        if(this.props.sessionExpired && typeof window !== 'undefined') {
            message.error('Your session has expired, please login again')
        }
    }

    render() {

        return (
            <Layout>
                <LocaleProvider locale={frFR}>
                    <div>
                        <LoginForm />
                    </div>
                </LocaleProvider>
            </Layout>
        )
    }
}