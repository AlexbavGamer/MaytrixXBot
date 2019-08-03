import * as discord from 'discord.js'
import * as path from 'path'
import { IBot, ILogger, fileWalker, Command, CommandReaction, Event } from './api'
import { IBotConfig } from "iBotInterfaces";
import ExpressHost from './ExpressHost';
import { readFile, exists } from 'fs';

export class Bot implements IBot {
    getCommandsFromCategory(Category: string): Command[] {
        let Commands: Command[] = [];

        this._commands.forEach(cmd => {
            if (cmd.conf.help.category == Category) {
                Commands.push(cmd);
            }
        });

        return Commands;
    }
    public get aliases() {
        return this._aliases;
    }

    public get commandreactions() {
        return this._commandreactions;
    }

    public get commands() {
        return this._commands;
    }

    public get client() {
        return this._client;
    }

    public get config() {
        return this._config;
    }

    public get events() {
        return this._events;
    }

    public set botId(value: string) {
        this._botId = value;
    }

    public get botId() {
        return this._botId;
    }


    public get logger() { return this._logger }

    public get allUsers() { return this._client ? this._client.users.array().filter((i) => i.id !== '1') : [] }

    public get onlineUsers() { return this.allUsers.filter((i) => i.presence.status !== 'offline') }

    private readonly _commands: discord.Collection<string, Command> = new discord.Collection();
    private readonly _aliases: discord.Collection<any, any> = new discord.Collection();
    private readonly _events: discord.Collection<string, Event> = new discord.Collection();
    private _commandreactions: discord.Collection<string, CommandReaction> = new discord.Collection();
    private _client!: discord.Client
    private _config!: IBotConfig
    private _logger!: ILogger
    private _botId!: string
    private express!: ExpressHost;

    public restart(): Promise<void> {
        return new Promise<void>(() => {
            setTimeout(function (client: IBot) {
                client.client.destroy().then(() => {
                    client.client.login(client.config.token);

                });
            }, 15000, this);
        });
    }

    public start(logger: ILogger, config: IBotConfig, commandsPath: string, eventsPath: string) {
        this._logger = logger;
        this._config = config;

        this.loadCommands(commandsPath);
        this.loadEvents(eventsPath);

        if (!this._config.token) {
            throw new Error('invalid discord token');
        }

        this._client = new discord.Client();

        this._client.login(this._config.token);

        this.express = new ExpressHost(this);
        this.express.start();

        if (config.Mongoose.enabled) {
        }


    }

    private loadEvents(eventsPath: string) {
        fileWalker(eventsPath, (err, files) => {
            if (err) {
                return console.log(err);
            }

            files!.forEach(file => {
                const eventClass = require(file).default
                const event = new eventClass(this) as Event

                const eventName = path.basename(file).split('.')[0];
                this.events.set(eventName, event);
                this._client.on(eventName, (...args: Array<any>) => {
                    event.on(...args);
                });
                delete require.cache[file];
            });
        }, [".ts"]);
    }

    public registerCustomCommand() {
    }


    private loadCommands(commandsPath: string) {
        fileWalker(commandsPath, (err, files) => {
            if (err) return console.log(err);

            files!.forEach(file => {
                var basePath = path.dirname(file);
                var ext = path.extname(file);

                if (ext == ".ts") {
                    delete require.cache[file];
                    const cmdClass = require(file).default;
                    const command = new cmdClass(this) as Command;
                    this.commands.set(command.conf.help.name, command);
                    command.conf.aliases.forEach(a => this._aliases.set(a, command.conf.help.name));

                    //emoji category
                    var existCategory = this._commandreactions.has(command.conf.help.category);
                    if (!existCategory) {
                        exists(path.join(basePath, "emote.txt"), (exists) => {
                            if (exists) {
                                readFile(path.join(basePath, "emote.txt"), { encoding: 'utf8' }, (err, content) => {
                                    if (err) return console.log(err);
                                    const reaction = <CommandReaction>{
                                        category: command.conf.help.category,
                                        reaction: content,
                                        commands: new discord.Collection<string, Command>()
                                    };
                                    reaction.commands!.set(command.conf.help.name, command);
                                    this._commandreactions.set(command.conf.help.category, reaction);
                                });
                            }
                        });
                    }
                    this._logger.info(`Comando ${command.conf.help.name} carregado`);
                }
            });
        });
    }
}