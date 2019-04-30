const express = require('express')
const _ = require('lodash')
const router = express.Router()
const {Category} = require('../models/Category')
const { authenticateUser } = require('../middlewares/authentication')
const { authorizeUser } = require('../middlewares/authorization')


router.get('/',authenticateUser,function(req,res){
    Category.find()
        .populate('products')
        .then(function(categories){
            res.send(categories)
        })
        .catch(function(err){
            res.send(err)
        })
})

router.post('/',authenticateUser,authorizeUser,function(req,res){
    const body = _.pick(req.body,['name'])
    const category = new Category(body)
    if(req.user.roles.includes('moderator') || req.user.roles.includes('admin')){
        category.save()
        .then(function(category){
            res.send(category)
        })
        .catch(function(err){
            res.send(err)
        })
    }
    else{
        res.send('This page does not exist')
    }
})

router.put('/:id',authenticateUser,authorizeUser,function(req,res){
    const {id} = req.params
    const body = _.pick(req.body,['name'])
    if(req.user.roles.includes('moderator') || req.user.roles.includes('admin') ){
    Category.findByIdAndUpdate(id, body,{new: true} )
        .then(function(category){
            res.send(category)
        })
        .catch(function(err){
            res.send(err)
        })
    }
    else{
        res.send('This page does not exist')
    }
})

router.delete('/:id',authenticateUser,authorizeUser,function(req,res){
    const {id} = req.params
    if(req.user.roles.includes('admin')){
        Category.findByIdAndDelete(id)
        .then(function(category){
            res.send({
                category,
                notice:'Category is deleted'
            })
        })
        .catch(function(err){
            res.send(err)
        })
    }
    else{
        res.send('This page does not exist')
    }
   
})

module.exports = {
    categoriesRouter : router
}