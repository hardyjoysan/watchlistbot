import express from 'express';
import { config } from 'dotenv';
import './bot';
import './keepalive';

config();

const app = express();
const port = process.env.PORT;
const baseurl = process.env.BASE_URL;

app.get('/', (req, res) => {
  res.send('Let the game begins!');
});

app.get('/test', (req, res) => {
  res.json({ message : 'I\'m Alive!'});
});


app.listen(port, () => {
  console.log(`App listening at ${baseurl}:${port}`)
})