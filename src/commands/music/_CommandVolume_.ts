import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction } from "discord.js";
import { PCommand } from "../../interfaces/PCommand";
import { player } from "../../main";
import { successEmbed } from "../../misc/PUtilities";

export const _CommandVolume_: PCommand = {
    category: "Music",
    aliases: [],
    deletedPostExecution: false,
    cooldown: 0,
    defaults: [],
    usage: "/volume <1-150>",
    examples: [],
    details: "",
    premium: true,
    data: new SlashCommandBuilder()
        .setName("volume")
        .addNumberOption((opt) => opt.setName("integer").setDescription("Number to set volume for bot too (1-150)").setRequired(true))
        .setDescription("Changes volume of bot in the guild"),
    execute: async (client: Client, interaction: CommandInteraction) => {
        let amt: number | null = interaction.options.getNumber("integer");
        if(amt! > 150)
            amt = 150;
        if(amt! < 1)
            amt = 1;
        player.getQueue(interaction.guild?.id!)?.setVolume(amt!);
        return void interaction.followUp({ content: null, embeds: [successEmbed(`The volume of the bot in \`${interaction.guild?.name}\` has been set to **\`${amt!}\`**!`)] }); 
    }
}