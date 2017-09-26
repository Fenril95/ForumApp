var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
    topic_id: String,
    question_id: String,
    user_id: String,
    user_img: String,
    content: {type: String, required: true},
    isImportant: {type: Boolean, default: false},
    quote: {type: String, default: ''},
    quoteAuthor: {type: String, default: ''},
    rating: {type: Number, default: 0},
    userRatingAction: {type: Number, default: 0},
    created_at: {type: Date, default: Date.now},
    modified_at: {type: Date, default: Date.now},
    created_by: String
});


mongoose.model('Comment', commentSchema);