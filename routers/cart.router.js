const express = require('express')
const { Router } = express
const router = new Router()
const Cart = require('../dao/models/modelCart')

router.get('/:cid', async (req, res) => {
    let {cid} = req.params
    try {
        let cart = await Cart.find({_id: cid})
        if(cart.length > 0){
            res.status(200).send({status: 'success', payload: cart})
        }else return res.status(204).send({status: 'error', error: 'No existen el cart en la base de datos'})
    }catch(err) {
        console.log('No es posible obtener el cart con mongoose' + err)
        res.send({status: 'error', error: 'No es posible obtener el cart con mongoose'})
    }
})

router.post('/newcart', async (req, res) => {
    try{
        let cartCreatedResult = await Cart.create({
            products: []
        })
        res.status(200).send({status: 'success', payload: cartCreatedResult})
    }catch(err) {
        console.log('No es posible crear el cart con mongoose ' + err)
        res.status(500).send({status: 'error', error: 'No es posible crear el cart con mongoose'})
    }
})

router.post('/:cid/product/:pid', async (req, res) => {
    let {cid, pid} = req.params
    let {qty} = req.body
    try {
        let foundCart = await Cart.findOne({_id: cid})
        console.log(foundCart)
        let foundProduct = foundCart.products.find(product => product._id === pid)
        console.log(foundProduct)
        if(foundProduct) {
            let updatedCartResult = await Cart.updateOne({_id: cid, 'products._id': pid}, {$set: {'products.$.qty': qty}})
            res.status(200).send({status: 'success', payload: updatedCartResult})
        }else {
            let updatedCartResult = await Cart.updateOne({_id: cid}, {$push: {products: {_id: pid, qty: qty}}})
            res.status(200).send({status: 'success', payload: updatedCartResult})
        }
    }catch(err) {
        console.log('No es posible actualizar el cart con mongoose ' + err)
        res.status(500).send({status: 'error', error: 'No es posible actualizar el cart con mongoose'})
    }
})

router.post('/:cid/delproduct/:pid', async (req, res) => {
    let {cid, pid} = req.params
    try {
        let foundCart = await Cart.findOne({_id: cid})
        let foundProduct = foundCart.products.find(product => product._id === pid)
        if(foundProduct) {
            let updatedCartResult = await Cart.updateOne({_id: cid}, {$pull: {products: {_id: pid}}})
            res.status(200).send({status: 'success', payload: updatedCartResult})
        }
    }catch(err) {
        console.log('No es posible borrar el producto medante mongoose ' + err)
        res.status(500).send({status: 'error', error: 'No es posible borrar el producto mediante mongoose'})
    }
})

router.delete('/delcart/:cid', async (req, res) => {
    let {cid} = req.params
    try {
        let deletedCartResult = await Cart.deleteOne({_id: cid})
        res.status(200).send({status: 'success', payload: deletedCartResult})
    }catch(err) {
        console.log('No es posible borrar el cart con mongoose '+ err)
        res.status(500).send({status: 'error', error: 'No es posible borrar el cart mediante mongoose'})
    }
})

module.exports = router