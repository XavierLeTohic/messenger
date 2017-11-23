import Layout from '../index.js'
import { LocaleProvider } from 'antd'
import frFR from 'antd/lib/locale-provider/fr_FR'


export default () => (
    <Layout>
        <LocaleProvider locale={frFR}>
            <h1>Hello world !</h1>
        </LocaleProvider>
    </Layout>
)