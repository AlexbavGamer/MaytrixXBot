import { ExpressRoute } from '../../@types/Maytrix'
import { Application, Response } from 'express';
import { Guild, Collection, Snowflake } from 'discord.js';
import CommandSchema from '../../mongoose/schemas/Command.model';
import { stringify } from 'querystring';
import ICommand from '../../mongoose/schemas/Command.interface';

export default class extends ExpressRoute 
{
    Commands: Collection<String, Array<ICommand>> = new Collection<String, Array<ICommand>>();

    constructor(app: Application) {
        super(app, "/guilds/", (req, res, next) => 
        {
            if (req.isAuthenticated()) {
                next();
            }
            else
            {
                res.render('error', 
                {
                    req: req,
                    layout: '../layouts/layout',
                    main:
                    {
                        title: "Acesso negado",
                        message: "Você não está permitido"
                    }
                });
            }
        });
        
    }

    async run(req: Request, res: Response) 
    {
        CommandSchema.find({}, (err : NodeJS.ErrnoException, data) => {
            if(err)
            {
                return console.log(err);
            }
            data.forEach(cmd => {
                const guildid = cmd.guildid;
                if(!this.Commands.has(guildid))
                {
                    var arr = new Array<ICommand>();
                    arr.push(cmd);
                    this.Commands.set(cmd.guildid, arr);
                }
                else
                {
                    var arr = <ICommand[]>this.Commands.get(cmd.guildid);
                    arr.push(cmd);
                }
            });
        });
        const guilds: Collection<Snowflake, Guild> = res.app.locals.botClient.client.guilds;
        res.render('guilds',
            {
                req: req,
                main:
                {
                    title: `Servidores`
                },
                data: {
                    guilds: guilds,
                    commands: this.Commands
                }
            });
    }
}