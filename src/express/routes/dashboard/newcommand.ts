import {ExpressRoute, fileWalker, getDependencies, hasPermission} from '../../../@types/Maytrix'
import { getDefaultCommand } from "../../../@types/Maytrix";
import { Application, Response } from 'express';
import { Collection, Snowflake, Guild } from 'discord.js';
import * as path from 'path';
import { readFile } from 'fs';
import IUser from 'src/mongoose/schemas/User.interface';
export default class extends ExpressRoute
{
    dependencies : Map<any, any> = new Map<any, any>();
    default_command !: string;
    constructor(app : Application)
    {
        super(app, "/guilds/newcommand", (req, res, next) =>
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
                    layout: '../layouts/layout',
                    main:
                    {
                        title: "Acesso negado",
                        message: "Você não está permitido"
                    }
                });
            }
        });

        getDependencies((filePath, code) => 
        {
            this.addToDep(filePath, code);
        });

        this.default_command = getDefaultCommand();
    }

    addToDep(filePath : string, code : string)
    {
        this.dependencies.set(filePath, code);
    }
    
    async run(req : Express.Request, res: Response)
    {
        var user : IUser = <IUser>req.user;
        var guilds : Collection<Snowflake, Guild> = (<Collection<Snowflake, Guild>>res.app.locals.botClient.client.guilds).filter(g => g.ownerID == req.user.id || hasPermission(g.members.get(user.id)!, ["MANAGE_ROLES_OR_PERMISSIONS"]));
        var members = guilds.map(g => g.members.array());
        res.render('dashboard/newcommand',
        {
            main:
            {
                title: 'Registrando um Comando'
            },
            data:
            {
                guilds: guilds,
                dependencies: this.dependencies,
                command: this.default_command
            },
            req: req
        });
    }
}