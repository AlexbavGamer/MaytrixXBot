import ExpressHost from './ExpressHost';
import { IBotConfig } from 'iBotInterfaces';
import { Bot } from './bot.module';
require('dotenv').config();

let cfg = require('./../bot.json') as IBotConfig

const app = new ExpressHost(Bot.instance);

app.start();

console.log("APP: OK")