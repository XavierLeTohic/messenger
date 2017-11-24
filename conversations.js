const { observable, toJS } = require('mobx');
const shortid = require('shortid')

module.exports = class Conversations {

    constructor(io) {
        this.io = io;
    }

    handleMessage(user, data) {

        console.log(user, data)

        this.io.emit('messageIncoming', {
            type: 'user',
            username: user.username,
            message: data.message
        })
    }
}