const express = require('express')
const router = express.Router() 

const { categoriesRouter } = require('../app/controllers/CategoriesController')
const { productsRouter } = require('../app/controllers/ProductsController')
const { usersRouter } = require('../app/controllers/UsersController')
const { ordersRouter } = require('../app/controllers/OrdersController')
const {adminRouter} = require('../app/controllers/AdminController')


router.use('/categories', categoriesRouter)
router.use('/products', productsRouter)
router.use('/users', usersRouter)
router.use('/orders',ordersRouter)
router.use('/admin',adminRouter)

module.exports = {
    routes: router 
}