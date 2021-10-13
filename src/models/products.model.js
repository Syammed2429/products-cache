const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name : {type : String, required: true},
    inStock : {type : Boolean, required: true},
    price : {type : Number, required: true}

}, 
{
    versionKey : false,
    timestamps : true
}
);

const Product = mongoose.model('product', productSchema);

module.exports = Product;