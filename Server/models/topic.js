var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var topicSchema = new Schema({
    header: {type: String, required: true},
    description: String,
    questions: [{type: Schema.ObjectId, ref: 'Question'}],
    created_at: {type: Date, default: Date.now},
    modified_at: {type: Date, default: Date.now},
    user_id: String,
    created_by: String
});

mongoose.model('Topic', topicSchema);