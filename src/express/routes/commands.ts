import {ExpressRoute, Command} from '@api/Maytrix'
import { Application, Response } from 'express';
import CommandModel from '../../mongoose/schemas/Command.model';
import ICommand from '../../mongoose/schemas/Command.interface';
import { Collection, Snowflake, Guild } from 'discord.js';

export default class extends ExpressRoute
{
    Commands : ICommand[] = [];
    constructor(app : Application)
    {
        super(app, "/commands", (req, res, next) =>
        {
            if(req.isAuthenticated())
            {
                next();
            }
            else
            {
                res.render('error', 
                {
                    req: req,
                    'layout': '../layouts/layout',
                    main:
                    {
                        title: "Acesso negado",
                        message: "Você não está permitido"
                    }
                });
            }
        });
    }

    async run(req : Request, res: Response)
    {
        CommandModel.find({}, (err, res) => {
            this.Commands = res;
        });
        const guilds: Collection<Snowflake, Guild> = res.app.locals.botClient.client.guilds;
        res.render('commands',
        {
            req: req,
            main:
            {
                title: 'Comandos das Guildas'
            },
            data:
            {
                commands: this.Commands,
                guilds: guilds
            }
        });
    }
}