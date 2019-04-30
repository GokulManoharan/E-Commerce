const express = require('express')
const _ = require('lodash')
const router = express.Router() 
const {Category} = require('../models/Category')
const {Product} = require('../models/Product')
const {User} = require('../models/User')
const { authenticateUser } = require('../middlewares/authentication')
const { authorizeUser } = require('../middlewares/authorization')

router.post('/categories',authenticateUser,authorizeUser,function(req,res){
    const body = _.pick(req.body,['name'])
    const category = new Category(body)
    category.save()
        .then(function(category){
            res.send(category)
        })
        .catch(function(err){
            res.send(err)
        })
})

router.put('/categories/:id',authenticateUser,authorizeUser,function(req,res){
    const {id} = req.params
    const body = _.pick(req.body,['name'])
    Category.findByIdAndUpdate(id, body,{new: true} )
        .then(function(category){
            res.send(category)
        })
        .catch(function(err){
            res.send(err)
        })
})

router.delete('/categories/:id',authenticateUser,authorizeUser,function(req,res){
    const {id} = req.params
    Category.findByRoleAndDelete(req.user,id)
        .then(function(category){
            res.send({
                category,
                notice:'Category is deleted'
            })
        })
        .catch(function(err){
            res.send(err)
        })
})

router.post('/products',authenticateUser,authorizeUser,function(req,res){
    const body = _.pick(req.body,['name','price','description','category','availableDateTime','codEligible','stock','image'])
    const product = new Product(body)
    product.save()
       .then(function(product){
           res.send(product)
       })
       .catch(function(err){
           res.send(err)
       })
   
})

router.put('/products/:id',authenticateUser,authorizeUser,function(req,res){
    const {id} = req.params
    const {body} = req
    Product.findByIdAndUpdate(id,body,{new:true})
        .then(function(product){
            res.send({
                product,
                notice:'Update successful'
            })
        })
        .catch(function(err){
            res.send(err)
        })
}) 

router.delete('/products/:id',authenticateUser,authorizeUser,function(req,res){
    const {id} = req.params
    Product.findByRoleAndDelete(req.user,id)
        .then(function(product){
            res.send({
                product,
                notice : 'Product deleted successfully'
            })
        })
        .catch(function(err){
            res.send(err)
        })
})


router.get('/users',authenticateUser,authorizeUser,function(req,res){
    User.find()
        .then(function(users){
            res.send(users)
        })
        .catch(function(err){
            res.send(err)
        })
})

router.post('/users',authenticateUser,authorizeUser,function(req,res){
    const body = _.pick(req.body,['username','password','email','roles','addresses '])
    const user = new User(body)
    user.save()
        .then(function(user){
            res.send({
                user,
                notice: 'registration successful'
            })
        })
        .catch(function(err){
            res.send(err)
        })
})

router.put('/users/:id',authenticateUser,authorizeUser,function(req,res){
    const {id} = req.params
    const body = _.pick(req.body,['username','allowAccess'])
    User.findByRoleAndUpdate(req.user,id, body)
        .then(function(user){   
            res.send({
                user,
                notice:'User record updated succesfully'
            })
        })
        .catch(function(err){
            res.send(err)
        })
})

router.delete('/users/:id',authenticateUser,authorizeUser,function(req,res){
    const {id} = req.params
    User.findByRoleAndDelete(req.user,id)
        .then(function(user){   
            res.send({
                user,
                notice:'User deleted succesfully'
            })
        })
        .catch(function(err){
            res.send(err)
        })
})

module.exports = {
    adminRouter: router
}