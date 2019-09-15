import {ExpressRoute, isAuthenticated} from '../../@types/Maytrix'
import { Application, Response, Request } from 'express';

export default class extends ExpressRoute
{
    constructor(app : Application)
    {
        super(app, "/logout", (req, res, next) =>
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
                        title: "Você não está logado",
                        message: "Desculpe, mas você não está logado"
                    }
                });
            }
        });
    }

    run(req : Request, res: Response)
    {
        req.logout();
        res.redirect('/');
    }
}