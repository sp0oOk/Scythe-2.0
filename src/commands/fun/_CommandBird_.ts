import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction, MessageEmbed } from "discord.js";
import { PCommand } from "../../interfaces/PCommand";
import shibe = require("shibe.online");
import { primary } from "../../misc/PUtilities";
import { Customize } from "../../config.json";

export const _CommandBird_: PCommand = {
    category: "Fun",
    aliases: [],
    deletedPostExecution: false,
    cooldown: 0,
    defaults: [],
    usage: "/bird",
    examples: [],
    details: "",
    premium: false,
    data: new SlashCommandBuilder()
        .setName("bird")
        .setDescription("Returns a random picture of a bird"),
    execute: async (client: Client, interaction: CommandInteraction) => {
        const picture: any = (await shibe.getBird()).toString();
        const embed: MessageEmbed = new MessageEmbed();
            embed.setAuthor(`🐦 Requested by ${interaction.member!.user.username}`, interaction.guild?.members.cache.get(interaction.member!.user.id)?.displayAvatarURL());
            embed.setImage(picture);
            embed.setColor(primary);
            embed.setFooter(Customize["embed-footer"]);
        return void interaction.followUp({ content: null, embeds: [embed] });
    }
}