const mongoose = require('mongoose')
const validator = require('validator')
const bcryptjs = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const credentials = require('../../config/mail-credentials')

const Schema = mongoose.Schema

const userSchema = new Schema({
    username:{
        type : String,
        required : true,
        unique : true
    },
    email:{
        type : String,
        required : true,
        unique : true,
        validate: {
            validator: function (value) {
                return validator.isEmail(value)
            },
            message: function () {
                return 'Invalid email format'
            }
        }

    },
    password:{
        type: String,
        required: true,
        minlength: 6,
        maxlength: 128
    },
    roles: {
        type: [String],
        default: 'customer'
    },
    addresses : [{
        city: String, 
        postal: String,
        landmark: String 
    }],
    cartLineItems : [{
        product:{
            type: Schema.Types.ObjectId
        },       
        quantity: Number
    }],
    wishlists : [{ 
        product:{
            type: Schema.Types.ObjectId
        }
    }],
    tokens: [
        {
            token: {
                type: String
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ], 
    allowAccess:{
        type : Boolean,
        default : true
    }
   })

//    const findUsernameOrEmail = (usernameOrEmail) => {
//         if(usernameOrEmail)
//    }

   userSchema.statics.findByCredentials = function (usernameOrEmail, password) {
    const User = this
    if(validator.isEmail(usernameOrEmail)){
        return User.findOne({ email:usernameOrEmail })
        .then(function (user) {
            if (!user) {
                return Promise.reject('invalid email / password')
            }
            else if(!user.allowAccess)
            {
                return Promise.reject({
                    notice:'User is not allowed to login'
                })
            }
            return bcryptjs.compare(password, user.password)
                .then(function (result) {
                    if (result) {
                        return Promise.resolve(user)
                        // return new Promise(function(resolve, reject){
                        //     resolve(user)
                        // })
                    } else {
                        return Promise.reject('invalid email / password ')
                    }
                })
        })
        .catch(function (err) {
            return Promise.reject(err)
            // return new Promise(function(resolve, reject){
            //  reject(err) 
            // })
        })
    }
    else{
        return User.findOne({ username:usernameOrEmail })
        .then(function (user) {
            if (!user) {
                return Promise.reject('invalid email / password')
            }
            else if(!user.allowAccess)
            {
                return Promise.reject({
                    notice:'User is not allowed to login'
                })
            }
            return bcryptjs.compare(password, user.password)
                .then(function (result) {
                    if (result) {
                        return Promise.resolve(user)
                        // return new Promise(function(resolve, reject){
                        //     resolve(user)
                        // })
                    } else {
                        return Promise.reject('invalid email / password ')
                    }
                })
        })
        .catch(function (err) {
            return Promise.reject(err)
            // return new Promise(function(resolve, reject){
            //  reject(err) 
            // })
        })
    }
    
}

userSchema.statics.findByToken = function (token) {
    const User = this
    let tokenData
    try {
        tokenData = jwt.verify(token, 'jwt@123')
    } catch (err) {
        return Promise.reject(err)
    }

    return User.findOne({
        _id: tokenData._id,
        'tokens.token': token
    })
}

// own instance methods
userSchema.methods.generateToken = function () {
    const user = this
    const tokenData = {
        _id: user._id,
        username: user.username,
        createdAt: Number(new Date())
    }

    const token = jwt.sign(tokenData, 'jwt@123')
    user.tokens.push({
        token
    })

    return user.save()
        .then(function (user) {
            return Promise.resolve(token)
        })
        .catch(function (err) {
            return Promise.reject(err)
        })
}

userSchema.statics.findByRoleAndUpdate = function(user,id,body){

    if(user.roles.includes('admin') ){
       return User.findByIdAndUpdate(id, body,{new: true} )
       .then(function(user){   
           return Promise.resolve(user)
       })
       .catch(function(err){
           return Promise.reject(err)
       })
    }
    else {
        return Promise.reject({
            notice: 'The page does not exist'
        })
    }
}

userSchema.statics.findByRoleAndDelete = function(user,id){

    if(user.roles.includes('admin') ){
       return User.findByIdAndDelete(id)
         .then(function(user){   
            return Promise.resolve(user)
       })
          .catch(function(err){
            return Promise.reject(err)
       })
    }
    else {
        return Promise.reject({
            notice: 'The page does not exist'
        })
    }
}

userSchema.pre('save',function(next){
    const user = this
    if(user.isNew){
        function encryptPassword() {
            return bcryptjs.genSalt(10)
                .then(function (salt) {
                    return bcryptjs.hash(user.password, salt)
                        .then(function (encryptedPassword) {
                            user.password = encryptedPassword
                        })
                })
            }
    
            function setRole() {
                return User.countDocuments()
                    .then(function(count){
                        if(count==0){
                            user.roles = ['admin','customer']
                        }
                    })
                }
                
            return Promise.all([encryptPassword(), setRole()])
                .then(function(values){
                     next()
                })
                .catch(function(err){
                    return Promise.reject(err.message)
                })
    }
    else {
        next()
    }
})

userSchema.post('save',function(){
    const user = this
    let transporter = nodemailer.createTransport({
        service: credentials.service,
        secure: false,
        port: 25,
        auth:{
            user : credentials.email,
            pass : credentials.password
        },
        tls:{
            rejectUnauthorized:false
        }
    })
    
    let mailOptions = {
        from : credentials.email,
        to: user.email,
        subject:`Welcome ${user.username}`,
        text:`Hi ${user.username}. Thanks for registering with our website.`
        }
    
    transporter.sendMail(mailOptions,function(error,info){
        if(error){
             console.log('error',error)
        }
        else{    
        }
    })
})

const User = mongoose.model('User', userSchema)

module.exports = {
       User
   }