var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ratingSchema = new Schema({
    user_id: String,
    comment_id: String,
    voteState: Number,
    type: {type: String, default: 'Comment'}
});

mongoose.model('Rating', ratingSchema);
