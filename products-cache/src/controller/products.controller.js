const express = require('express');
const router = express.Router();
const Product  = require('../models/products.model')
const client =  require('../config/redis');


//Get all the products
router.get("",  (req, res) => {
    try {

        client.get("products", async(err, products) => {

            if(err) return res.status(404).send(err);
            
            if(products) return res.status(200).send(JSON.parse(products));
            
            const allProducts =  await Product.find().lean().exec();

            
            client.set("products", JSON.stringify(allProducts));
            
            return res.status(200).send({allProducts})
        })
    } catch (err) {
        res.status(500).send(err)
    }
        // res.send("Hello")
});

//Create new  products

router.post("", async(req, res) => {
    try {
        const product = await Product.create(req.body);
    
        const products = await Product.find().lean().exec();
    
        client.set("products", JSON.stringify(products));
        return res.status(201).send(product);

    } catch (err) {
        res.status(500).send(err.message)
    }
});


//Get a single product using the id

router.get("/:id", (req, res) => {
    try {
        client.get(`products.${req.params.id}`, async (err, product) => {
            if(err) return res.status(500).send(err.message)
    
            if(product) return res.status(200).send(JSON.parse(product))
    
            const productId =  await Product.findById(req.params.id).lean().exec();
    
            client.set(`products.${req.params.id}`, JSON.stringify(productId))
            res.status(200).send(productId)
        })
    } catch (err) {
        res.status(500).send(err)

    }

});

//update a single product using the id


router.patch("/:id", async (req, res) => {
        const productUpdate = await Product.findByIdAndUpdate(req.params.id, req.body, {new : true});

        client.set(`products.${req.params.id}`, JSON.stringify(productUpdate))

        const products = await Product.find().lean().exec();

        client.set(`products` ,JSON.stringify(products));

        return res.status(201).send(productUpdate)



});


//delete a single product using the id

router.delete("/:id", async (req, res) => {
    const product = await Product.findByIdAndDelete(req.params.id).lean().exec();
    client.del(`products.${req.params.id}`);

    const products = await Product.find().lean().exec();

    client.set(`products` ,JSON.stringify(products));

    res.status(202).send(product)

});


module.exports = router;