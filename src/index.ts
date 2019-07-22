import { IBot, IBotConfig, ILogger } from './api'
import { Bot } from "./Bot";

const logger: ILogger = console

let cfg = require('./../bot.json') as IBotConfig
try {
    const cfgProd = require('./../bot.prod.json') as IBotConfig
    cfg = { ...cfg, ...cfgProd }
} catch {
    logger.info('no production config found...')
}

new Bot().start(logger, cfg, `${__dirname}/commands`, `${__dirname}/events`)