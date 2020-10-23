const express = require('express');
const Product = require('../models/product')
const router = new express.Router();
const Auth = require('../middlewares/Auth')
const User = require('../models/user')


// product send to database using '/add_new_product' page in website
router.post('/product_send_to_database', (req,res)=>{
    const product = new Product(req.body)

    product.save()
    .then( () => {
        res.send(product)
    })
    .catch( (e) => {
        res.send(`error occured such : ${e}`)
    })
})

// all products come to the website from database for productList
router.get('/', (req, res) => {
    Product.find({})
    .then( products => {
        res.send(products)
    })
    .catch( (e) =>{
        res.send(`error occured such : ${e} `)
    })
})

// wanted product deleted from database
router.post('/product/delete', (req, res) => {
    Product.deleteOne(req.body)
    .then(()=> {
        console.log('item removed!')
    })
    .catch( (e) =>{
        res.send(`error occured such : ${e}`)
    })
})

// edit wanted product in the database
router.patch('/product/edit', Auth, (req, res) => {
    Product.findByIdAndUpdate(req.body._id ,req.body)
    .then( () => console.log(res.body))
    .catch( (e) => {
        console.log(`error occured such : ${e}`)
    })
})

// add mutliple items to the database 
router.post('/add_multiple_items', ( req, res )=>{
        var itemsHere = req.body
        itemsHere.forEach(element => {
            var product = new Product(element)

            product.save()
            .then( () => {
                console.log('product saved such : ', product)
            })
            .catch((e)=>{
                console.log('error occured such: ', e)
            })
        });
})







module.exports = router