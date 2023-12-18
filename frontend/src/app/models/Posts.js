// models/Post.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  
    title: {
        type: String,
        required: false
    },   
    url: {
        type: String,
        required: true
    },
    x: {
        type: Number,
        required: true
    },
    y: {
        type: Number,
        required: true
    },
    galleryid: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Post', PostSchema);
