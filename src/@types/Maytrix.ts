'use strict'
import { readdir, stat, read, readFile, exists, existsSync } from 'fs';
import { resolve, join } from "path";
import { Permissions, Message, Client, User, Collection, CategoryChannel, PermissionString, ReactionEmoji, PermissionObject, PermissionResolvable, Channel, ClientUserGuildSettings, ClientUserSettings, Emoji, Guild, GuildMember, Snowflake, MessageReaction, RateLimitInfo, Role, UserResolvable, TextChannel, ClientUser, UserConnection } from "discord.js";
import { EventEmitter } from "events";
import * as express from 'express';
import methodOverride = require('method-override');
import { inspect } from "util";
import passport2 = require('passport-discord');
import passportDiscord = require('passport-discord');
import Strategy = passportDiscord.Strategy;
import { CommandInterface , IBotConfig} from "iBotInterfaces";
export interface ILoggerMethod {
    (msg: string, ...args: any[]): void
    (obj: object, msg?: string, ...args: any[]): void
}

// MONACO EDITOR IMPORTS
export type depCallback = (filePath : string, code : string) => any;
export default async function getDependencies(cb : depCallback)
{
    const tmp_dep = Object.keys(require('../../package.json').dependencies);
    const p = tmp_dep.forEach((dep) => 
    {
        const packagePath = join(__dirname, "../../", "node_modules", dep);
        const typingsFolder = join(packagePath, "typings");
        const rootPath = join(__dirname, "../../", "node_modules", dep);

        const projectTypings = join(__dirname);

        if(dep.match("@types"))
        {
            if(existsSync(rootPath))
            {
                fileWalker(rootPath, (err, files) => {
                    if(err)
                    {
                        return console.log(err);
                    }
                    files!.forEach(file => {
                        readFile(file, 'utf-8', (err, data) => {
                            if(err) return console.log(err);
                            cb(file, data);
                        });
                    });
                }, [".d.ts"]);
            }
        }
        if(existsSync(typingsFolder))
        {
            const typingsIndexFile = join(typingsFolder, "index.d.ts");
            if(existsSync(typingsIndexFile))
            {
                readFile(typingsIndexFile, 'utf-8', (err, data) => {
                    if(err) return console.log(err);
                    cb(typingsIndexFile, data);
                });
            }
        }
        fileWalker(projectTypings, (err, files) => {
            if(err)
            {
                return console.log(err);
            }
            files!.forEach(file => {
                readFile(file, 'utf-8', (err, data) => {
                    if(err) return console.log(err);
                    cb(file, data);
                });
            });
        }, [".ts"]);
    });
    await Promise.resolve(p);
    
}

export function isAuthenticated(req : express.Request, res : express.Response, next : Function) : boolean
{
    if(req.isAuthenticated())
    {
        return true;
    }
    return false;
}

export class ExpressPost
{
    app?: express.Application;
    routeName?: string;
    handlers?: express.RequestHandler[];
    constructor(app : express.Application, route: string, ...handlers: express.RequestHandler[])
    {
        this.app = app;
        this.routeName = route;
        this.handlers = handlers;
    }

    
    run(...args : Array<any>)
    {

    }
}

export class ExpressRoute
{
    app?: express.Application;
    routeName?: string;
    handlers?: express.RequestHandler[];
    constructor(app : express.Application, route: string, ...handlers: express.RequestHandler[])
    {
        this.app = app;
        this.routeName = route;
        this.handlers = handlers;
    }

    run(...args : Array<any>)
    {

    }
}

export function Eval(code : string)
{
    return inspect(eval(code), {depth : 0});
}

export interface ILogger {
    debug: ILoggerMethod
    info: ILoggerMethod
    warn: ILoggerMethod
    error: ILoggerMethod
}

