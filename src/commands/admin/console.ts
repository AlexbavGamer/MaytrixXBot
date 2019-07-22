import { IBot, Command, IBotCommandConfig, IBotMessage } from '../../api'
import { Message, Client, CategoryChannel, DiscordAPIError, RichEmbed, MessageReaction, Collection } from 'discord.js';
import { inspect } from 'util';
import { exec } from 'child_process';

export default class extends Command
{
    constructor(client : IBot)
    {
        super(client, 
            {
            aliases: ["console"],
            allowDMs: false,
            cooldown: 1000,
            autodelete: false,
            permission:
            {
                level: ["ADMINISTRATOR"],
                creatorOnly: true,
            },
            help:
            {
                name: "c",
                category: "admin",
                description: "Execute TypeScript Code or JavaScript Code",
                usage: "<code>"
            }
        });
    }
    
    run(message : Message, args : Array<string>)
    {
        const arg = args.join(" ");
        try
        {
            exec(arg, 
            {
                encoding: 'utf8'
            } , (err, stdout, stderr) => 
            {
                if(err)
                {
                    return message.channel.send("ERROR:" + err.message);
                }
                message.channel.send(`stdout: ${stdout}`);
                message.channel.send(`stderr: ${stderr}`);
            });
        }
        catch(e)
        {
            message.channel.send(e);
        }
    }
}