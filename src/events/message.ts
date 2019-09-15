import { Event, IBot, CodeBlock } from "../@types/Maytrix";
import * as Discord from 'discord.js';
export default class Message extends Event
{
    constructor(client : IBot)
    {
        super(client);
    }

    on(message : Discord.Message)
    {
        if(message.author.bot || !message.content.startsWith(this.client.config.prefix)) return;

        const args : string[] = message.content.split(/\s+/g);
        const command = args.shift()!.slice(this.client.config.prefix.length);
        const cmd = this.client.commands.get(command) || this.client.commands.get(this.client.aliases.get(command));

        if(!cmd) return;


        if(cmd.cooldown.has(message.author)) return message.delete();

        const creatorOnly = cmd.conf.permission.creatorOnly;

        if(!creatorOnly)
        {
			if(message.member.hasPermission(cmd.conf.permission.level))
            {
                const {optional, required} = cmd.checkUsage(message);
                if(args.length > optional.length)
                {
                    cmd.setMessage(message);
                    cmd.run(message, args);
                }
                else if(args.length >= (required.length))
                {
                    cmd.setMessage(message);
                    cmd.run(message, args);
                }
                else
                {
                    message.channel.send(`\`\`\`[*] REQUIRED | <*> OPTIONAL\`\`\`\n\tUsage: ${this.client.config.prefix}${command} ${cmd.conf.help.usage}`);
                }
			}
			else
            {
				message.channel.send(`Desculpe ${message.author} mas você não tem a permissão ${CodeBlock(cmd.conf.permission.level.toString())} para executar esse comando`);
			}
        }
        else
        {
            if(message.author.id == this.client.config.creatorId)
            {
                if(message.member.hasPermission(cmd.conf.permission.level))
                {
                    cmd.setMessage(message);
                    cmd.run(message, args);
    
                    message.delete();
                        
                    if(cmd.conf.cooldown > 0) cmd.startCooldown(message.author);
                }
                else
                {
                    message.channel.send(`Desculpe ${message.author} mas você não tem a permissão ${CodeBlock(cmd.conf.permission.level!.toString(), 'txt')} para executar esse comando`);
                }
            }
            else
            {
                message.reply(`Desculpe mas o comando \`\`${cmd.conf.help.name}\`\` é apenas usado \`\`dono\`\` do bot`);
            }
        }
    }
}