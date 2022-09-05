import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction, MessageEmbed } from "discord.js";
import got from "got";
import { PCommand } from "../../interfaces/PCommand";
import { errorEmbed, primary } from "../../misc/PUtilities";

export const _CommandAdvice_: PCommand = {
    category: "Fun",
    aliases: [],
    deletedPostExecution: false,
    cooldown: 0,
    defaults: [],
    usage: "/advice",
    examples: [],
    details: "",
    premium: false,
    data: new SlashCommandBuilder()
        .setName("advice")
        .setDescription("Returns a random string containing some life advice!"),
    execute: async (client: Client, interaction: CommandInteraction) => {
        got("http://api.adviceslip.com/advice").then(res => {
            if(res.statusCode !== 200) return void interaction.followUp({ content: null, embeds: [errorEmbed(`An internal API error occurred! \`${res.statusMessage}\``)] });
            const advice: string | any = JSON.parse(res.body);
            const embed: MessageEmbed = new MessageEmbed();
                embed.setColor(primary);
                embed.setDescription(`**ADVICE** ❣️ \`${advice.slip.advice}\``);
                embed.setFooter(`© PvPLabs • Want some advice? use the command /advice!`);
            return void interaction.followUp({ content: null, embeds: [embed] });
        });
    }
}