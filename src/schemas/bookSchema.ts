import { Schema} from "mongoose";

export let BookSchema: Schema = new Schema({
   
    name: {
        required: true,
        type: String,
        trim: true
    },

    author: {
        required: true,
        type: String,
        trim: true
    },

    publisher: {
        required: true,
        type: String,
        trim: true
    },

    publish_year:{
        type: String
    }
    
}, {timestamps: true});



