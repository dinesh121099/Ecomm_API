import { Schema, model } from 'mongoose';
const productCat = Schema({
    title: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    routeName: {
        type: String,
        required: true,
    },
    id:{
        type: Number,
        required: true
    }

})
const ProductCategory = model('productcategory', productCat);

export default ProductCategory;