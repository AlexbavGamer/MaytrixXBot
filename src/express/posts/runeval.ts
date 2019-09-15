import { ExpressRoute, ExpressPost } from '../../@types/Maytrix'
import { Application, Response, Request } from 'express';
import { Guild, Collection, Snowflake } from 'discord.js';
import CommandSchema from '../../mongoose/schemas/Command.model';
import { stringify } from 'querystring';
import ICommand from '../../mongoose/schemas/Command.interface';
import CommandModel from '../../mongoose/schemas/Command.model';
import * as Mongoose from 'mongoose';
import * as ts from 'typescript';

export default class extends ExpressPost
 {
    constructor(app: Application) {
        super(app, "/runeval", (req, res, next) => 
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
        let code : string = req.body.codes.join("\n");
        let result = ts.transpile(code);
        let runnable : any = eval(result);

        console.log(runnable);
    }
}