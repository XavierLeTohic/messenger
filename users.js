const { observable } = require('mobx');

module.exports = class Users {

    constructor(io) {

        this.io = io;
        this.users = observable([])

        this.io.on('connection', (socket) => {

            // When a user try to login we check if the username is available
            socket.on('login', (username) => {

                const isAvailable = this.usernameIsAvailable(username);
                socket.emit('usernameAvailable', isAvailable)

                if(isAvailable) {
                    this.users.push(username)
                    this.io.emit('userJoinedGeneral', username)
                }

            });
        });
    }

    usernameIsAvailable(username) {
        return this.users.every((name) => {
            return name !== username
        })
    }
}