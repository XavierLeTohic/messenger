const { observable } = require('mobx');
const shortid = require('shortid')

module.exports = class Users {

    constructor(io) {

        this.io = io;
        this.users = observable([])

        this.io.on('connection', (socket) => {

            // When a user try to login we check if the username is available
            socket.on('login', (username) => {

                const isAvailable = this.usernameIsAvailable(username);

                if(!isAvailable) {
                    return socket.emit('loginResponse', { isAvailable })
                }

                const user = {
                    isAvailable,
                    username,
                    sessionId: shortid.generate()
                }

                this.users.push(user)
                socket.emit('loginResponse', user)
                this.io.emit('userJoinedGeneral', username)

            });
        });
    }

    /**
     * Here we check is the username is available
     * @param username
     * @returns {boolean|*}
     */
    usernameIsAvailable(username) {
        return this.users.every((user) => {
            return user.name !== username
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
}