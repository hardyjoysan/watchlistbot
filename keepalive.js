import axios from "axios";
import { config } from "dotenv";
config();

const port = process.env.PORT;
const baseurl = process.env.BASE_URL;

setInterval(async () => {
  await axios
    .get(`${baseurl}`)
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
}, 1000 * 60 * 10);
