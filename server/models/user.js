import mongoose from "mongoose"
const { Schema } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        minlength: 2
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5
    },
    isAdmin: {
        type: Boolean,
        required: true
    }
})

export default mongoose.model("User", userSchema)