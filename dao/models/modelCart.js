const mongoose = require('mongoose')
const cartProductSchema = new mongoose.Schema({
    _id: {
        type: String
    },
    qty: {
        type: Number
    }
})
const cartSchema = new mongoose.Schema({
    products: [cartProductSchema]
})

const Cart = mongoose.model('Cart', cartSchema)

module.exports = Cart
