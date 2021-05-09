const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;

const messageSchema = new mongoose.Schema({
    chatId:{
        type: String,
        required: true
    },
    text:{
        type: String,
        required: true
    },
    timestamp:{
        type: String,
        required: true
    },
    sentBy:{
        type: ObjectId,
        ref: "User"
    }
});

mongoose.model("Message", messageSchema);