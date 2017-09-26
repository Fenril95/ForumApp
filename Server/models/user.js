var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    email: {type: String, required: true},
    role: {type: String, default: 'User'},
    isBanned: {type: Boolean, default: false},
    user_votes: [{type: Schema.ObjectId, ref: 'Comment'}],
    created_at: {type: Date, default: Date.now},
    modified_at: {type: Date, default: Date.now},
    imageURL: {type: String}
});

mongoose.model('User', userSchema);