const mongoose = require('mongoose')
const messageTypeSchema = new mongoose.Schema({type: String})
const messageSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    message: [messageTypeSchema]
})

const Chat = mongoose.model('Chat', messageSchema)

module.exports = Chat