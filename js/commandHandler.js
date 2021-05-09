const mongoose = require('mongoose');
const User = mongoose.model("User");
const Message = mongoose.model("Message");

module.exports.commandHandler = bot => {
    // start
    bot.start(ctx => {
        ctx.reply(`Welcome ${ctx.from.first_name}`);
        User.findOne({
            username: ctx.message.from.username
        }).then(savedUser => {
            if (!savedUser) {
                const user = new User({
                    chatId: ctx.message.from.id,
                    username: ctx.message.from.username,
                    progress: 1
                });
                user.save().then(() => {
                    ctx.reply('I saved your username, so do not change it during the hunt. Your are the ONE who will communicate with me on BEHALF OF THE TEAM.\n Now, please, send me message \'puzzle\' to get the next puzzle.\nSo instructions are simple: When you solve puzzle, send me answer.');
                }).catch(err => {
                    console.log("error saving user " + err);
                    ctx.reply("I could not save your info in the cloud.\nPlease, write '/start' again.");
                });
            } else {
                ctx.reply('Your data is saved. You can start sending me answers. If you would like to get previous puzzles again, just send corresponding answers, that lead to the puzzle you want.');
            }
        }).catch(err => {
            console.log("error finding user in start " + err);
            ctx.reply("I could not retrieve your data to save in the cloud. Make sure you have a Telegram username.\nPlease, write '/start' again.");
        });

    });
    // help
    bot.help(ctx => {
        console.log(ctx.from.username + ' : /help');
        ctx.reply('Send me answers.If you would like to get previous puzzles again, just send corresponding answers, that lead to the puzzle you want. '); // instructions as in start
    });

    // for admins
    bot.command('deleteAll', ctx => {
        let admin = ctx.message.from.username;
        if (admin == 'justrandomusername' || admin == 'R2202S3XY' || admin == 'nurvyb' || admin == 'dakhoot') {

            Message.deleteMany({}).then(function () {
                console.log(`${admin} is deleting all messages`);
                ctx.reply('You have deleted all messages');
            }).catch(err => {
                console.log(`${admin} is failed deleting messages, error: ${err}`);
            });
            User.deleteMany({}).then(function () {
                console.log(`${admin} is deleting all User info`);
                ctx.reply('You have deleted all User info');
            }).catch(err => {
                console.log(`${admin} is failed deleting User info, error: ${err}`);
            });
        }
    });

    bot.command('listAll', ctx => {
        let admin = ctx.message.from.username;
        if (admin == 'justrandomusername' || admin == 'R2202S3XY' || admin == 'nurvyb' || admin == 'dakhoot') {

            User.find({}).then(users => {
                let reply = '';
                users.forEach(user => {
                    reply = reply + `@${user.username}, puzzles solved: ${user.progress}\n`
                });
                console.log(`${admin} is retrieving list of users`);
                ctx.reply(reply);
            }).catch(err => {
                console.log(`${admin} is failed retrieving list of users, error: ${err}`);
            });
        }
    });

    bot.command('getmsg', ctx => {
        let admin = ctx.message.from.username;
        if (admin == 'justrandomusername' || admin == 'R2202S3XY' || admin == 'nurvyb' || admin == 'dakhoot') {
            ctx.scene.enter('getmsgScene');
        }
    });
}