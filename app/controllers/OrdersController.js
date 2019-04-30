const express = require('express')
const _ = require('lodash')
const router = express.Router()
const {Order} = require('../models/Order')
const {authenticateUser} = require('../middlewares/authentication')
const {authorizeUser} = require('../middlewares/authorization')


router.get('/',authenticateUser,function(req,res){
    Order.findOrderByRole(req.user)
        .then(function(orders){
            res.send(orders)
        })
        .catch(function(err){
            res.send(err)
        })
})

router.post('/',authenticateUser,function(req,res){
    const body = _.pick(req.body,['user','address','total','status','orderLineItems'])
    const order = new Order(body)
    order.save()
        .then(function(order){
            res.send({
                order,
                notice: 'Order placed successfully'
            })
        })
        .catch(function(err){
            res.send(err)
        })
})

router.put('/:id',authenticateUser,authorizeUser,function(req,res){
    const body =  _.pick(req.body,['address','orderLineItems','total'])
    Order.findByIdAndUpdate(req.params.id,body,{new:true})
        .then(function(order){
            res.send({
                order,
                notice : 'Order updated successfully' 
            })
        })
        .catch(function(err){
            res.send(err)
        })
})

router.delete('/',authenticateUser,authorizeUser,function(req,res){
    Order.findOrderByRoleAndDelete(req.user,req.params.id)
        .then(function(order){
            res.send({
                order,
                notice:'Order deleted successfully'
            })
        })
        .catch(function(err){
            res.send(err)
        })
})

module.exports = {
    ordersRouter : router
}