import { IBot, Command, IBotCommandConfig, IBotMessage } from '../../api'
import { Message, VoiceConnection, Client, CategoryChannel, DiscordAPIError, RichEmbed, MessageReaction, Collection, CollectorFilter, MessageEmbed } from 'discord.js';
import { inspect } from 'util';
import { timingSafeEqual } from 'crypto';
import { type } from 'os';
import ytdl from "ytdl-core";
import { parse } from 'path';
import Ready from '../../events/ready';
import youtubeSearch from 'youtube-search';
import { connect } from 'mongoose';

function SearchAndPlay(key : string, connection : VoiceConnection, message : Message, args : Array<string>, isQueue : boolean)
{
    var server = Ready.servers[message.guild.id];
    if(link_type.includes(args.join(" ")))
    {
        var videoInfo : ytdl.videoInfo;
        ytdl.getBasicInfo(args.join(" ")).then(vInfo => videoInfo = vInfo);
        const embed = new RichEmbed();
                    
        var description = `Video/Musica: \n${videoInfo!.title}\n\n`;

        description += `Descrição: \n\`\`\`${videoInfo!.description}\`\`\`\n`;

        description += `Data de Publicação: \`\`\`${videoInfo!.timestamp}\`\`\`\n`;
                    
        description += `Clique [AQUI](${videoInfo!.video_url}) para assistir`

        embed.setThumbnail(videoInfo!.thumbnail_url);

        embed.setDescription(description);

        message.channel.send(embed);
        if(server.dispatcher == null)
        {
            var dispatcher = connection.playStream(ytdl(`${args}`, {filter: 'audioonly'}));
            dispatcher.on("end", (reason) => 
            {
                if(server.queue[0])
                {
                    if(server.loop)
                    {
                        SearchAndPlay(key, connection, message,server.queue[0], true);
                    }
                    else
                    {
                        SearchAndPlay(key, connection, message,server.queue[0], false);                                
                    }
                }
                else{
                    connection.disconnect();
                    var currentSong = videoInfo.title;
                    server.queue = [];
                    server.info = [];
                    message.channel.send(`Musica \`\`${currentSong}\`\` Parada`).then(async x => {
                        var msg = <Message>x;

                        msg.reply(`Rasão: ${reason}`);
                    });
                }
            });
        }
    
    }
    else
    {
        youtubeSearch(args.join(" "), {
            maxResults: 1,
            key: key 
        }, (err, result) => {
            if(err)
            {
                return message.channel.send(`ERR: ${err.message}`);
            }
            let video  = result![0];
            var videoInfo = ytdl.getInfo(`${video.link}`);
            videoInfo.then((info) => {
                if(server.dispatcher == null)
                {
                    server.queue.push(video.link);
                    var dispatcher = connection.playStream(ytdl(video.id, {filter: "audioonly"}));
                    server.dispatcher = dispatcher;
                    const embed = new RichEmbed();
                    
                    var description = `Video/Musica: \n${video.title}\n\n`;

                    description += `Descrição: \n\`\`\`${video.description}\`\`\`\n`;

                    description += `Data de Publicação: \`\`\`${video.publishedAt}\`\`\`\n`;
                    
                    description += `Clique [AQUI](${video.link}) para assistir`

                    embed.setThumbnail(video.thumbnails.high!.url);

                    embed.setDescription(description);

                    message.channel.send(embed);

                    dispatcher.on("end", (reason) => {
                        if(server.queue[0])
                        {
                            if(server.loop)
                            {
                                SearchAndPlay(key, connection, message,server.queue[0], true);
                            }
                            else
                            {
                                SearchAndPlay(key, connection, message,server.queue[0], false);                                
                            }
                        }
                        else{
                            connection.disconnect();
                            var currentSong = video.title;
                            server.queue = [];
                            server.info = [];
                            message.channel.send(`Musica \`\`${currentSong}\`\` Parada`).then(async x => {
                                var msg = <Message>x;

                                msg.reply(`Rasão: ${reason}`);
                            });
                        }
                    });
                }
            }).catch(err => {
                if(err) {
                    connection.disconnect();
                    message.channel.send(`${message.author} Error: ${err}`);
                    return console.log(err);
                }
            });
        });
    }
}

const link_type = [
    'https://',
    'http://'
];

export default class extends Command
{
    constructor(client : IBot)
    {
        super(client, {
            aliases: ["tocar", "youtube"],
            allowDMs: false,
            cooldown: 1000,
            autodelete: false,
            permission:
            {
                level: "READ_MESSAGES",
                creatorOnly: false,
            },
            help:
            {
                name: "play",
                category: "youtube",
                description: "tocar qualquer video por link ou nome",
                usage: "[video name or link]"
            }
        });
    }

    async run(message : Message, args : Array<string>)
    {
        if(message.member.voiceChannel){
            if(!message.guild.voiceConnection)
            {
                if(!Ready.servers[message.guild.id])
                {
                    Ready.servers[message.guild.id] = {queue: [], info: [], loop: false}
                }
                message.member.voiceChannel.join().then(async(connection) => 
                {
                    var server = Ready.servers[message.guild.id];
                    SearchAndPlay(this.client.config.youtubeapi!,connection, message, args, false);
                })
            }
        }
    }
}