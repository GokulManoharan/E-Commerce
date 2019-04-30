const mongoose = require('mongoose')

const Schema = mongoose.Schema

const orderSchema = new Schema({
    // orderNumber : {
    //     type : String
    // },
    orderDate : {
        type : Date,
        default : Date.now
    },
    user : {
        type: Schema.Types.ObjectId,
        ref : 'User'
    },
    address : {
        type : Schema.Types.ObjectId
    },
    total : {
        type : Number
    },
    status : {
        type : String
    },
    orderLineItems : [{ 
        product: Schema.Types.ObjectId,
        quantity : {
            type : Number
        },
        price : {
            type : Number
        }
    }]
})

orderSchema.statics.findOrderByRole = function(user){
    if(user.roles.includes('admin') || user.roles.includes('moderator')){
        return Order.find()
            .then(function(orders){
                 return Promise.resolve(orders)
            })
            .catch(function(err){
                return Promise.reject(err)
            })
    }
    else{
        return Order.findOne({user})
            .then(function(order){
                return Promise.resolve(order)
            })
            .catch(function(err){
                return Promise.reject(err)
            })
    }
}

orderSchema.statics.findOrderByRoleAndDelete = function(user,id){
    if(user.roles.includes('admin')){
        return  Order.findByIdAndDelete(id)
        .then(function(order){
           return Promise.resolve(order)
        })
        .catch(function(err){
            return Promise.reject(err)
        })
    }
    else{
        return Promise.reject('This page does not exist')
    }
}



const Order = mongoose.model('Order',orderSchema)

module.exports = {
    Order
}