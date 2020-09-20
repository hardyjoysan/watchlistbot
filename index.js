import Telegraf from 'telegraf';
import dotenv from 'dotenv';

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.command('start', (ctx) => {
  ctx.reply('<b><u>Hola Amigo! 😈</u></b><a href="https://t.me/joinchat/AAAAAFXx-J6srSdMQK9cgg"> Click here to join THE WATCHLIST to use this bot features</a>', { parse_mode:"HTML" });
});

bot.on('document', async (ctx) => {
    let document = ctx.update.message.document;
    await bot.telegram.sendDocument('1013218063', document.file_id, {caption: 'Join @The_Watchlist'});
});

bot.launch();