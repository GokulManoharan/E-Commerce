const mongoose = require('mongoose')

const Schema = mongoose.Schema

const categorySchema = new Schema({
    name:{
        type : String,
        required : true,
        unique : true
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product'
    }]
})

// categorySchema.statics.findCategoryId = function(name){
//     const Category = this
//     return Category.findOne({name})
//         .then(function(category){
//             if(category){
//                 return Promise.resolve(category)
//             }
//             else{
//                 return Promise.reject('Category not found')
//             }
           
//         })
//         .catch(function(err){
//             return Promise.reject(err)
//         })
// }

categorySchema.statics.findByRoleAndDelete = function(user,id){
    if(user.roles.includes('admin') ){
        return Category.findByIdAndDelete(id)
            .then(function(category){
                return Promise.resolve(category)
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

const Category = mongoose.model('Category', categorySchema)

module.exports = {
    Category
}