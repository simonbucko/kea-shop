import mongoose from "mongoose"
const { Schema } = mongoose;

const productSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        minlength: 2
    },
    imgUrl: {
        type: String,
        trim: true,
        required: true,
    },
    price: {
        type: Number,
        min: 0,
        required: true,
    },
    description: {
        type: String,
        minlength: 5,
        required: true,
    }
})

export default mongoose.model("Product", productSchema)