import {ExpressRoute, isAuthenticated, fileWalker, default as getDependencies} from '../../../@types/Maytrix'
import { getDefaultCommand } from "../../../@types/Maytrix";
import { Application, Response } from 'express';
import { Collection, Snowflake, Guild } from 'discord.js';
import * as path from 'path';
import { readFile } from 'fs';
export default class extends ExpressRoute
{
    dependencies : Map<any, any> = new Map<any, any>();
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
    }

    addToDep(filePath : string, code : string)
    {
        this.dependencies.set(filePath, code);
    }
    
    async run(req : Request, res: Response)
    {
        const guilds: Collection<Snowflake, Guild> = res.app.locals.botClient.client.guilds;
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
            },
            req: req
        });
    }
}