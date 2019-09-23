import {ExpressRoute} from '../../@types/Maytrix'
import { Application, Response } from 'express';

export default class extends ExpressRoute
{
    constructor(app : Application)
    {
        super(app, "/settings", (req, res, next) =>
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

    run(req : Request, res: Response)
    {
        res.render('settings',
        {
            req: req,
            main:
            {
                title: 'Configurações'
            }
        });
    }
}