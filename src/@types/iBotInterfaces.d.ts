declare module "iBotInterfaces"
{
    import { Message } from "discord.js";

    export interface CommandInterface
    {
        run(message : Message, args: any[]) : void;
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
}
