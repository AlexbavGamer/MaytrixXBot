import { IBot, Command, IBotCommandConfig, IBotMessage } from '../../api'
import { Message, Client, CategoryChannel, DiscordAPIError, RichEmbed, MessageReaction } from 'discord.js';
export default class HelpCommand extends Command 
{
    constructor(client : IBot)
    {
        super(client, 
        {
            aliases: ["q"],
            allowDMs: false,
            cooldown: 1000,
            autodelete: 1000,
            permission: {
                level: "READ_MESSAGES",
                creatorOnly: false,
            },
            help:
            {
                name: "query",
                description: "get help from command",
                usage: "<command>",
                category: "Gaming",  
            }
        });
    }

    async run(message : Message, args : string[])
    {
        message.reply("este comando não está pronto ainda.").then(message => {
            if(this.conf.autodelete!)
            {
                const num : Number = (<Number>this.conf.autodelete!.valueOf());
                (<Message>message).delete(num.valueOf());
            }
        });
    }
}