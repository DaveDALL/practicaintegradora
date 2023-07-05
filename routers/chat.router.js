const express = require('express')
const { Router } = express
const Chat = require('../dao/models/modelMessage')
const Message = require('../dao/models/modelMessage')


function customerChat(io) {
    const router = new Router()

    router.get('/:chatUser', async (req, res) => {
        let allMessages = []
        let {chatUser} = req.params
        io.on('connection', (socket) => {
            console.log('nuevo usuario conectado')
            socket.on('chatMessage', async (data) => {
                await Message.create({user: chatUser, messages: allMessages})
                console.log(data)
                allMessages.push(data)
                socket.emit('allMessages', allMessages)
                try {
                    await Message.updateOne({user: chatUser, messages: allMessages})
        
                }catch(err) {
                    console.log('Error al crear el chat en mongoose ' + err)
                }
            })
            
        })
        res.render('chat', {})
    })
    return router
}



module.exports = customerChat