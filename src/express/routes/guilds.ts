import { ExpressRoute, hasPermission } from '../../@types/Maytrix'
import { Guild, Collection, Snowflake, SnowflakeUtil, GuildMember, PermissionResolvable } from 'discord.js';
import CommandSchema from '../../mongoose/schemas/Command.model';
import { stringify } from 'querystring';
import ICommand from '../../mongoose/schemas/Command.interface';
import { Application, Response } from 'express';
import IUser from 'src/mongoose/schemas/User.interface';
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


        
    async run(req: Express.Request, res: Response) 
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
        var user : IUser = <IUser>req.user;
        var guilds : Collection<Snowflake, Guild> = (<Collection<Snowflake, Guild>>res.app.locals.botClient.client.guilds).filter(g => g.ownerID == req.user.id || hasPermission(g.members.get(user.id)!, ["MANAGE_ROLES_OR_PERMISSIONS"]));
        var members = guilds.map(g => g.members.array());

        
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