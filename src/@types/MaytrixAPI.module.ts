'use strict'
declare module 'MaytrixAPI'
{
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
    export type depCallback = (filePath : string, code : string) => any;

    export function isAuthenticated(req : express.Request, res : express.Response, next : Function) : boolean;

    export class ExpressPost
    {
        app?: express.Application;
        routeName?: string;
        handlers?: express.RequestHandler[];
        constructor(app : express.Application, route: string, ...handlers: express.RequestHandler[]);
        run(...args : any[]) : void;
    }

    export function getDefaultCommand() : string[];

    export class ExpressRoute
    {
        app?: express.Application
        routeName?: string
        handlers?: express.RequestHandler[]
        constructor(app : express.Application, route: string, ...handlers: express.RequestHandler[]);
        run(...args : Array<any>) : void;
    }

    export function Eval(code : string) : void;

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
        client : IBot
        constructor(client : IBot);

        on(...args : Array<any>) : void;
    }

    export function DoubleQuotes(text: string) : string;

    export function CodeBlock(text: string, type?: string) : string;
    export abstract class Command implements CommandInterface
    {
        run(message: Message, args: any[]): void;
        client : IBot
        conf: IBotCommandConfig;
        cooldown: Set<User>;
        message: Message;
        
        constructor(client : IBot, conf: IBotCommandConfig);
        
        startCooldown(user : User) : void;

        setMessage(message : Message) : void;

        respond(message : any) : void;

        checkUsage(message : Message) : void;

        run(message : Message, ...args : Array<any>) : void;
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



    export function fileWalker(dir : string, done : DoneFunction, includes?: string[]) : void;

    type MessageColor =
        [number, number, number]
        | number
        | string

    export interface IBotMessage {
        readonly user: IUser
        setTextOnly(text: string): IBotMessage
        addField(name: string, value: string): IBotMessage
        addBlankField(): IBotMessage
        setColor(color: MessageColor): IBotMessage
        setDescription(description: string): IBotMessage
        setFooter(text: string, icon?: string): IBotMessage
        setImage(url: string): IBotMessage
        setThumbnail(url: string): IBotMessage
        setTitle(title: string): IBotMessage
        setURL(url: string): IBotMessage
    }
}