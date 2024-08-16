import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    product: {
        type: Object,
        required: true
    }
});

export const CartModel = mongoose.model('Cart', cartSchema);