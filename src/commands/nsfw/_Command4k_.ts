import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction, MessageEmbed } from "discord.js";
import got from "got";
import { PCommand } from "../../interfaces/PCommand";
import { errorEmbed, primary } from "../../misc/PUtilities";

export const _Command4k_: PCommand = {
    category: "NSFW",
    aliases: [],
    deletedPostExecution: false,
    cooldown: 0,
    defaults: [],
    usage: "/4k",
    examples: [],
    details: "",
    premium: false,
    data: new SlashCommandBuilder()
        .setName("4k")
        .setDescription("Returns a lewd NSFW picture in 4k!"),
    execute: async (client: Client, interaction: CommandInteraction | any) => {
        if(!interaction.channel.nsfw) return void interaction.followUp({ content: null, embeds: [errorEmbed(`This channel is not marked as a **\`NSFW\`** channel!`)] });
        got("https://nekobot.xyz/api/image?type=4k").then(response => {
            if(response.statusCode !== 200) return void interaction.followUp({ content: null, embeds: [errorEmbed(`An internal API error occurred! \`${response.statusMessage}\``)] });
            let res: any = JSON.parse(response.body);
            const embed: MessageEmbed = new MessageEmbed();
                embed.setColor(primary);
                embed.setImage(res.message);
            return void interaction.followUp({ content: null, embeds: [embed] });
        });
    }
}