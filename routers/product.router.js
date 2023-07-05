const express = require('express')
const { Router } = express
const router = new Router()
const Product = require('../dao/models/modelProduct')

router.get('/', async (req, res) => {
    try {
        let products = await Product.find({})
        if(products.length > 0) {
            res.status(200).send({status: 'success', payload: products})
        }else return res.status(204).send({status: 'error', error: 'No existen productsos en la base de datos'})
    }catch(err) {
        console.log('No es posible obtener productos con mongoose' + err)
        res.send({status: 'error', error: 'No es posible obtener productos con mongoose'})
    }
})

router.get('/:pid', async (req, res) => {
    let {pid} = req.params
    try {
        let foundProduct = await Product.findOne({_id: pid})
        if(foundProduct) {
            res.status(200).send({status: 'success', payload: foundProduct})
        } else return res.status(204).send({status: 'error', error: 'No existe el productso en la base de datos'})
    }catch(err) {
        console.log('No es posible obtener el producto con mongoose' + err)
        res.send({status: 'error', error: 'No es posible obtener el producto con mongoose'})
    }
})

router.post('/newproduct', async (req, res) => {
    try{
        let {code, title, description, thumbnails, price, stock, status, category} = req.body
        if(!code || !title || !description || !thumbnails || !price || !stock || !status || !category)
            return res.send({status: 'error', error: 'Los campos no estan completos'})
        let productCreatedResult = await Product.create({
            code,
            title,
            description,
            thumbnails,
            price,
            stock,
            status,
            category
        })
        res.status(200).send({status: 'success', payload: productCreatedResult})
    }catch(err) {
        console.log('No es posible crear el producto con mongoose ' + err)
        res.status(500).send({status: 'error', error: 'No es posible crear el producto con mongoose'})
    }
})

router.put('/:pid', async (req, res) => {
    let {pid} = req.params
    let productToUpdate = req.body
    try {
        if(!productToUpdate.code || !productToUpdate.title || !productToUpdate.description || !productToUpdate.thumbnails || !productToUpdate.price || !productToUpdate.stock || !productToUpdate.status || !productToUpdate.category)
            return res.send({status: 'error', error: 'Los campos no estan completos'})
        let productUpdatedResult = await Product.updateOne({_id: pid}, productToUpdate)
        res.status(200).send({status:'success', payload: productUpdatedResult})
    }catch(err) {
        console.log('No es posible actualizar el producto con mongoose ' + err)
        res.status(500).send({status: 'error', error: 'No es posible actualizar el producto con mongoose'})
    }
})

router.delete('/:pid', async (req, res) => {
    let {pid} = req.params
    try {
        let productDeletedResult = await Product.deleteOne({_id: pid})
        res.status(200).send({status: 'success', payload: productDeletedResult})
    }catch(err) {
        console.log('No es posible eliminar el producto con mongoose ' + err)
        res.status(500).send({status: 'error', error: 'No es posible eliminar el producto con mongoose'})
    }
})

module.exports = router
