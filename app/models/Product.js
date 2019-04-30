const mongoose = require('mongoose')
const multer = require('multer')
const {Category} = require('../models/Category')

const Schema = mongoose.Schema

const productSchema = new Schema({
    name:{
        type : String,
        required : true
    },
    price:{
        type: Number,
        min : 1
    },
    description:{
        type : String
    },
    category:[{
        type : Schema.Types.ObjectId,
        ref:"Category"
    }],
    availableDateTime:{
        type : Date,
        default : Date.now
    },
    codEligible:{
        type : Boolean,
        default:true
    },
    stock:{
        type : Number,
        min:0
    },
    image:{
        type : String
    }
})

// productSchema.statics.findProductId = function(name){
//     const product = this
//     return product.findOne({name})
//         .then(function(product){
//             if(product){
//                 // console.log(product)
//                 return Promise.resolve(product)
               
//             }
//             else{
//                 return Promise.reject('Product not found')
//             }
//         })
//         .catch(function(err){
//             return Promise.reject(err)
//         })
// }

// productSchema.post('save',function(req,res){
//     const product = this 
//     Category.findOne({_id : product.category})
//         .populate('products')
//             .exec()
//             .then(category =>{
//                 if(!category){
//                     return res.send('category not found')
//                 }
//                 res.send(category)
//             })
// })


productSchema.statics.findByRoleAndDelete = function(user,id){
    if(user.roles.includes('admin') ){
        return Product.findByIdAndDelete(id)
            .then(function(product){
                return Promise.resolve(product)
            })
            .catch(function(err){
                return Promise.reject(err)
            })
    }
    else  {
        return Promise.reject({
            notice: 'The page does not exist'
        })
    }
}

const Product = mongoose.model('Product',productSchema)

module.exports = {
    Product
}