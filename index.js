require('dotenv').config();

const randomPhoto = 'https://picsum.photos/320/320/?random'

const Telegraf = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

// bot.use(async (ctx, next) => {
//   console.log(ctx.message);
//   const start = new Date();
//   await next();
//   const response_time = new Date() - start;
//   const chat_from = `${ctx.message.chat.first_name} (id: ${ctx.message.chat.id})`;
//   console.log(`Chat from ${chat_from} (Response Time: ${response_time})`);
// });

bot.hears('/start', (ctx) => {
  ctx.reply('Hello World!');
});

bot.hears('random', async (ctx) => {
  bot.telegram.sendPhoto('1013218063', randomPhoto);
});

bot.on('photo', async (ctx) => {
  console.log("context", ctx.update.message.photo[0].file_id);
});

bot.on('document', async (ctx) => {

    //console.log("document", ctx.update.message.document);
    //console.log("chat", ctx.update.message.chat);
    //console.log("from", ctx.update.message.from);

    const document = ctx.update.message.document;
    

    //await bot.telegram.deleteMessage(chat_id, message_id)

    

    await bot.telegram.sendDocument('1013218063', document.file_id, {thumb: '', caption: ''})
    .then((response) => {

      console.log("send", response);

      const chat_id = response.chat.id;
      const message_id = response.message_id;
      const media = {
        type: "document",
        media: document.file_id,
        thumb: "",
        caption: "Join @The_Watchlist | Powered by @The_Watchlist_Bot",
      }

      const edit = bot.telegram.editMessageMedia(chat_id, message_id, null, media)
      .then((response) => {
        console.log("edit", response);

      })
      .catch((error) => {
        console.log("error_res", error.response);
        console.log('error_data', error.on);
      });


    });

    

    

});

bot.launch();