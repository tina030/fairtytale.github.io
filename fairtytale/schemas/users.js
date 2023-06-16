const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        "帳號": {
            type: String, 
        },
        "名稱": {
            type: String, 
        },
        "密碼": {
            type: String,
        },
        "成就": {
            type: [String],
        },
        "結局收集": {
            type: [String],
        },
        "次數": {
            type: Number,
        },
    }, { versionKey: false }
);


const User = mongoose.model('users', userSchema);

module.exports = User;