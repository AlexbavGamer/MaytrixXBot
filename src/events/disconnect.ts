import { Event, IBot, Eval } from "../api";
import { Message, Guild, Collection } from "discord.js";
import { inspect } from "util";
import { read } from "fs";
import CodeChannelCommand from "../commands/admin/codechannel";

export default class Disconnect extends Event
{
    constructor(client : IBot)
    {
        super(client);
    }

    on()
    {
        CodeChannelCommand.CodeChannels.forEach((channel) => {
            channel.delete();
        });
    }
}