export interface IBotCommandConfig
{
    cooldown: number | 1000
    aliases: string[]
    allowDMs: boolean
    autodelete: number | boolean | undefined
    help: 
    {
        name: string | ""
        description: string | "No information specified."
        usage: string | ""
        category: string | "Information"
    }
    permission:
    {
        level: PermissionResolvable,
        creatorOnly: string | boolean | [string]
    }
}

export interface IBot {
    readonly commands: Collection<string, Command>
    readonly aliases: Collection<any, any>
    readonly logger: ILogger
    readonly allUsers: IUser[]
    readonly onlineUsers: IUser[]
    readonly client: Client;
    readonly events: Collection<string, Event>;
    
    botId: string;
    config: IBotConfig;

    readonly commandreactions: Collection<string, CommandReaction>;

    getCommandsFromCategory(Category : string) : Array<Command>

    restart() : Promise<void>
    start(logger: ILogger, config: IBotConfig, commandsPath: string, dataPath: string): void
}

export abstract class Event
{
    client! : IBot
    constructor(client : IBot)
    {
        this.client = client;
    }

    on(...args : Array<any>)
    {
        
    }
}

export function getDefaultCommand()
{
    readFile(join(__dirname, "../express/bot/example_command.ts"), 'utf-8', (err, data) => {
        if(err) { return console.log(err); }
        return data.split("\n");
    });
}

export function DoubleQuotes(text: string)
{
    return "||" + text + "||";
}

export function CodeBlock(text: string, type?: string)
{
    if(type!)
    {
        return "```" + `${type}\n` + text + "```";
    }
    return "```" + text + "```";
}
export abstract class Command implements CommandInterface
{
    run(message: Message, args: any[]): void {
        throw new Error("Method not implemented.");
    }
    client : IBot
    conf!: IBotCommandConfig;
    cooldown: Set<User>;
    message!: Message;
    
    constructor(client : IBot, conf: IBotCommandConfig)
    {
        this.client = client;

        this.conf = conf;

        this.cooldown = new Set();
    }
    
    startCooldown(user : User)
    {
        this.cooldown.add(user);

        setTimeout(() => {
            this.cooldown.delete(user);
        }, this.conf.cooldown);
    }

    setMessage(message : Message)
    {
        this.message = message;
    }

    respond(message : any)
    {
        this.message.channel.send(message);   
    }

    checkUsage(message : Message)
    {
        let usages = this.conf.help.usage.split(" ");
        var required : string[] = [];
        var optional : string[] = [];
        for(var usage of usages)
        {
            if(usage.startsWith("[") && usage.endsWith("]"))
            {
                required.push(usage.replace("[", "").replace("]", ""));
            }
            else if(usage.startsWith("<") && usage.endsWith(">"))
            {
                optional.push(usage.replace("<", "").replace(">", ""));
            }
        }

        return {required, optional};
    }

}

export interface IUser {
    id: string
    username: string
    discriminator: string
    tag: string
}

export type DoneFunction = (err : NodeJS.ErrnoException | string | null, files?: Array<string>) => void;

export interface CommandReaction
{
    category?: string
    reaction?: string | number,
    commands?: Collection<string, Command> | null
}



export function fileWalker(dir : string, done : DoneFunction, includes?: string[])
{
    let results : any = [];

    readdir(dir, (err, list) => {
        if(err) return done(err);

        var pending = list.length;

        if(!pending) return done(null, results);

        list.forEach((file) => 
        {
            file = resolve(dir, file);

            stat(file, (err, stat) => {
                if(stat && stat.isDirectory())
                {
                    fileWalker(file, (err, res) => 
                    {
                        results = results.concat(res);
                        if(!--pending) done(null, results);
                    });
                }
                else
                {
                    if(includes == undefined)
                    {
                        results.push(file);
                    }
                    else
                    {
                        if(includes!.some(e => file.endsWith(e)))
                        {
                            results.push(file);
                        }
                    }
                    if(!--pending) done(null, results);
                }
            });
        });
    });
}