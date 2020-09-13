require('dotenv').config();

const Telegraf = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const response_time = new Date() - start;
  const chat_from = `${ctx.message.chat.first_name} (id: ${ctx.message.chat.id})`;
  console.log(`Chat from ${chat_from} (Response Time: ${response_time})`);
});

bot.hears('Hi', (ctx) => ctx.reply('Hello World!'));

bot.on('message', async (ctx) => {
    console.log("document", ctx.update.message.document);
    console.log("chat", ctx.update.message.chat);
    console.log("from", ctx.update.message.from);
    console.log("context", ctx);
    var msg_doc = ctx.update.message.document;
    if (msg_doc) {
        let file_id = msg_doc.file_id;
        await bot.telegram.sendDocument('1013218063', file_id);
    }   
});

bot.launch();