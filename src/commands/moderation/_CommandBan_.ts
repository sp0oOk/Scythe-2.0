import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction, GuildMember } from "discord.js";
import { PCommand } from "../../interfaces/PCommand";

export const _CommandBan_: PCommand = {
    category: "Moderation",
    aliases: [],
    deletedPostExecution: false,
    cooldown: 0,
    defaults: ["BAN_MEMBERS"],
    usage: "/ban <member> [reason]",
    examples: [`\`/ban @spook\``, `\`/ban 876445979002421248\``, `\`/ban spook bald\``],
    details: "",
    premium: false,
    data: new SlashCommandBuilder()
        .setName("ban")
        .addUserOption((opt) => opt.setName("user").setDescription("User to ban from the guild").setRequired(true))
        .addStringOption((opt) => opt.setName("reason").setDescription("Reason for the staff action.").setRequired(false))
        .setDescription("A ban command, pretty straight forward..."),
    execute: async (client: Client, interaction: CommandInteraction | any) => {
        const user: any = interaction.options.getUser("user");
        const _GuildMember_: GuildMember = interaction.guild?.members.cache.get(user.id)! || await interaction.guild?.members.fetch(user.id).catch(error => { interaction.followUp({ content: "Unable to fetch guild member" }); console.log(error); });
        if(!_GuildMember_) return void interaction.followUp({ content: "Unable to fetch guild member" });
        const reason: string = interaction.options.getString("reason")!;
        if(!_GuildMember_.bannable || _GuildMember_.user.id === client.user?.id) return void interaction.followUp({ content: "Unable to ban this guild member" });
        if(interaction.guild?.members.cache.get(interaction.user.id)?.roles.highest.position <= _GuildMember_.roles.highest.position) return void interaction.followUp({ content: "The member provided is >= your highest role!" });
        await _GuildMember_.ban({ reason: `Banned By ${interaction.user.tag} for ${reason}` || `Banned By ${interaction.user.tag} for no reason provided` });
        return void interaction.followUp({ content: ` <@${_GuildMember_.id}> has been banned from the server (Case #00)` });
    }
}