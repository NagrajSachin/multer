const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IconFont = new Schema({
    location : {
        type : String,
    },
    filename : {
        type : String,
    },
    classname : {
        type : String,
    }
});

module.exports = mongoose.model('iconfont', IconFont);