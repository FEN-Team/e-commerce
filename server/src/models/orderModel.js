const { Schema, model } = require('mongoose');

const orderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        product: {
            type: Object,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        isInStock: Boolean
    }],
    isDelivered: Boolean,
    discountPercentage: Number,
    deliveryDate: {
        type: Date,
        required: true
    }
}, { timestamps: true });


module.exports = model('Order', orderSchema);


