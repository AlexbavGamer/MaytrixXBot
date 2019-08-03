import { IBot, Command, IBotCommandConfig, IBotMessage, Eval } from '../../api'
import {collectMessage, onCollectMessage, denyAll, allowAll} from '../../utils';
import { Message, Client, CategoryChannel, DiscordAPIError, RichEmbed, MessageReaction, Collection, Collector, PermissionResolvable, TextChannel, PermissionObject } from 'discord.js';
import { inspect, promisify, isNull } from 'util';
const wait = promisify(setTimeout);
export default class CodeChannelCommand extends Command 
{
    forbidden_evals : Collection<string, boolean> = new Collection();
    constructor(client : IBot)
    {
        super(client, 
        {
            aliases: ["cc"],
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
                name: "codechannel",
                category: "admin",
                description: "Create a Channel only you cant access and execute commands",
                usage: ""
            }
        });
        this.forbidden_evals.set("this.client.config", true); 
    }

    async run(message : Message, args : Array<string>)
    {
        const guild = message.guild;
        const name = message.author.username;
        const member = message.author;
        const filterChannelName = `${name}-commands`;

        guild.channels.filter(f => f.name == filterChannelName).forEach(channel => {
            message.channel.send(channel.name);
        });

        wait(1000);

        guild.createChannel(filterChannelName, 'text').then(channel => 
        {
            guild.roles.filter(role => role.name === `${name}'s Role`).forEach(role => {
                role.delete();
            });
            guild.createRole({
                permissions: ["VIEW_CHANNEL"],
                name: `${name}'s Role`,
                hoist: true,
                mentionable: false
            }).then(role => 
            {
                const roles = guild.roles.map((role) => role.name);
                const everyoneRole = guild.defaultRole;
                channel.overwritePermissions(everyoneRole, denyAll);
                channel.overwritePermissions(role, allowAll);
                
                const myRole = message.member.roles.find("id", role.id);

                if(myRole)
                {
                    message.member.removeRole(myRole);
                }
                message.member.addRole(myRole);
            });
            const txtChannel = <TextChannel>channel;
            const sentMessage = txtChannel.send(`${member} Digite qualquer codigo em linguagem TypeScript ou JavaScript que eu irei executar.\n\nNote: Tem algumas funções que está proibida`);
            sentMessage.then(newMessage => {
                (<Message>newMessage).pin();
            })
            var codes : string[] = new Array<string>();
            const collector = collectMessage(txtChannel, message.member.user, (m) => 
            {
                if(m.content == "run")
                {
					m.delete();
                    var code = codes.join("\n");
                    let evaluted = inspect(eval(code), {depth: 0 });
                    try{
                        if(!code)
                        {
                            txtChannel.send("Não foi possivel executar: ``não posso executar nenhum codigo``");
                        }
                        else
                        {
                            let hrStart = process.hrtime();
                            let hrDiff;

                            hrDiff = process.hrtime(hrStart);
                            return txtChannel.send(`*Executado em ${hrDiff[0] > 0 ? `${hrDiff[0]}s` : ''}${hrDiff[1] / 1000000}ms.*\`\`\`typescript\n${evaluted}\n\`\`\``);
                        }
                    } 
                    catch(e)
                    {
                        m.channel.send(e);
                    }
                    return;
                }
                if(m.content == "clear")
                {
                    codes = new Array<string>();
                    m.channel.messages.forEach(message => {
                        if(!message.pinned)
                        {
                            message.delete();
                        }
                    });
                    m.channel.send(`Chat Limpo.`).then(deletedMessage => {
                        (<Message>deletedMessage).delete(1000);
                    });
                    return;
                }
                if(m.content == "exit")
                {
                    setTimeout(() => {
                        channel.delete();
                    }, 2500);
                    return;
                }
                if(m.content == "log")
                {
                    m.channel.send(`${codes.join("\n")}`);
                    return;
                }
                codes.push(m.content);
            });
        });
    }
}