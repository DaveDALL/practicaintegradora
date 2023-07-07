const socket = io()

socket.on('allMessages', (data) => {
    console.log(data)
    render(data)
})

endChat = document.getElementById('endBtn')
endChat.addEventListener('click', closeConnection = () => {
    socket.disconnect()
})

addMessages = () => {
    const messaging = {
        user: document.getElementById('username').value,
        message: document.getElementById('usermessage').value
    }
    socket.emit('chatMessage', messaging)
    document.getElementById('usermessage').value = ''
    
    return false
}

render = (data) => {
    const html = data.map(element => {
        return (
            `
                <div>
                    <strong>${element.user}</strong> dice <em>${element.message}</em>
                </div>
            `
        )
    }).join(' ')
    
    document.getElementById('box').innerHTML = html
}