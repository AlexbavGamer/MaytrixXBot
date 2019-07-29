import { IBot, Command, IBotCommandConfig, IBotMessage } from '../../api'
import { Message, Client, CategoryChannel, DiscordAPIError, RichEmbed, MessageReaction, Collection } from 'discord.js';
import { inspect } from 'util';
import { timingSafeEqual } from 'crypto';
import { type } from 'os';

export default class extends Command
{
    constructor(client : IBot)
    {
        super(client, 
        {
            aliases: ["reiniciar"],
            allowDMs: false,
            cooldown: 1000,
            autodelete: false,
            permission:
            {
                level: "ADMINISTRATOR",
                creatorOnly: true,
            },
            help:
            {
                name: "restart",
                category: "admin",
                description: "restart bot (creatorOnly)",
                usage: "<time>"
            }
        });
    }

    async run(message : Message, args : Array<string>)
    {
        const token = this.client.config.token;
        
        const time = Date.now();
        message.channel.send(`Bot Reiniciando!`).then((value : Message | Message[]) => {
            const msg = <Message>value;
            setTimeout(() => 
            {
                const timeNow = Math.floor((Date.now() - time) / 1000);
                msg.edit(`Bot reiniciado! (Levou ${timeNow >= 60 ? (timeNow / 60) : (timeNow)} ${(timeNow) > 60 ? "Minutos" : "Segundos"})`);
                this.client.restart();
            }, (this.client.config.restartTime! * 1000));
        });

        
    }
}