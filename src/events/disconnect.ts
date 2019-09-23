import { IBotEvent, Eval } from "../@types/Maytrix";
import { Message, Guild, Collection } from "discord.js";
import { inspect } from "util";
import { read } from "fs";
import { IBot } from "Maytrix";
// import CodeChannelCommand from "../commands/admin/codechannel";

export default class Disconnect extends IBotEvent
{
    constructor(client : IBot)
    {
        super(client);
    }

    on()
    {
        // CodeChannelCommand.CodeChannels.forEach((channel) => {
        //     channel.delete();
        // });
    }
}