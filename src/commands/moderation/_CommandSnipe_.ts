import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction, Message, MessageEmbed, PartialMessage } from "discord.js";
import moment from "moment";
import { PCommand } from "../../interfaces/PCommand";
import { dnd, errorEmbed, guildSnipes, idle, multi, offline, online, primary, single } from "../../misc/PUtilities";
import { Customize } from "../../config.json";

export const _CommandSnipe_: PCommand = {
    category: "Moderation",
    aliases: [],
    deletedPostExecution: false,
    cooldown: 0,
    defaults: ["MANAGE_MESSAGES"],
    usage: "/snipe",
    examples: [],
    details: "",
    premium: false,
    data: new SlashCommandBuilder()
        .setName("snipe")
        .setDescription("Retrieves the most recently deleted message in a guild!"),
    execute: async (client: Client, interaction: CommandInteraction) => {
        const message: Message | PartialMessage | undefined = guildSnipes.get(interaction.guild!);
        if(message === undefined) return void interaction.followUp({ content: null, embeds: [errorEmbed(`There is currently no \`message\` "snipe" in memory, this could be due to a bot restart...`)] });
        const embed: MessageEmbed = new MessageEmbed();
        const attachments: Array<string> = [];
        message.attachments.forEach(att => { attachments.push(att.url); });
        embed.setAuthor({ iconURL: message.author?.avatarURL()!, name: `Sniped ${message.author?.tag}'s message 🎯`, url: undefined });
        // @ts-ignore
        embed.addField(`Author ─`, `${multi}**Username** » <@${message.author?.id}> [**\`${message.author?.id}\`**]\n${multi}**Created At** » \`${message.author?.createdAt.toDateString("en-US")}\` (${moment(message.author?.createdAt).fromNow()})\n${multi}**Joined At** » \`${message.guild?.members.cache.get(message.author?.id!)?.joinedAt?.toDateString("en-US")}\` (${moment(message.guild?.members.cache.get(message.author?.id!)?.joinedAt).fromNow()})\n${single}**Status** » ${message.member?.presence?.status === "dnd" ? `${dnd} Do Not Disturb.` : message.member?.presence?.status === "idle" ? `${idle} Idle.` : message.member?.presence?.status === "offline" ? `${offline} Offline.` : `${online} Online.`}`);
        // @ts-ignore
        embed.addField(`Message ─`, `${multi}**Created At** » \`${message.createdAt.toDateString("en-US")}\` (${moment(message.createdAt).fromNow()})\n${multi}**Channel** » <#${message.channel.id}> [\`${message.channel.id}\`]\n${multi}**Attachments** » ${message.attachments.size < 1 ? `\`No message attachments\`` : message.attachments.map(m => `[${m.name}](${m.url})`).join(", ")}\n${single}**Message Content** » ${message.cleanContent === "" || message.cleanContent === null ? `\`No message content\`` : `\n\`\`\`${message.cleanContent}\`\`\``}`);
        embed.setColor(primary);
        embed.setFooter({ iconURL: undefined, text: Customize["embed-footer"] });
        embed.setThumbnail(message.guild?.iconURL()!);
        return void interaction.followUp({ content: null, embeds: [embed] });
    }
}