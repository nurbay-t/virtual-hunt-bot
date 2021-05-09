const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    chatId:{
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    progress: {
        type: Number,
        required: true
    }
});

mongoose.model("User", userSchema);