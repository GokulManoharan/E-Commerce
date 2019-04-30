const express = require('express')
const _ = require('lodash')
const router = express.Router()
const {User} = require('../models/User')
const {Product} = require('../models/Product')
const { authenticateUser } = require('../middlewares/authentication')
const { authorizeUser } = require('../middlewares/authorization')


router.post('/register',function(req,res){
    const body = _.pick(req.body,['username','email','password','addresses'])
    const user = new User(body)
    user.save()
        .then(function(user){
             res.send(user)
        })
        .catch(function(err){
             res.send(err)
        })
      
})

router.post('/login', function (req, res) {
    const body = req.body
    User.findByCredentials(body.usernameOrEmail, body.password)
        .then(function (user) {
            return user.generateToken()
        })
        .then(function (token) {
            res.setHeader('x-auth', token).send({})
        })
        .catch(function (err) {
            res.send(err)
        })

})

router.get('/',authenticateUser,function(req,res){
   User.findById(req.user._id)  
        .then(function(user){
            res.send(user)
        })
        .catch(function(err){
            res.send(err)
        })
})

router.post('/cartlineitems',authenticateUser,function(req,res){
    const body = _.pick(req.body,['cartLineItems'])
    body.cartLineItems.forEach(function(cartLineItem,index){
        Product.findProductId(cartLineItem.product)
            .then(function(product){
                cartLineItem.product = product._id
                if(index == body.cartLineItems.length-1){
                    User.findByIdAndUpdate(req.user._id,body,{new:true})
                        .then(function(product){
                            res.send(product)
                        })
                        .catch(function(err){
                            res.send(err)
                        })
                }
            })
            .catch(function(err){
                res.send(err)
            })
    })
})

router.put('/cartlineitems',authenticateUser,function(req,res){
    const body = _.pick(req.body,['cartLineItems'])
    body.cartLineItems.forEach(function(cartLineItem,index){
        Product.findProductId(cartLineItem.product)
            .then(function(product){
                cartLineItem.product = product[0]._id
                if(index == body.cartLineItems.length-1){
                    User.findByIdAndUpdate(req.user._id,body,{new:true})
                        .then(function(product){
                            res.send(product)
                        })
                        .catch(function(err){
                            res.send(err)
                        })
                }
            })
            .catch(function(err){
                res.send(err)
            })
    })
})

router.delete('/cartlineitems',authenticateUser,function(req,res){
    User.findByIdAndUpdate(req.user._id,{cartLineItems:[]},{new:true})
        .then(function(user){
            res.send({
                user,
                notice:'Cart line items are removed successfully'
            })
        })
        .catch(function(err){
            res.send(err)
        })
})


router.get('/wishlists',authenticateUser,function(req,res){
    User.findById(req.user._id)
        .then(function(user){
            res.send(user.wishlists)
        })
        .catch(function(err){
            res.send(err)
        })
})

router.post('/wishlists',authenticateUser,function(req,res){
    const body = _.pick(req.body,['wishlists'])
    body.wishlists.forEach(function(wishlist,index){
        Product.findProductId(wishlist.product)
            .then(function(product){
                wishlist.product = product[0]._id
                req.user.wishlists.push(wishlist)
                if(index == body.wishlists.length-1){
                    User.findByIdAndUpdate(req.user._id,{wishlists:req.user.wishlists},{new:true})
                        .then(function(product){
                            res.send(product)
                        })
                        .catch(function(err){
                            res.send(err)
                        })
                }
            })
            .catch(function(err){
                res.send(err)
            })
    })
})

//remove all wishlist items
router.delete('/wishlists',authenticateUser,function(req,res){
    User.findByIdAndUpdate(req.user._id,{wishlists:[]},{new:true})
        .then(function(user){
            res.send({user,
            notice:'Wishlist item is empty'})
        })
        .catch(function(err){
            res.send(err)
        })
})

router.delete('/wishlists/:id',authenticateUser,function(req,res){
    req.user.wishlists.forEach(function(wishlist,index){
        if(wishlist._id == req.params.id){
            req.user.wishlists.splice(index,1)
            User.findByIdAndUpdate(req.user._id,{wishlists:req.user.wishlists},{new:true})
                        .then(function(user){
                            res.send({
                                user,
                                notice:'Item deleted from the wishlist successfully'
                            })
                        })
                        .catch(function(err){
                            res.send(err)
                        })
        }
        else{
            res.send('Page does not exist')
        }
    })
})

router.post('/addresses',authenticateUser,function(req,res){
    const body = _.pick(req.body,['addresses'])
    req.user.addresses.push(body.addresses)
    User.findByIdAndUpdate(req.user._id,{addresses:req.user.addresses},{new:true})
        .then(function(user){
            res.send({
                user,'notice':'Address added successfully'
            })
        })
        .catch(function(err){
            res.send(err)
        })
})

router.put('/addresses/:id',authenticateUser,function(req,res){
    const body = _.pick(req.body,['addresses'])
    req.users.addresses.forEach(function(address){
        if(address._id == req.params.id){
            findByIdAndUpdate(req.params.id,{addresses:body},{new:true})
        }
    })

})

module.exports = {
    usersRouter : router
}