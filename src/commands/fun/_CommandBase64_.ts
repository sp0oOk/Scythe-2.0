import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction } from "discord.js";
import { PCommand } from "../../interfaces/PCommand";
import { successEmbed } from "../../misc/PUtilities";

export const _CommandBase64_: PCommand = {
    category: "Fun",
    aliases: [],
    deletedPostExecution: false,
    cooldown: 0,
    defaults: [],
    usage: "/base64 <string>",
    examples: [],
    details: "",
    premium: false,
    data: new SlashCommandBuilder()
        .setName("base64")
        .addStringOption((opt) => opt.setName("string").setDescription("String to convert to Base64.").setRequired(true))
        .setDescription("Converts a string to Base64 encoding."),
    execute: async (client: Client, interaction: CommandInteraction) => {
        let buffer: any = Buffer.from(interaction.options.getString("string")!);
        return void interaction.followUp({ content: null, embeds: [successEmbed(`Successfully encoded \`${interaction.options.getString("string")}\` -> \`${buffer.toString('base64')}\``)] });
    }
}