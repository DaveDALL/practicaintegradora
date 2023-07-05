const mongoose = require('mongoose')
const URL = 'mongodb+srv://manager:CoderHouse92857@clustervirtus.0ez8je4.mongodb.net/ecommerce'


module.exports = {
    connect: () => {
        return mongoose.connect(URL, {}).then(connection => {
            console.log('DataBase connection succesful!!')
        }).catch(err => console.log(err))
    }
}


