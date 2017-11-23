const express = require('express');
const next = require('next');
const socketIO = require('socket.io');
const http = require('http');
const bodyParser = require('body-parser');

const dev = process.env.NODE_ENV !== 'production';

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {

    const app = express();
    const server = http.createServer(app);
    const io = socketIO(server);

    app.use(bodyParser.json());

    app.get('*', (req, res) => {
        return handle(req, res)
    })

    server.listen(3000, (err) => {
        if (err) throw err
        console.log('> Ready on http://localhost:3000')
    })
});