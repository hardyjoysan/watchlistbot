import Telegraf from 'telegraf';
import { config } from 'dotenv';
import { MongoClient } from 'mongodb';
import Markup from 'telegraf/markup';

config();

const bot = new Telegraf(process.env.BOT_TOKEN);

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
      doc = {
        ...doc, 
        channel_id: res.id, 
        channel_title: res.title, 
        channel_username: res.username
      }
    })
    .catch((error) => {
      console.log(error.description);
      ctx.reply('Invalid user name provided!');
    });

  if (!doc.channel_id) return false;

  const client = new MongoClient(process.env.MONGODB_CONNECT, { useUnifiedTopology: true });
  
  (async function (){
      try {
        await client.connect();
        const database = client.db('watchlistbot');
        const collection = database.collection('channels');
        let check = await collection.findOne({user_id: doc.user_id, channel_id: doc.channel_id});
        if (!check) {
          await collection.insertOne(doc)
            .then(() => {
              return ctx.reply('Channel successfully registered.');
            });
        }else{
          return ctx.reply('Submitted username already registerd with your account.');
        }
      } catch {
        return ctx.reply('Technical Error! Try again later.');
      } finally {
        await client.close();
      }
  }());

});

// bot.on('document', async (ctx) => {
//   let document = ctx.update.message.document;
//   let caption = '<b>' + document.file_name.slice(0, -4).replace(/[.-]/g, " ").trim() + '\n________________________________________\n<a href="https://t.me/joinchat/AAAAAFXx-J6srSdMQK9cgg">THE WATCHLIST 👀❣🎈 </a></b>';

//   await bot.telegram.sendDocument('1013218063', document.file_id, {parse_mode: 'HTML', caption: caption});
// });

bot.on('document', async (ctx) => {
  let message = ctx.update.message;
  var user_id = message.from.id;

  const client = new MongoClient(process.env.MONGODB_CONNECT, { useUnifiedTopology: true });
  
  (async function (){
      try {
        await client.connect();
        const database = client.db('watchlistbot');
        const collection = database.collection('channels');
        let channels = collection.find({user_id: user_id});

        if ((await channels.count()) === 0) {
          ctx.reply("No channels found!");
          return false;
        }
        var keyboards = [];
        await channels.forEach(channel => {
          keyboards.push({
            text : '@'+channel.channel_username, 
            callback_data: channel.channel_id
          });
        });

        ctx.replyWithDocument(message.document.file_id, Markup
          .inlineKeyboard(keyboards)
          .oneTime()
          .resize()
          .extra()
        )

      } catch(error) {
        return ctx.reply('Technical Error! Try again later.');
      } finally {
        await client.close();
      }
  }());
});

bot.on('callback_query', async (ctx) => {
  var channel_id = ctx.update.callback_query.data;  
  let document = ctx.update.callback_query.message.document;
  let caption = '<b>' + document.file_name.slice(0, -4).replace(/[.-]/g, " ").trim() + '\n________________________________________\n<a href="https://t.me/joinchat/AAAAAFXx-J6srSdMQK9cgg">THE WATCHLIST 👀❣🎈 </a></b>';

  await bot.telegram.sendDocument(channel_id, document.file_id, {parse_mode: 'HTML', caption: caption})
  .catch((error) => {
    if (error.code === 403) {
      ctx.reply('Error! Please add @The_Watchlist_Bot as Administrator in channel.');
    }else{
      ctx.reply(error.description);
    }
  });

  let message = ctx.update.callback_query.message;
  await bot.telegram.deleteMessage(message.chat.id, message.message_id)
  .catch((error) => {
    console.log(error.description);
  });

});

bot.launch();