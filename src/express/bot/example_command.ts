import { Command } from "@api/Maytrix";
import { IBot, IBotCommandConfig } from "Maytrix";
import { Message, Channel, Guild } from "discord.js";
export default class MyCommand extends Command
{
    constructor(client : IBot)
    {
        super(client, {
            aliases: ["MUDE AQUI"],
            allowDMs: false,
            autodelete: 1000,
            cooldown: 1000,
            help:
            {
                category: "MUDE AQUI",
                name: "MUDE AQUI",
                usage: "MUDE AQUI",
                description: "MUDE AQUI"
            },
            permission: {
                level: [],
                creatorOnly: false
            }
        });
    }

    run(message : Message, args : Array<any>)
    {

    }
}