import Telegraf from 'telegraf';
import { config } from 'dotenv';
import { MongoClient } from 'mongodb';

config();

const bot = new Telegraf(process.env.BOT_TOKEN);
const client = new MongoClient(process.env.MONGODB_CONNECT, { useUnifiedTopology: true });

bot.command('start', (ctx) => {
  ctx.reply('<b><u>Hola Amigo! 😈</u></b><a href="https://t.me/joinchat/AAAAAFXx-J6srSdMQK9cgg"> Click here to join THE WATCHLIST to use this bot features</a>', { parse_mode:"HTML" });
});

bot.command('register', async (ctx) => {
  let message = ctx.update.message;
  let offset = message.entities[0].length;
  let username = message.text.slice(offset).trim();

  var doc = {user_id : message.from.id};

  await bot.telegram.getChat(username)
  .then(res => {
    doc = { ...doc, channel_id: res.id, channel_title: res.title}
  })
  .catch(() => {
    ctx.reply('Invalid user name provided!')
  });

  (async function (){
    try {
      
      await client.connect();
      const database = client.db('watchlistbot');
      const collection = database.collection('channels');
      await collection.insertOne(doc)
      .then(() => {
        ctx.reply('Channel successfully registered.')
      })
      .catch(() => {
        ctx.reply('Technical Error! Try again later.')
      });
      
    } finally {
      await client.close();
    }
  }());

});

bot.on('document', async (ctx) => {
    let document = ctx.update.message.document;
    await bot.telegram.sendDocument('1013218063', document.file_id, {caption: 'Join @The_Watchlist'});
});

bot.launch();