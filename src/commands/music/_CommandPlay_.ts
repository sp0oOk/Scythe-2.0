import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction, MessageEmbed } from "discord.js";
import { PCommand } from "../../interfaces/PCommand";
import { errorEmbed, primary, single, successEmbed } from "../../misc/PUtilities";
import { Customize } from "../../config.json";
import { player } from "../../main";
import { Queue, Song } from "discord-music-player";

export const _CommandPlay_: PCommand = {
    category: "Music",
    aliases: [],
    deletedPostExecution: false,
    cooldown: 0,
    defaults: [],
    usage: "/play <url | search-term>",
    examples: ["\`/play faded\`"],
    details: "",
    premium: false,
    data: new SlashCommandBuilder()
        .setName("play")
        .addStringOption((opt) => opt.setName("args").setDescription("The song URL or NAME to search for and play!").setRequired(true))
        .setDescription("Attempts to play a song in the guild"),
    execute: async (client: Client, interaction: CommandInteraction | any) => {
        let search: string | null = interaction.options.getString("args");
        let queue: Queue = player.createQueue(interaction.guild?.id!);
        await queue.join(interaction.member.voice.channel).catch(error => { interaction.followUp({ content: "unable to join voice channel" }) });
        const song: Song | void | any = await queue.play(search!).catch(_ => { 
            if(!player.getQueue(interaction.guild?.id!))
                queue.stop();
        });
        
        if(song === undefined || song === null)
            return interaction.followUp({ content: null, embeds: [errorEmbed(`Could not find any song for the arguments provided! (\`${search}\`)`)] });

        if(player.getQueue(interaction.guild?.id!)?.songs.length! - 1 >= 1)
            return interaction.followUp({ content: null, embeds: [successEmbed(`Successfully added \`${song}\` by \`${song.author}\` to the queue!`)] });

        const embed: MessageEmbed = new MessageEmbed();
        embed.setAuthor(`\🎵 Music ⦁ ${song}`);
        embed.setDescription(`▬▬▬▬▬▬▬▬▬▬▬▬▬▬ ${song.duration.replace(/\d+/g, 0)}/${song.duration}`);
        embed.setColor(primary);
        embed.setThumbnail(song.thumbnail);
        embed.setFooter(Customize["embed-footer"]);
        embed.addField(`Requester`, ` ${single}${interaction.user.username}${interaction.user.discriminator}`, true);
        embed.addField(`Author`, ` ${single}${song.author}`, true);
        embed.addField(`Volume`, ` ${single}100/150`, true);

        interaction.followUp({ content: null, embeds: [embed] });

    }
}