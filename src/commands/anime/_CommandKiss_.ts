import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction, MessageEmbed } from "discord.js";
import { PCommand } from "../../interfaces/PCommand";
import { errorEmbed, primary } from "../../misc/PUtilities";
import { Customize } from "../../config.json";
import { User } from "discord.js";
import got from "got";

export const _CommandKiss_: PCommand = {
    category: "Anime",
    aliases: [],
    deletedPostExecution: false,
    cooldown: 0,
    defaults: [],
    usage: "/kiss <user>",
    examples: [],
    details: "",
    premium: false,
    data: new SlashCommandBuilder()
        .setName("kiss")
        .addUserOption((opt) => opt.setName("user").setDescription("User to give a kiss").setRequired(true))
        .setDescription("Gives a given user a lovely fat kiss :)"),
    execute: async (client: Client, interaction: CommandInteraction) => {
        const user: User | null = interaction.options.getUser("user");
        if (user === interaction.user)
            return void interaction.followUp({ content: null, embeds: [errorEmbed(`You **cannot** kiss yourself... please try a different user!`)] });
        got("https://nekos.life/api/v2/img/kiss").then(response => {
            let parse: any = JSON.parse(response.body);
            const embed: MessageEmbed = new MessageEmbed();
            embed.setColor(primary);
            embed.setFooter(Customize["embed-footer"]);
            embed.setTitle(`💋 ${interaction.user.username} has kissed ${user!.username}!`);
            embed.setImage(parse.url);
            return void interaction.followUp({ content: null, embeds: [embed] });
        });
    }
}