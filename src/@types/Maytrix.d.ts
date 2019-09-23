
declare module "Maytrix"
{
    import { Collection, Client, Message, GuildMember } from "discord.js";
    import { Command, IBotEvent } from "@api/Maytrix";
    import { PermissionResolvable } from "discord.js";

    export interface IUser
    {
        id: string,
        username: string,
        discriminator: string
        tag: string
    }

    export interface ILoggerMethod 
    {
        (msg: string, ...args: any[]): void
        (obj: object, msg?: string, ...args: any[]): void
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

    export interface IBotConfig
    {
        token: string;
        prefix: string;
        creatorId: string;
        game?: string;
        username?: string;
        clientId?: string;
        Mongoose: {
            enabled: boolean;
            url: string;
        };
        cookie: {
            key: string;
        };
        restartTime?: number;
        youtubeapi?: string;
        clientSecret?: string;
        activitys?: string[];
    }

    export function hasPermission(member : GuildMember, permission : PermissionResolvable) : boolean;

    interface IBot {
        readonly commands: Collection<string, Command>
        readonly aliases: Collection<any, any>
        readonly logger: ILogger
        readonly allUsers: IUser[]
        readonly onlineUsers: IUser[]
        readonly client: Client;
        readonly events: Collection<string, IBotEvent>;
        
        botId: string;
        config: IBotConfig;

        readonly commandreactions: Collection<string, CommandReaction>;

        getCommandsFromCategory(Category : string) : Array<Command>

        restart() : Promise<void>
        start(logger: ILogger, config: IBotConfig, commandsPath: string, dataPath: string): void
    }

    interface CommandReaction
    {
        category?: string
        reaction?: string | number,
        commands?: Collection<string, Command> | null
    }

    interface IBotCommandInterface
    {
        run(message : Message, args: any[]) : void;
    }
}