import { Schema, model } from 'mongoose';

const productSchema = new Schema({
    name: String,
    price: Number,
    category: String,
    description: String,
    stock: Number,
    code: Number,
    codeID: { type: Number, unique: true }
});

export const ProductModel = model('Product', productSchema);