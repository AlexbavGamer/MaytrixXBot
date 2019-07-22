import { Event, IBot, Eval } from "../api";
import { Message } from "discord.js";
import { inspect } from "util";

export default class Ready extends Event
{
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
    }
}