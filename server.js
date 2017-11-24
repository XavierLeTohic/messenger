const express = require('express');
const next = require('next');
const socketIO = require('socket.io');
const http = require('http');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const users = require('./users');

const dev = process.env.NODE_ENV !== 'production';

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {

    const app = express();
    const server = http.createServer(app);
    const io = socketIO(server);
    const Users = new users(io)

    app.use(bodyParser.json());
    app.use(cookieParser());

    app.post('/login', (req, res) => {

        if(typeof req.body.sessionId === 'undefined') {
            return res.status(403).end();
        }

        return res.jsonp({ exist: Users.sessionExist(req.body.sessionId) })
    })

    app.get('*', (req, res) => {
        return handle(req, res)
    })

    server.listen(3000, (err) => {
        if (err) throw err
        console.log('> Ready on http://localhost:3000')
    })
});