import { join, basename } from "path";
import expressLayouts = require('express-ejs-layouts');
import bodyParser = require('body-parser');
import sassMiddleware = require('node-sass-middleware');
import session = require('express-session');
import cookieSession = require('cookie-session');
import passport = require('passport');
import IUserB from './mongoose/schemas/User.interface';
import UserModel from "./mongoose/schemas/User.model";
import { fileWalker, ExpressPost, ExpressRoute } from "./@types/Maytrix";
import express = require("express");
import { Strategy } from "passport-discord";
import { Mongoose, SchemaType, SchemaTypes } from "mongoose";
import { IBot } from "Maytrix";
export default class ExpressHost {
    bot: IBot;
    app?: express.Application;
    constructor(bot: IBot) {
        this.bot = bot;
    }
    loadPosts() {
        fileWalker(join(__dirname, '/express/posts'), (err, files) => {
            if (err) {
                return console.log(err);
            }
            files!.forEach(file => {
                const postClass = require(file).default;
                const route = new postClass(this) as ExpressPost;
                const routeName = basename(file).split('.')[0];
                this.app!.post(route.routeName!, route.handlers!, (...args: Array<any>) => {
                    route.run(...args);
                });
                console.log(`Post ${routeName} foi registrado`);
            });
        });
    }
    loadRoutes() {
        fileWalker(join(__dirname, '/express/routes'), (err, files) => {
            if (err) {
                return console.log(err);
            }
            files!.forEach(file => {
                const routeClass = require(file).default;
                const route = new routeClass(this) as ExpressRoute;
                const routeName = basename(file).split('.')[0];
                this.app!.get(route.routeName!, route.handlers!, (...args: Array<any>) => {
                    route.run(...args);
                });
                console.log(`Route ${routeName} foi registrado`);
            });
        });
    }
    logErrors(err: NodeJS.ErrnoException, req: Request, res: express.Response, next: Function) {
        console.log(err.stack);
        next(err);
    }
    start() {
        this.app = express();
        this.loadRoutes();
        this.loadPosts();
        this.app.set('view engine', 'ejs');
        this.app.set('views', join(__dirname, '/express/views'));
        this.app.set('layout', join(__dirname, '/express/layouts/layout'));
        this.app.use(cookieSession({
            maxAge: 24 * 60 * 60 * 1000,
            keys: [this.bot.config.cookie.key]
        }));
        this.app.enable('trust proxy');
        this.bot.client.on('ready', () => {
            this.app!.set('title', this.bot.client.user.username);
            this.app!.locals.botClient = this.bot;
        });
        var discordStrat = new Strategy({
            clientID: eval(this.bot.config.clientId!),
            clientSecret: eval(this.bot.config.clientSecret!),
            callbackURL: "/auth/discord/callback",
            scope: ['identify', 'email', 'guilds', 'guilds.join']
        }, (_accessToken, _refreshToken, profile, done) => {
            
            var update = () => {
                UserModel.findOne({
                    'id': profile.id
                }, function(err, user)
                {
                    if(err)
                    {
                        return done(err);
                    }
                    if(!user)
                    {
                        user = new UserModel({
                            id: profile.id,
                            username: profile.username,
                            email: profile.email,
                            tag: profile.discriminator,
                            accessToken: _accessToken,
                            refreshToken: _refreshToken,
                        });
                        user.save(function(err)
                        {
                            if(err) return console.log(err);
                            return done(err, <IUserB>user);
                        });
                    }
                    else
                    {
                        return done(err, user);
                    }
                });
            };
            process.nextTick(() => {
                update();
            });
        });
        passport.use(discordStrat);
        this.app.use(session({
            secret: "keyboard cat",
            resave: true,
            saveUninitialized: true,
            cookie: {
                httpOnly: true,
                maxAge: 60 * 60 * 1000
            }
        }));
        this.app.use(passport.initialize());
        this.app.use(passport.session());
        passport.serializeUser((user: IUserB, done) => {
            done(null, user);
        });
        passport.deserializeUser(function (id, done) {
            UserModel.findById(id, (err, user: IUserB) => {
                done(err, user);
            });
        });
        this.app.use(sassMiddleware({
            src: __dirname + '/express/public',
            dest: join(__dirname, '/express/public'),
            debug: false
        }));
        this.app.get('/auth/discord', passport.authenticate('discord', {
            scope: ['identify', 'email', 'guilds', 'guilds.join'],
        }));
        this.app.get('/auth/discord/callback', (req, res, next) => {
            passport.authenticate("discord", { failureRedirect: "/auth/fail" }, (err, user: IUserB, info) => {
                req.login(user, (err) => {
                    return res.redirect('/guilds');
                });
                req.session 
            })(req, res, next);
        });
        this.app.use(bodyParser());
        this.app.use(expressLayouts);
        this.app.use(bodyParser.urlencoded({
            extended: true
        }));
        this.app.use('/node_modules/monaco-editor', express.static(join(__dirname, "../node_modules/monaco-editor")));
        this.app.use(express.static(__dirname + '/express/public'), (req, res, next) => {
            next();
        });
        const server = this.app.listen(3000, function () {
        });
        return this;
    }
}
