const mongoose = require('mongoose');
const User = mongoose.model("User");
const Message = mongoose.model("Message");

const responses = new Map();
responses.set(3,'<em>Now let me continue my story :)</em>\n--\n ... After finding out what he meant, I was totally awake and decided to check other emails too. One of them was from a Computer Science Course Professor, who likes interesting facts and of course <u>machine language</u>. I also know that he has a son who is really cute and just learning the <u>alphabet</u>.')
responses.set(4,'After answering all emails and having my breakfast  I called my uncle who is <u>old-fashioned</u>. But we both enjoy reading <u>Kazakh literature</u>, so I have fun having conversations with him. We talked for about half an hour. Next, I started doing my homework as I got a message from him. However, it was not a usual message. Finally, I found that he\'s a huge fan of ...')
responses.set(5,'Later I checked my schedule from MyRegistrar and noticed that something was wrong. ')
responses.set(6,'Then, it was time for one Quiz. I prepared for it all night. All I had to do was to just write the <u>answer</u>. Just the answer. The irony is that I fell asleep 10 minutes before exam time and missed it. Don’t be like me.')
responses.set(7,'I felt bad due to skipping the exam and promised to pay attention to my sleep hours. I recommend you too. Your physical and mental health matters. In order to forget about this issue, I opened my gallery and started looking for old photos. There were quite a lot of pictures taken at the university. I missed university time so much. Those offline lectures where mostly I was half-sleepy, atrium full of students, library vibes … However, I couldn’t remember the names of places at the university, because my sleepy mind was blank as if all the letters in my head were chaotic.')
responses.set(8,'As I was looking through my gallery I found one interesting picture, which I wanted to share with you. I wonder how short text contains so much detailed information.')
responses.set(9,'Afterwards, I went outside to take a walk.  I put on earphones and turned on the music that I never heard before. I have been interested in music since childhood. So, I started searching for music notes of that song. However, when I found out, it didn’t seem like a music note. I thought something was hidden behind it. Is it a code? I guess so, but not a programming code that we are used to. I believe that each music has its story.')
responses.set(10,'Then I heard a sound. Bzzz-Bzzz. My alarm clock. Everything was just a dream. I have my head in the clouds, you see. Haha. I got up and checked my Instagram, where I saw <u>Kazakh Stage Club Instagram stories</u>. There were tricky questions about Kazakh Classic Books. Unfortunately, I got some of them wrong. I suggest you try. So, here I finish my story. Now, instead of preparing for the midterm that I have next Monday, I want to start reading ‘Abay zholy’. Bye!\n--\n<em>Your answer for the last puzzle\:</em>')

// answers
const abay = new Set();
abay.add('abay kunanbayev');
abay.add('abay');
abay.add('kunanbayev');

const justtheanswer = new Set();
justtheanswer.add('just_the_answer');
justtheanswer.add('just the answer');
justtheanswer.add('justtheanswer');
justtheanswer.add('answer');
justtheanswer.add('the answer');
justtheanswer.add('theanswer');

const mukagali = new Set();
mukagali.add('mukaghali makatayev');
mukagali.add('mukaghalimakatayev');
mukagali.add('mukagali makatayev');
mukagali.add('mukagalimakatayev');
mukagali.add('mukagali');
mukagali.add('makatayev');


const answers = [new Set(['puzzle']), new Set(['end']), abay, new Set(['101120202102273365210']),
                justtheanswer, new Set(['aaadfhkmop']), new Set(['virtualhunt']), mukagali, 
                new Set(['3895'])]


// textHandler
module.exports.textHandler = bot => {
    bot.on('text', ctx => {
        if (!ctx.session.progress) {
            User.findOne({
                username: ctx.message.from.username
            }).then(userData => {
                ctx.session.progress = userData.progress;
                checkAnswer(bot, ctx);
            }).catch(err => {
                console.log("error finding user for ctx.count: " + err);
                ctx.reply("Please, write '/start' again.");
            });
        } else {
            checkAnswer(bot, ctx);
        }
    });
}

const checkAnswer = (bot, ctx) => {
    
    msg = ctx.message.text.toLowerCase().trim();
    
    if (msg === '3895' && ctx.session.progress >= 9) {
        if (ctx.session.progress == 9) {
            updateDB(ctx, 1);
        } else {
            updateDB(ctx, 0);
        }
        console.log(`***LAST ANSWER [${ctx.from.username}: ${ctx.message.text}] LAST ANSWER***`);
        ctx.reply('You have finished the Virtual Hunt!');
        User.find({}).then(users => {
            users.forEach(user => {
                bot.telegram.sendMessage(user.chatId, `***LAST PUZZLE WAS SOLVED***\n@${ctx.from.username}\n***LAST PUZZLE WAS SOLVED***`);
            });
        }).catch(err => console.log("The STOP was not sent to all hunters"));
        return;
    }

    for (let i = 0; i < answers.length; i++) {
        if ( answers[i].has(msg) && ctx.session.progress >= (i+1) ) {
            console.log(`!!! ${ctx.from.username}: ${ctx.message.text} !!!`);
            bot.telegram.sendMessage(ctx.message.from.id, responses.get(i+3), { parse_mode: "HTML" });
            if (ctx.session.progress == (i+1)) {
                updateDB(ctx, 1);
            } else {
                updateDB(ctx, 0);
            }
            ctx.replyWithDocument({
                source: `./puzzles/puzzle${i+3}.pdf`,
                filename: `${i+3}.pdf`
            });
            return;
        }
    }

    updateDB(ctx, 0);
    console.log(ctx.from.username + ": " + ctx.message.text);
    if (ctx.session.progress >= 10) {
        return ctx.reply('You have completed the Virtual Hunt!');
    }
    ctx.reply(`Unfortunately your answer is not correct.\n[ You have completed ${ctx.session.progress} puzzle(s) ]`);
}

const updateDB = (ctx, changeProgress) => {
    User.findOne({
        username: ctx.message.from.username
    }).then(userData => {
        if (changeProgress) {
            ctx.session.progress++;
            userData.progress = ctx.session.progress;
            userData.save().catch(err => {
                console.log(`${err}\nerror updating progress:\n${ctx.message.text}\n${ctx.message.from.username}`);
                ctx.reply("Your answer is correct! However I could not save your progress. Please, send it again");
                ctx.session.progress--;
            });
        }
        let today = new Date();
        today.setHours(today.getHours() + 6)
        let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        let dateTime = date + ' ' + time;
        const msg = new Message({
            chatId: ctx.message.from.id,
            text: ctx.message.text,
            timestamp: dateTime,
            sentBy: userData
        });
        msg.save().catch(err => {
            console.log(`${err}\nerror saving message:\n${ctx.message.text}\n${ctx.message.from.username}`);
            ctx.reply("Your answer is correct! However I could not save your progress. Please, send it again");
        });
    }).catch(err => {
        console.log(`${err}\nerror finding username:\n${ctx.message.text}\n${ctx.message.from.username}`);
        ctx.reply("Your answer is correct! However I could not save your progress. Please, send it again");
    });
}

