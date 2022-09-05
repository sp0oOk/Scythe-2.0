import { SlashCommandBuilder } from "@discordjs/builders";
import { BufferResolvable, Client, CommandInteraction, MessageEmbed } from "discord.js";
import { PCommand } from "../../interfaces/PCommand";
import { errorEmbed, primary } from "../../misc/PUtilities";
import { Customize, Auth } from "../../config.json";
import { player } from "../../main";
import { Song } from "discord-music-player";
import { getSong } from "genius-lyrics-api";

export const _CommandLyrics_: PCommand = {
    category: "Music",
    aliases: [],
    deletedPostExecution: false,
    cooldown: 0,
    defaults: [],
    usage: "/lyrics [\"song-name\"] [\"song-artist\"]",
    examples: ["\`/lyrics\`", "\`/lyrics faded\`"],
    details: "",
    premium: true,
    data: new SlashCommandBuilder()
        .setName("lyrics")
        .addStringOption((opt) => opt.setName("song").setDescription("The name of the song to fetch lyrics for!").setRequired(false))
        .addStringOption((opt) => opt.setName("artist").setDescription("Artist variable to make searches more accurate (not needed)").setRequired(false))
        .setDescription("Attempts to obtain lyrics about the playing song or a provided argument!"),
    execute: async (client: Client, interaction: CommandInteraction) => {
        let song: string | null | Song | undefined | any = interaction.options.getString("song");
        let artist: string | null = interaction.options.getString("artist");
        let attachment: BufferResolvable | null = null;
        let duration: number = performance.now();
        if(song === null && !player.getQueue(interaction.guild?.id!)) return void interaction.followUp({ content: null, embeds: [errorEmbed(`The guild queue does not exist, and a song-name argument was not provided!`)] });
        if(song === null && player.getQueue(interaction.guild?.id!))
            song = player.getQueue(interaction.guild?.id!)?.songs[0];
        if(song instanceof Song)
            await getSong({ apiKey: Auth["genius-key"], title: song.name, artist: song.author, optimizeQuery: true  }).then((l: any) => { song = l; }).catch(error => song = null);
        else
            await getSong({ apiKey: Auth["genius-key"], title: song!, artist: artist === null ? "" : artist!, optimizeQuery: true }).then((l: any) => { song = l; }).catch(error => song = null);
        if(song === null) return void interaction.followUp({ content: null, embeds: [errorEmbed(`Unable to fetch song data for the argument provided!`)] });
        const embed: MessageEmbed = new MessageEmbed();
        embed.setTitle(`\🎵 ${song.title!} | Lyrics`);
        embed.setThumbnail(song.albumArt!);
        embed.setDescription(`Here are the lyrics/information for [${song.title!}](${song.url!}), fetched in \`${Math.round(performance.now() - duration + Number.EPSILON) * 100 / 100}ms\`\n\`\`\`${song.lyrics!}\`\`\``);
        embed.setColor(primary);
        embed.setFooter(Customize["embed-footer"] + ` (Genius ID: ${song.id!})`);
        if(embed.description?.length! >= 2000) {
            embed.setDescription(`Here are the lyrics/information for [${song.title!}](${song.url!}), fetched in \`${Math.round(performance.now() - duration + Number.EPSILON) * 100 / 100}ms\`\nLyrics were attached above as it exceeded the \`2000\` character limit!`);
            attachment = Buffer.from(song.lyrics!, 'utf-8');
        }
        return void interaction.followUp({ content: null, embeds: [embed], files: attachment === null ? undefined : [{ attachment: attachment, name: 'lyrics.txt' }] });
    }
}