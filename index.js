const express = require('express')
const app = express()
const port = 3000

require('dotenv').config()

const Telegraf = require('telegraf')

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const response_time = new Date() - start
  const chat_from = `${ctx.message.chat.first_name} (id: ${ctx.message.chat.id})`
  console.log(`Chat from ${chat_from} (Response Time: ${response_time})`)
})

bot.hears('Assalamualaikum', (ctx) => ctx.reply('Waalaikumsalam'))
bot.launch()

app.get('/', (req, res) => {
res.send('Hello World!')
})

app.listen(port, () => {
console.log(`App listening at port:${port}`)
})