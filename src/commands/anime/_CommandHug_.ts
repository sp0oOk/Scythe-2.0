import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction, MessageEmbed } from "discord.js";
import { PCommand } from "../../interfaces/PCommand";
import { errorEmbed, primary } from "../../misc/PUtilities";
import { Customize } from "../../config.json";
import { User } from "discord.js";
import got from "got";

export const _CommandHug_: PCommand = {
    category: "Anime",
    aliases: [],
    deletedPostExecution: false,
    cooldown: 0,
    defaults: [],
    usage: "/hug <user>",
    examples: [],
    details: "",
    premium: false,
    data: new SlashCommandBuilder()
        .setName("hug")
        .addUserOption((opt) => opt.setName("user").setDescription("User to give a hug").setRequired(true))
        .setDescription("Gives a given user a lovely warm hug :)"),
    execute: async (client: Client, interaction: CommandInteraction) => {
        const user: User | null = interaction.options.getUser("user");
        if (user === interaction.user)
            return void interaction.followUp({ content: null, embeds: [errorEmbed(`You **cannot** kiss yourself... please try a different user!`)] });
        got("https://nekos.life/api/v2/img/hug").then(response => {
            let parse: any = JSON.parse(response.body);
            const embed: MessageEmbed = new MessageEmbed();
            embed.setColor(primary);
            embed.setFooter(Customize["embed-footer"]);
            embed.setTitle(`${interaction.user.username} has hugged ${user!.username}!`);
            embed.setImage(parse.url);

            return void interaction.followUp({ content: null, embeds: [embed] });
        });
    }
}