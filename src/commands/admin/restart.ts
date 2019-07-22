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
                usage: ""
            }
        });
    }

    async run(message : Message, args : Array<string>)
    {
        const token = this.client.config.token;
        
        message.channel.send("Bot Reiniciando em 15 segundos!").then((value : Message | Message[]) => {
            const msg = <Message>value;
            setTimeout(() => 
            {
                msg.edit("Bot reiniciado!");
                this.client.restart();
            }, 5000);
        });

        
    }
}