const express = require('express')
const _ = require('lodash')
const router = express.Router()
const {Product} = require('../models/Product')
const { authenticateUser } = require('../middlewares/authentication')
const { authorizeUser } = require('../middlewares/authorization')

router.get('/',function(req,res){
    Product.find()
        .populate('category')
        // .exec((err,data) => {
        //     if(err) return handleError(err)
        //     console.log(data)
        //     res.send()
        // })
        .then(function(products){
            res.send(products)
        })  
        .catch(function(err){
            res.send(err)
        })
})

module.exports = {
    productsRouter : router
}