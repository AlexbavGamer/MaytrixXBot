import { IBot, Command, IBotCommandConfig, IBotMessage } from '../../api'
import { Message, Client, CategoryChannel, DiscordAPIError, RichEmbed, MessageReaction, ReactionEmoji, User, ReactionCollector, ReactionCollectorOptions, Emoji } from 'discord.js';
import { SSL_OP_NETSCAPE_DEMO_CIPHER_CHANGE_BUG } from 'constants';
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
                usage: "<>",
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
            var promises = this.client.commandreactions.map((element) => 
            {
                if(element.category != "")
                {
                    description += `${element.reaction} - ${element.category}\n`;
                }
            });
            description += '\n\nClique em uma dessas para acessar';
            embed.setDescription(description);

            // await Promise.all(promises);
            
            const sentMessage = await (<Promise<Message>>message.channel.send(embed));

            this.client.commandreactions.forEach(cmdReactions => 
            {
                if(cmdReactions.reaction)
                        sentMessage.react(cmdReactions.reaction!.toString());
            });
            const map = this.client.commandreactions.map((react) => react.reaction);
           
            const filter = (reaction : MessageReaction, user : User) => !map.includes(reaction.emoji.id)  && user.id == message.author.id;

            await message.awaitReactions(filter, { time: 5000, max: 1}).then(collected => {
                console.log(collected.size);
            }).catch((err) => {
                if(err) return console.log(`Error: ${err}`)
            });
        }
    }
}