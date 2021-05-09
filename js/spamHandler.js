module.exports.spamHandler = bot => {

    bot.on(['dice', 'document', 'photo', 'sticker', 'video', 'voice', 'contact', 'location', 'venue'], (ctx) => {
        console.log(`-_- ${ctx.message.from.username} is sending spam -_-`);
        bot.telegram.forwardMessage(445835765, ctx.message.chat.id, ctx.message.message_id);
        return ctx.reply('Please, send me your answers only');
    });

}