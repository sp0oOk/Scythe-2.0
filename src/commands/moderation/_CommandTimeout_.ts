import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction, GuildMember } from "discord.js";
import { PCommand } from "../../interfaces/PCommand";
import ms from "ms";

export const _CommandTimeout_: PCommand = {
    category: "Moderation",
    aliases: [],
    deletedPostExecution: false,
    cooldown: 0,
    defaults: ["BAN_MEMBERS"],
    usage: "/timeout <member> <time> [reason]",
    examples: [`\`/timeout @spook 5m\``, `\`/timeout 876445979002421248 6h\``, `\`/timeout spook 3d bald\``],
    details: "",
    premium: false,
    data: new SlashCommandBuilder()
        .setName("timeout")
        .addUserOption((opt) => opt.setName("user").setDescription("User to timeout from the guild.").setRequired(true))
        .addStringOption((opt) => opt.setName("time").setDescription("You need to use d (days), h (hours), m (minutes), or s (seconds).").setRequired(true))
        .addStringOption((opt) => opt.setName("reason").setDescription("Reason for the staff action.").setRequired(false))
        .setDescription("A timeout command, pretty straight forward..."),
    execute: async (client: Client, interaction: CommandInteraction | any) => {
        const user: any = interaction.options.getUser("user");
        const _GuildMember_: GuildMember = interaction.guild?.members.cache.get(user.id)! || await interaction.guild?.members.fetch(user.id).catch(error => { interaction.followUp({ content: "Unable to fetch guild member" }); console.log(error); });
        if(!_GuildMember_) return void interaction.followUp({ content: "Unable to fetch guild member" });
        const reason: string = interaction.options.getString("reason")!;
        const time: string = ms(interaction.options.getString("time")!);
        if(!_GuildMember_.manageable || _GuildMember_.user.id === client.user?.id) return void interaction.followUp({ content: "Unable to timeout this guild member" });
        if(interaction.guild?.members.cache.get(interaction.user.id)?.roles.highest.position <= _GuildMember_.roles.highest.position) return void interaction.followUp({ content: "The member provided is >= your highest role!" });
        // @ts-ignore
        await _GuildMember_.disableCommunicationUntil(time, `Disabled By ${interaction.user.tag} for ${reason}` || `Disabled By ${interaction.user.tag} for no reason provided`);
        return void interaction.followUp({ content: ` <@${_GuildMember_.id}> has been timedout from the server until ${time} (Case #00)` });
    }
}