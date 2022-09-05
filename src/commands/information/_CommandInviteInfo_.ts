import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction, Emoji, Invite, Message, MessageEmbed } from "discord.js";
import { PCommand } from "../../interfaces/PCommand";
import { dnd, errorEmbed, idle, multi, offline, online, primary, single } from "../../misc/PUtilities";
import { Customize } from "../../config.json";
import moment from "moment";

export const _CommandInviteInfo_: PCommand = {
    category: "Information",
    aliases: [],
    deletedPostExecution: false,
    cooldown: 0,
    defaults: [],
    usage: "/inviteinfo <\"invite URL\" | \"code\">",
    examples: [],
    details: "",
    premium: false,
    data: new SlashCommandBuilder()
        .setName("inviteinfo")
        .addStringOption((opt) => opt.setName("invite").setDescription("Valid invitation URL").setRequired(false))
        .setDescription("Returns some basic information about a guild invite"),
    execute: async (client: Client, interaction: CommandInteraction) => {
        const invite: string | null = interaction.options.getString("invite");
        if(invite === null || !invite.match(/(https:\/\/)?(www\.)?(((discord(app)?)?\.com\/invite)|((discord(app)?)?\.gg))\/(?<invite>.+)/gm)) return void interaction.followUp({ content: null, embeds: [errorEmbed(`The invite argument provided is \`invalid\` please try again!`)] });
        const _invite: Invite = await client.fetchInvite(invite.match(/(https:\/\/)?(www\.)?(((discord(app)?)?\.com\/invite)|((discord(app)?)?\.gg))\/(?<invite>.+)/gm)![0]);
        if(_invite === undefined) return void interaction.followUp({ content: null, embeds: [errorEmbed(`The invite passed is either \`invalid\` or not cached by the client!`)] });
        const embed: MessageEmbed = new MessageEmbed();
        embed.setAuthor(`Discord Invitation ⦁ ${_invite.guild?.name}`, _invite.guild?.iconURL({ format: "webp", dynamic: false, size: undefined })!);
        embed.addField(`Guild —`, ` ${multi}**Name:** \`${_invite.guild?.name}\` (ID: **\`${_invite.guild?.id}\`**)\n ${multi}**Created:** \`${_invite.guild?.createdAt.toDateString()}\` (**\`${moment(_invite.guild?.createdAt).fromNow()}\`**)\n ${multi}**Members:** ${client.guilds.cache.get(_invite.guild?.id!) === undefined ? "\`Unable to fetch member information\`" : `${online} **${client.guilds.cache.get(_invite.guild?.id!)?.members.cache.filter((m) => !m.user.bot && m.presence?.status === "online").size}`}** | ${idle} **${client.guilds.cache.get(_invite.guild?.id!)?.members.cache.filter((m) => !m.user.bot && m.presence?.status === "idle").size}** | ${dnd} **${client.guilds.cache.get(_invite.guild?.id!)?.members.cache.filter((m) => !m.user.bot && m.presence?.status === "dnd").size}** | ${offline} ${client.guilds.cache.get(_invite.guild?.id!)?.members.cache.filter((m) => !m.user.bot && m.presence?.status === "offline").size} (not including bots)\n ${single}**Cosmetic:** [Guild Icon](${_invite.guild?.iconURL()}), [Guild Banner](${_invite.guild?.bannerURL()})`);
        embed.addField(`Invite —`, ` ${multi}**Code:** \`${_invite.code}\`\n ${multi}**Uses:** \`${_invite.uses === null ? 0 : _invite.uses}\` / \`${_invite.maxUses === null ? "Unlimited" : _invite.maxUses}\`\n ${multi}**Created By:** ${_invite.inviter === null ? `\`Unable to fetch inviter\`` : `<@${_invite.inviter.id}> (**\`ID: ${_invite.inviter.id} | ${_invite.createdAt === null ? "Date not found?" : moment(_invite.createdAt).fromNow()}\`**)`}\n ${single}**Expires:** \`${_invite.temporary ? `${_invite.expiresAt !== null ? _invite.expiresAt.toDateString() : `No date string found?`}` : "Permanent (never)"}\``);
        embed.setColor(primary);
        embed.setFooter(Customize["embed-footer"]);
        embed.setThumbnail(_invite.guild?.iconURL()!);
        return void interaction.followUp({ content: null, embeds: [embed] });
    }
}