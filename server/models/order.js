import mongoose from "mongoose"
const { Schema } = mongoose;

const orderSchema = new Schema({
    userId: {
        type: String,
        trim: true,
    },
    products: {
        type: [{
            productId: {
                type: String,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                min: 0,
            }
        }],
        required: true
    },
    deliveryAddress: {
        type: String,
        trim: true,
        min: 5,
        required: true,
    },
    status: {
        type: String,
        trim: true,
        required: true,
    },
    email: {
        type: String,
        required: true,
        minlength: 5
    }
})

export default mongoose.model("Order", orderSchema)