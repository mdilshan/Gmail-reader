const mongoose = require('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({
    googleId : String,
    email : String,
    refreshToken : String
});

mongoose.model('user', userSchema);
