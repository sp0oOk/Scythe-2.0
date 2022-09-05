import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction, GuildMember } from "discord.js";
import { PCommand } from "../../interfaces/PCommand";

export const _CommandKick_: PCommand = {
    category: "Moderation",
    aliases: [],
    deletedPostExecution: false,
    cooldown: 0,
    defaults: ["KICK_MEMBERS"],
    usage: "/kick <member> [reason]",
    examples: [`\`/kick @spook\``, `\`/kick 876445979002421248\``, `\`/kick spook bald\``],
    details: "",
    premium: false,
    data: new SlashCommandBuilder()
        .setName("kick")
        .addUserOption((opt) => opt.setName("user").setDescription("User to kick from the guild").setRequired(true))
        .addStringOption((opt) => opt.setName("reason").setDescription("Reason for the staff action.").setRequired(false))
        .setDescription("A kick command, pretty straight forward..."),
    execute: async (client: Client, interaction: CommandInteraction | any) => {
        const user: any = interaction.options.getUser("user");
        const _GuildMember_: GuildMember = interaction.guild?.members.cache.get(user.id)! || await interaction.guild?.members.fetch(user.id).catch(error => { interaction.followUp({ content: "Unable to fetch guild member" }); console.log(error); });
        if(!_GuildMember_) return void interaction.followUp({ content: "Unable to fetch guild member" });
        const reason: string = interaction.options.getString("reason")!;
        if(!_GuildMember_.kickable || _GuildMember_.user.id === client.user?.id) return void interaction.followUp({ content: "Unable to kick this guild member" });
        if(interaction.guild?.members.cache.get(interaction.user.id)?.roles.highest.position <= _GuildMember_.roles.highest.position) return void interaction.followUp({ content: "The member provided is >= your highest role!" });
        await _GuildMember_.kick( `Kicked By ${interaction.user.tag} for ${reason}` || `Kicked By ${interaction.user.tag} for no reason provided`);
        return void interaction.followUp({ content: ` <@${_GuildMember_.id}> has been kicked from the server (Case #00)` });
    }
}