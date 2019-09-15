import {ExpressRoute, isAuthenticated} from '../../@types/Maytrix'
import { Application, Response } from 'express';

export default class extends ExpressRoute
{
    constructor(app : Application)
    {
        super(app, "/", (req, res, next) =>
        {
            if(req.isAuthenticated())
            {
                next();
            }
            else
            {
                next();
            }
        });
    }

    run(req : Request, res: Response)
    {
        res.render('index',
        {
            main:
            {
                title: 'Início'
            },
            req: req
        });
    }
}