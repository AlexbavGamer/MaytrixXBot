'use strict';
import { IBot, Command, IBotCommandConfig, IBotMessage } from '../../api'
import { Message, Client, CategoryChannel, DiscordAPIError, RichEmbed, MessageReaction, Collection, CollectorFilter, MessageEmbed } from 'discord.js';
import { inspect } from 'util';
import { timingSafeEqual } from 'crypto';
import { type } from 'os';
import youtubeSearch from "youtube-search";
import { parse } from 'path';

export default class extends Command
{
    constructor(client : IBot)
    {
        super(client, {
            aliases: ["procurar"],
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
                name: "search",
                category: "youtube",
                description: "search by sound name from youtube",
                usage: "[video name]"
            }
        });
    }

    run(message: Message, args: any[]): void {
        const { songName } : any = args;
        var opts : youtubeSearch.YouTubeSearchOptions = {
            maxResults: 10,
            key: this.client.config.youtubeapi
        };

        youtubeSearch(songName, opts, (err, res) => 
        {
            if(err)
            {
                return message.channel.send(err);
            }

            let videos = res!.slice(0, 10);

            let resp = '';

            for(var i in videos)
            {
                resp += `**[${parseInt(i)+1}]:** \`${videos[i].title}\`\n`;
            }

            resp += `\n**Escolha um numero entre \`1-${videos.length}\``;

            message.channel.send(resp);

            const filter = (m : Message) => !isNaN(parseInt(m.content)) && parseInt(m.content) < videos.length+1 && parseInt(m.content) > 0;
            const collector = message.channel.createMessageCollector(filter);

            collector.once('collect', (m) => {
                let video = videos[parseInt(m.content)-1];

                const embed = new RichEmbed();
                var description = '';
                description += `Video/Musica: \n${video.title}\n\n`;

                description += `Descrição: \n\`\`\`${video.description}\`\`\`\n`;

                description += `Data de Publicação: \`\`\`${video.publishedAt}\`\`\`\n`;
                
                description += `Clique [AQUI](${video.link}) para assistir`

                embed.setThumbnail(video.thumbnails.high!.url);

                embed.setDescription(description);

                message.channel.send(embed);

                this.client.commands.get('play')!.run(message, [ video.link ]);
            });
        });
    }
}