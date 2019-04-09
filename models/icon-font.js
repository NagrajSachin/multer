const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IconFont = new Schema({
    location : {
        type : String,
    },
    iconname : {
        type : String,
    },
    classname : {
        type : String,
    }
});

module.exports = mongoose.model('iconfont', IconFont);