'use strict'
import { readdir, stat, read, readFile, exists, existsSync, readFileSync } from 'fs';
import { resolve, join, basename } from "path";
import { Permissions, Message, Client, User, Collection, CategoryChannel, PermissionString, ReactionEmoji, PermissionObject, PermissionResolvable, Channel, ClientUserGuildSettings, ClientUserSettings, Emoji, Guild, GuildMember, Snowflake, MessageReaction, RateLimitInfo, Role, UserResolvable, TextChannel, ClientUser, UserConnection } from "discord.js";
import { EventEmitter } from "events";
import * as express from 'express';
import methodOverride = require('method-override');
import { inspect } from "util";
import passport2 = require('passport-discord');
import passportDiscord = require('passport-discord');
import Strategy = passportDiscord.Strategy;
import { Application } from 'express';
import { RequestHandler } from 'express-serve-static-core';
import { IBotConfig, IBot, IBotCommandInterface, IBotCommandConfig } from "Maytrix";

export class ExpressPost
{
    app?: Application;
    routeName?: string;
    handlers?: RequestHandler[];
    constructor(app : Application, route: string, ...handlers: RequestHandler[])
    {
        this.app = app;
        this.routeName = route;
        this.handlers = handlers;
    }

    
    run(...args : Array<any>)
    {

    }
}

export class ExpressSubdomain
{
    app?: Application;
    routeName?: string;
    handlers?: RequestHandler[];
    constructor(app : Application, route: string, ...handlers: RequestHandler[])
    {

    }
}


export class ExpressRoute
{
    app?: Application;
    routeName?: string;
    handlers?: RequestHandler[];
    constructor(app : Application, route: string, ...handlers: RequestHandler[])
    {
        this.app = app;
        this.routeName = route;
        this.handlers = handlers;
    }

    run(...args : Array<any>)
    {

    }
}

export function hasPermission(member : GuildMember, permission : PermissionResolvable)
{
    if(!member)
    {
        return false;
    }
    return member.hasPermission(permission);
}

export function Eval(code : string)
{
    return inspect(eval(code), {depth : 0});
}


export type depCallback = (filePath : string, code : string) => any;
export async function getDependencies(cb : depCallback)
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
                    cb("@api/" + basename(file), data);
                });
            });
        }, [".ts"]);
    });
    await Promise.resolve(p);
    
}

export abstract class IBotEvent
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
    return readFileSync(join(__dirname, "../express/bot/example_command.ts"), 'utf-8');
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


export abstract class Command implements IBotCommandInterface
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



export type DoneFunction = (err : NodeJS.ErrnoException | string | null, files?: Array<string>) => void;



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