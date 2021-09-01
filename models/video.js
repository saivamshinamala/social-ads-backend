const mongoose = require("mongoose");

const videoSchema = mongoose.Schema({
    creatorId: String,
    video: String,
    title: String,
    link: String,
    language: String,
    views: Number,
    budget: Number,
    pastelink: Array,
    promote: String,
    displayDelete: Boolean,
    displayPromote: Boolean
});

module.exports = mongoose.model('Video', videoSchema);