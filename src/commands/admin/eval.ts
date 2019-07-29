import { IBot, Command, IBotCommandConfig, IBotMessage } from '../../api'
import { Message, Client, CategoryChannel, DiscordAPIError, RichEmbed, MessageReaction, Collection } from 'discord.js';
import { inspect } from 'util';
export default class EvalCommand extends Command 
{
    forbidden_evals : Collection<string, boolean> = new Collection();
    constructor(client : IBot)
    {
        super(client, 
        {
            aliases: ["e", "executar"],
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
                name: "eval",
                category: "admin",
                description: "Execute TypeScript Code or JavaScript Code",
                usage: "[code]"
            }
        });
        this.forbidden_evals.set("this.client.config", true); 
    }

    async run(message : Message, args : Array<string>)
    {
        let toEval = args.join(" ");
        let evaluted = inspect(eval(toEval), { depth: 0});

        let forbiddens = this.forbidden_evals.map((b, key) => b ? key : undefined);

        for(var forbidden of forbiddens)
        {
            if(forbidden!.includes(toEval))
            {
                return message.channel.send("Não foi possivel executar: ``ESSE CODIGO NÂO È PERMITIDO``");
            }
        }

        try
        {
            if(!toEval)
            {
                message.channel.send("Não foi possivel executar: ``não posso executar nenhum codigo``");
            }
            else
            {
                let hrStart = process.hrtime();
                let hrDiff;

                hrDiff = process.hrtime(hrStart);
                return message.channel.send(`*Executado em ${hrDiff[0] > 0 ? `${hrDiff[0]}s` : ''}${hrDiff[1] / 1000000}ms.*\`\`\`javascript\n${evaluted}\n\`\`\``);
            }
        }
        catch(e)
        {
            message.channel.send(`Não foi possivel executar: \'${e.message}\'`);
        }
        finally
        {

        }
    }
}