import Layout from '../index.js'
import { LocaleProvider } from 'antd'
import frFR from 'antd/lib/locale-provider/fr_FR'
import LoginForm from '../components/LoginForm'


export default () => (
    <Layout>
        <LocaleProvider locale={frFR}>
            <LoginForm />
        </LocaleProvider>
    </Layout>
)