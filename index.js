require('dotenv').config();

const Telegraf = require('telegraf');
const Stage = require('telegraf/stage');
const Scene = require('telegraf/scenes/base');
const { leave } = Stage;
const mongoose = require('mongoose');
require('./models/user.js');
require('./models/message.js');
const User = mongoose.model("User");
const Message = mongoose.model("Message");
const { textHandler } = require('./js/textHandler');
const { commandHandler } = require('./js/commandHandler');
const { spamHandler } = require('./js/spamHandler');

mongoose.connect(process.env.MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.connection.on('connected', () => {
    console.log("connected to Mongo");
});
mongoose.connection.on('error', (err) => {
    console.log("connection error: ", err);
});

//getmsgScene
const getmsgScene = new Scene('getmsgScene');
getmsgScene.enter(ctx => ctx.reply("write the username without @"));
getmsgScene.on('text', ctx => {
    User.find({username: ctx.message.text}).then(users => {
        if (users[0]) {
            Message.find({sentBy :users[0]._id}).then(msgs => {
                if (msgs.length > 0) {
                    let reply = '';
                    msgs.forEach(msg => {
                        reply = reply + `msg: ${msg.text}\ntime: ${msg.timestamp}\n--\n`
                    });
                    ctx.reply(reply);
                } else {
                    ctx.reply("no progress - no messages saved");
                }
                ctx.scene.leave();
            }).catch(err => {
                console.log("error retrieving msgs: " + err);
                ctx.reply("error retrieving msgs: " + err);
                ctx.scene.leave();
            });
        } else {
            console.log("no user found");
            ctx.scene.leave();
        }
    }).catch(err => {
        console.log("error retrieving user: " + err);
        ctx.reply("error retrieving user: " + err);
        ctx.scene.leave();
    });
    
});
getmsgScene.leave(ctx => ctx.reply("you have left"));
const stage = new Stage();
stage.command('cancel', leave());
stage.register(getmsgScene);


const bot = new Telegraf(process.env.BOT_TOKEN);
bot.use(Telegraf.session());
bot.use(stage.middleware())

commandHandler(bot);
textHandler(bot);
spamHandler(bot);

bot.launch();