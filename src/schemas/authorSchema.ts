import { Schema} from "mongoose";

export let AuthorSchema: Schema = new Schema({
   
    name: {
        type: String,
        trim: true
    },

    books: {
        type: [String],
    },

    phone: {
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



