const { observable, toJS } = require('mobx');
const shortid = require('shortid')

const Conversations = require('./conversations')

module.exports = class Users {

    constructor(io) {

        this.io = io;
        this.users = observable([])
        this.conversations = new Conversations(io)

        this.io.on('connection', (socket) => {

            socket.on('login', username => this.login(socket, username));
            socket.on('disconnect', () => this.disconnect(socket.id));
            socket.on('message', (data) => this.conversations.handleMessage(this.getUserBySessionId(data.sessionId), data))
        });
    }

    /**
     * Here we check is the username is available
     * @param username
     * @returns {boolean|*}
     */
    usernameIsAvailable(username) {
        return this.users.every((user) => {
            return user.username !== username
        })
    }

    /**
     * Here we check is the session exist on users list
     * @param sessionId
     * @returns {boolean|*}
     */
    sessionExist(sessionId) {
        return this.users.some((user) => {
            return user.sessionId === sessionId
        })
    }

    /**
     * Return a user searched by socket id
     * @param socketId
     * @returns {object|undefined}
     */
    getUserBySocketId(socketId) {
        return this.users.find((user) => {
            return user.socketId === socketId
        })
    }

    /**
     * Return a user searched by session id
     * @param sessionId
     * @returns {object|undefined}
     */
    getUserBySessionId(sessionId) {
        return this.users.find((user) => {
            return user.sessionId === sessionId
        })
    }

    /**
     * Check is the username is available and create the session id if not
     * @param socket
     * @param username
     * @returns {Namespace|Socket|Emitter|*}
     */
    login(socket, username) {

        const isAvailable = this.usernameIsAvailable(username);

        if(!isAvailable) {
            return socket.emit('loginResponse', { isAvailable })
        }

        const user = {
            isAvailable,
            username,
            sessionId: shortid.generate(),
            socketId: socket.id
        }

        this.users.push(user)
        socket.emit('loginResponse', user)
        this.io.emit('userJoinedGeneral', username)
    }

    /**
     * Handle user disconnection
     * @param socketId
     */
    disconnect(socketId) {
        const user = this.getUserBySocketId(socketId);

        if(user) {
            this.io.emit('userLeftGeneral', user.username)
            this.users.remove(user)
        }
    }
}