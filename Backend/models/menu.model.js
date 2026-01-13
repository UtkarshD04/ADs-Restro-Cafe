import mongoose from "mongoose";

const menuSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
        required: true
    },
    image: {
        type:String,
        required:true
    },
    isAvailable:{
        type:Boolean,
        default:true
    }
},{timestamps:true});

const Menu = mongoose.model("menu",menuSchema)
export default Menu;