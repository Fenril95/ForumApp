var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var questionSchema = new Schema({
    user_id: String,
    topic_id: String,
    title: {type: String, required: true},
    description: String,
    hasImportantAnswer: {type: Boolean, default: false},
    created_at: {type: Date, default: Date.now},
    modified_at: {type: Date, default: Date.now},
    comments: [{type: Schema.ObjectId, ref: 'Comment'}],
    created_by: String,
    user_img: String
});

mongoose.model('Question', questionSchema);