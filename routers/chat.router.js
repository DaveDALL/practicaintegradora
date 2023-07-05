const express = require('express')
const { Router } = express
const Chat = require('../dao/models/modelCart')


function customerChat(io) {
    const router = new Router()

    router.get('/', async (req, res) => {
        let allMessages = []
        let chatUser = ''
        io.on('connection', async (socket) => {
            console.log('nuevo usuario conectado')
            socket.on('chatMessage', async (data) => {
                if(allMessages.length > 0) {
                    console.log(data)
                    allMessages.push(data)
                    socket.emit('allMessages', allMessages)
                } else chatUser = data.user
            })
            
        })
        try {
            await Chat.create({user: chatUser, message: allMessages})

        }catch(err) {
            console.log('Error al crear el chat en mongoose ' + err)
        }
        res.render('chat', {})
    })
    return router
}



module.exports = customerChat