import { ExpressRoute, ExpressPost } from '../../api'
import { Application, Response, Request } from 'express';
import { Guild, Collection, Snowflake } from 'discord.js';
import CommandSchema from '../../mongoose/schemas/Command.model';
import { stringify } from 'querystring';
import ICommand from '../../mongoose/schemas/Command.interface';
import CommandModel from '../../mongoose/schemas/Command.model';
import * as Mongoose from 'mongoose';

export default class extends ExpressPost
 {
    constructor(app: Application) {
        super(app, "/newcommand", (req, res, next) => 
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
        const enabled : boolean = req.body.enabled;
        const filename : string = req.body.filename;
        const guildid : string = req.body.guildid;
        const code : [string] = req.body.code;

        if(filename.endsWith('.ts'))
        {
            var Command = new CommandModel({
                _id: Mongoose.Types.ObjectId(),
                guildid: guildid,
                filename: filename,
                code: code,
                enabled: enabled
            }).save().then(value => {
                console.log(value);
            });
        }
    }
}