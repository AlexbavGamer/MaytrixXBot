import { IBot, Command, IBotCommandConfig, IBotMessage, Eval, CodeBlock } from '../../api'
import {collectMessage, onCollectMessage, denyAll, allowAll} from '../../utils';
import { Message, Client, CategoryChannel, DiscordAPIError, RichEmbed, MessageReaction, Collection, Collector, PermissionResolvable, TextChannel, PermissionObject, GuildChannel, GuildMember, User } from 'discord.js';
import { inspect, promisify, isNull } from 'util';
const wait = promisify(setTimeout);

type ActionCommand = (user: User, channel : TextChannel, args : Array<any>) => void;
export default class CodeChannelCommand extends Command 
{
    static CodeChannels : Collection<string, TextChannel> = new Collection();
    forbidden_evals : Collection<string, boolean> = new Collection();
    actions : Collection<string, ActionCommand> = new Collection();
    autorun : Collection<string, boolean> = new Collection();
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
                level: "READ_MESSAGES",
                creatorOnly: false,
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
        this.actions.set("toggle", (user, channel, args) => {
            if(this.autorun.has(user.id))
            {
                this.autorun.set(user.id, !(this.autorun.get(user.id)));
                channel.send(`AutoRun: ${(this.autorun.get(user.id) ? "ATIVADO" : "DESATIVADO")}`);
            }
        });
        this.actions.set("help", (user, channel, args) => {
            let actions = this.actions.map((_, key) => {
                return key;
            });
            channel.send(`Comandos: ${actions.join(", ")}`)
        });
        this.actions.set("clear", async(user, channel, args) => 
        {
            const MessagesToDelete = channel.messages.filter(message => !message.pinned);
            await Promise.all([MessagesToDelete.forEach(message => {
                message.delete();
            })]);
            channel.send(`Foram removidos ${MessagesToDelete.size} mensagems`).then(sendMessage => {
                (<Message>sendMessage).delete(2500);
            });
        });
    }

    async run(message : Message, args : Array<string>)
    {
        const guild = message.guild;
        const name = message.author.username;
        const member = message.author;
        const filterChannelName = `${name}-commands`;

        if(!this.autorun.has(member.id))
        {
            this.autorun.set(member.id, false);
        }  

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
                
                wait(1000);
                message.member.addRole(role).then(() => 
                {

                });
            });
            const txtChannel = <TextChannel>channel;
            CodeChannelCommand.CodeChannels.set(channel.id, txtChannel);
            const embed = new RichEmbed()
            .setFooter(`para ver os comandos use: help`);
            var description = `Olá <@${member.id}>, bem vindo a instrução de como usar o **Code Channel**`;
            description += "\n" + "digite **Toggle** para ativar o auto run";
            embed.setDescription(description);
            const sentMessage = txtChannel.send(embed);
            sentMessage.then(newMessage => {
                (<Message>newMessage).pin();
            });
            var codes : string[] = new Array<string>();
            const collector = collectMessage(txtChannel, message.member.user, (m) => 
            {
                let args = m.content.split(/\s+/g);
                let command = args!.shift();
                if(this.actions.has(command!.valueOf()))
                {
                    this.actions.get(command!.valueOf())!(member, txtChannel, args);
                    return;
                }
                if(this.autorun.get(member.id) && m.content)
                {
                    const executedCode = m.content;
                    m.delete();
                    m.channel.send(`Codico Executado: ${CodeBlock(executedCode, "typescript")}`);
                    var code = m.content;
                    try
                    {
                        let evaluted = inspect(eval(code), {depth: 0 });
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
               }
            });
        });
    }
}