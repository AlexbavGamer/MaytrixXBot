import { IBot, Command, IBotCommandConfig, CodeBlock, DoubleQuotes } from '../../@types/Maytrix'
import { IBotMessage } from 'MaytrixAPI';
import { Message, Client, CategoryChannel, DiscordAPIError, RichEmbed, MessageReaction, ReactionEmoji, User, ReactionCollector, ReactionCollectorOptions, Emoji } from 'discord.js';
export default class HelpCommand extends Command 
{
    constructor(client : IBot)
    {
        super(client, 
        {
            aliases: ["ajuda"],
            allowDMs: false,
            cooldown: 1000,
            autodelete: false,
            permission: 
            {
                level: "READ_MESSAGES",
                creatorOnly: false,
                
            },
            help:
            {
                name: "help",
                description: "get help from commands",
                usage: "<name>",
                category: "Util"
            }
        });
    }

    async run(message : Message, args : string[])
    {

        if(args.length == 1)
        {
            var embed = new RichEmbed();

            const cmd = await this.client.commands.get(args[0]) || this.client.commands.get(this.client.aliases.get(args[0]));

            if(!cmd)
            {
                return message.reply(`Desculpe, mas não tem nenhum comando chamado \`\`${args[0]}\`\` tente outro comando.`);
            }
            else
            {
                embed.setTitle(`Help: ${cmd.conf.help.name}`)
                .addField("``Usage``", `!${cmd.conf.help.name} ${cmd.conf.help.usage}`);
                if(cmd.conf.help.description)
                {
                    embed.addField("``Description``", cmd.conf.help.description, true);
                }

                if(cmd.conf.aliases.length > 0)
                {
                    embed.addField("``Aliases``", cmd.conf.aliases.join(","));
                }

                if(cmd.conf.cooldown > 0)
                {
                    embed.addField("``Cooldown``", cmd.conf.cooldown);
                }

                if(cmd.conf.permission.creatorOnly)
                {
                    embed.addField("``Creator Only``", "true", true);
                }


                message.channel.send(embed);
            }
        }
        else
        {
            var embed = new RichEmbed();

            embed.setTitle(`Olá ${message.author.username} para ver os comandos apenas reaga.`);


            var description = '';
            this.client.commandreactions.map((element) => 
            {
                if(element.category != "")
                {
                    description += `${element.reaction} - ${element.category}(${element.commands!.size})\n`;
                }
            });
            description += '\n\nClique em uma dessas para acessar';
            embed.setDescription(description);

            // await Promise.all(promises);
            
            const sentMessage = await (<Promise<Message>>message.channel.send(embed));

            this.client.commandreactions.map(async(element) => 
            {
                if(element.reaction)
                        await sentMessage.react(element.reaction!.toString());
            });

            const map = this.client.commandreactions.map((react) => react.reaction);
           
            const filter = (reaction : MessageReaction, user : User) =>
            {
                return map.includes(reaction.emoji.name) && user.id == message.author.id;
            }

            this.client.commandreactions.forEach(reactionList => {
                console.warn(`${reactionList.category}:${reactionList.commands!.size}`);
            });

            sentMessage.awaitReactions(filter, {max: 1, time: 15000, errors: ['time']}).then(collected => {
                const reaction = collected.first();

                var commandsFromReact = this.client.commandreactions.filter((value) => value.reaction!.toString() == reaction.emoji.name);
                var _list : string[] = new Array<string>();
                commandsFromReact.forEach((reactions) => {
                    reactions.commands!.forEach((cmd) => 
                    {
                        var info = '```';
                        info += `${cmd.conf.help.name}: ${cmd.conf.help.usage}` + "\n";
                        info += `Descrição:\n`;
                        info += `\t${cmd.conf.help.description}` + "\n";
                        info += `Permissão:\n`;
                        info += `\t` + (message.member.hasPermission(cmd.conf.permission.level) ? "SIM" : "NÂO") + "\n";
                        info += "```";
                        _list.push(info);
                    });
                });
                sentMessage.channel.send(_list.join('\n'));
            });
        }
    }
}