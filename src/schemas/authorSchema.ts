import { Schema} from "mongoose";

export let AuthorSchema: Schema = new Schema({
   
    name: {
        required: true,
        type: String,
        trim: true
    },

    books: {
        required: true,
        type: [String],
    },

    phone: {
        required: true,
        type: String,
        trim: true
    },

    age:{
        type: Number
    },

    address: {
        type: String
    }
    
}, {timestamps: true});



