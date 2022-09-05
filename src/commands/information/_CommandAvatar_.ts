import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction, MessageEmbed } from "discord.js";
import { PCommand } from "../../interfaces/PCommand";
import { primary } from "../../misc/PUtilities";
import { Customize } from "../../config.json";
import { User } from "discord.js";

export const _CommandAvatar_: PCommand = {
    category: "Information",
    aliases: [],
    deletedPostExecution: false,
    cooldown: 0,
    defaults: [],
    usage: "/avatar [user]",
    examples: [],
    details: "",
    premium: false,
    data: new SlashCommandBuilder()
        .setName("avatar")
        .addUserOption((opt) => opt.setName("user").setDescription("User to fetch the avatar of").setRequired(false))
        .setDescription("Returns a users avatar picture/gif"),
    execute: async (client: Client, interaction: CommandInteraction) => {
        const user: User | null = interaction.options.getUser("user");
        const embed: MessageEmbed = new MessageEmbed();
            embed.setColor(primary);
            embed.setFooter(Customize["embed-footer"]);
        if(user === null || user === undefined) {
            embed.setTitle(`${interaction.user.username}'s Avatar`);
            embed.setImage(interaction.user.displayAvatarURL());
            return void interaction.followUp({ content: null, embeds: [embed] });
        }
        embed.setTitle(`${user.username}'s Avatar (Requested by: ${interaction.user.username})`);
        embed.setImage(user.displayAvatarURL());
        return void interaction.followUp({ content: null, embeds: [embed] });
    }
}