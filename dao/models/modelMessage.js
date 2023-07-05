const mongoose = require('mongoose')
const messageTypeSchema = new mongoose.Schema({
    user: {
        type: String
    },
    message: {
        type: String
    }
})
const messageSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    messages: [messageTypeSchema]
})

const Message = mongoose.model('Message', messageSchema)

module.exports = Message