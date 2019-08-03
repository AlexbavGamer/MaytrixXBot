import { Event, IBot, Eval } from "../api";
import { Message, Guild, Collection } from "discord.js";
import { inspect } from "util";
import { read } from "fs";

export default class Ready extends Event
{
    static servers: any;
    constructor(client : IBot)
    {
        super(client);
    }

    on()
    {
        this.client.botId = this.client.client.user.id
        if (this.client.config.game) {
            this.client.client.user.setGame(this.client.config.game!);
        }
        if(this.client.config.activitys)
        {
            setInterval(() => 
            {
                let active = this.client.config.activitys![Math.floor(Math.random() * this.client.config.activitys!.length)];
                const result = inspect(eval(active), { depth: 0 }).replace("'", '').replace("'", "");
                this.client.client.user.setActivity(result, { type: "STREAMING" });
            }, 1000);
        }
        if (this.client.config.username && this.client.client.user.username !== this.client.config.username) 
        {
            this.client.client.user.setUsername(this.client.config.username);
        }
        this.client.client.user.setStatus('online')
        this.client.logger.info('started...')
        Ready.servers = {}

        this.client.commands.forEach(command =>
        {
            var existCategory = this.client.commandreactions.has(command.conf.help.category);
            if (existCategory) {
                const reactionList = this.client.commandreactions.get(command.conf.help.category);
                if (reactionList!.category == command.conf.help.category) {
                    reactionList!.commands!.set(command.conf.help.name, command);
                    this.client.commandreactions.set(command.conf.help.category, reactionList!);
                }
            }
        });
    }
}