import { IUser } from './api'
import { Message, User, MessageReaction, Collector, PermissionObject, TextChannel } from 'discord.js';
import { promisify } from 'util';

const wait = promisify(setTimeout);

export const getRandomInt = (min: number, max: number): number => {
    return Math.floor(min + Math.random() * (max - min + 1))
}
export const getUserString = (user: IUser): string => {
    return `<@${user.id}>`
}

export type onCollectMessage = (m : Message) => void;
export function collectMessage(channel : TextChannel, user : User, onCollect : onCollectMessage)
{
    const filter = (m : Message) => 
    {
        return m.author.id == user.id;
    };

    const collector = channel.createMessageCollector(filter, {
        max: 9999
    });

    collector.on("collect", (m) => {
        onCollect(m);
    });

    collector.on("end", (m) => 
    {
        channel.send(`Deletando canal em 5 segundos`);
        wait(5000);
        channel.delete();
    });

    return collector;
}

export const allowAll : PermissionObject = {
    ADD_REACTIONS: true,
    ADMINISTRATOR: false,
    ATTACH_FILES: true,
    BAN_MEMBERS: false,
    CHANGE_NICKNAME: false,
    CONNECT: true,
    CREATE_INSTANT_INVITE: true,
    DEAFEN_MEMBERS: true,
    EMBED_LINKS: true,
    EXTERNAL_EMOJIS: true,
    KICK_MEMBERS: false,
    MANAGE_CHANNELS: false,
    MANAGE_EMOJIS: false,
    MANAGE_GUILD: false,
    MANAGE_MESSAGES: false,
    MANAGE_NICKNAMES: true,
    MANAGE_ROLES: false,
    MANAGE_ROLES_OR_PERMISSIONS: false,
    MANAGE_WEBHOOKS: false,
    MENTION_EVERYONE: true,
    MOVE_MEMBERS: false,
    MUTE_MEMBERS: false,
    PRIORITY_SPEAKER: true,
    READ_MESSAGES: true,
    READ_MESSAGE_HISTORY: true,
    SEND_MESSAGES: true,
    SEND_TTS_MESSAGES: true,
    SPEAK: true,
    USE_EXTERNAL_EMOJIS: true,
    USE_VAD: true,
    VIEW_AUDIT_LOG: true,
    VIEW_CHANNEL: true
};

export const denyAll : PermissionObject =
{
    ADD_REACTIONS: false,
    ADMINISTRATOR: false,
    ATTACH_FILES: false,
    BAN_MEMBERS: false,
    CHANGE_NICKNAME: false,
    CONNECT: false,
    CREATE_INSTANT_INVITE: false,
    DEAFEN_MEMBERS: false,
    EMBED_LINKS: false,
    EXTERNAL_EMOJIS: false,
    KICK_MEMBERS: false,
    MANAGE_CHANNELS: false,
    MANAGE_EMOJIS: false,
    MANAGE_GUILD: false,
    MANAGE_MESSAGES: false,
    MANAGE_NICKNAMES: false,
    MANAGE_ROLES: false,
    MANAGE_ROLES_OR_PERMISSIONS: false,
    MANAGE_WEBHOOKS: false,
    MENTION_EVERYONE: false,
    MOVE_MEMBERS: false,
    MUTE_MEMBERS: false,
    PRIORITY_SPEAKER: false,
    READ_MESSAGES: false,
    READ_MESSAGE_HISTORY: false,
    SEND_MESSAGES: false,
    SEND_TTS_MESSAGES: false,
    SPEAK: false,
    USE_EXTERNAL_EMOJIS: false,
    USE_VAD: false,
    VIEW_AUDIT_LOG: false,
    VIEW_CHANNEL: false
}