const mongoose = require('mongoose') 
const express = require('express')
const router = express.Router() 

const Schema = mongoose.Schema 
const userSchema = new Schema({
    username: String,
    posts: [{
      type: Schema.Types.ObjectId,
      ref: 'Post'
    }]
  })
const postSchema = new Schema({
    content: String,
    author: {
      type: Schema.Types.ObjectId,
      ref: 'Usertest'
    }
  })
const Post = mongoose.model('Post', postSchema);
const Usertest = mongoose.model('Usertest', userSchema);

router.post('/usertest',(req,res) => {
  const user = new Usertest(req.body)
  user.save()
    .then(function(user){
      res.send(user)
    })
}) 


module.exports = {
  testRouter : router
}