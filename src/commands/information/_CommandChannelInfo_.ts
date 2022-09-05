import { SlashCommandBuilder } from "@discordjs/builders";
import { APIInteractionDataResolvedChannel } from "discord-api-types";
import { Client, CommandInteraction, GuildChannel, MessageEmbed, ThreadChannel } from "discord.js";
import { PCommand } from "../../interfaces/PCommand";
import { multi, primary, single } from "../../misc/PUtilities";
import { Customize } from "../../config.json";
import moment from "moment";


export const _CommandChannelInfo_: PCommand = {
    category: "Information",
    aliases: [],
    deletedPostExecution: false,
    cooldown: 0,
    defaults: [],
    usage: "/channelinfo [channel]",
    examples: [],
    details: "",
    premium: false,
    data: new SlashCommandBuilder()
        .setName("channelinfo")
        .addChannelOption((opt) => opt.setName("channel").setDescription("Channel to fetch information about").setRequired(false))
        .setDescription("Returns some basic information on a guild channel"),
    execute: async (client: Client, interaction: CommandInteraction) => {
        let last: any;
        let channel: ThreadChannel
            | GuildChannel
            | APIInteractionDataResolvedChannel
            | null
            | any = interaction.options.getChannel("channel");
        if (channel === null)
            channel = interaction.channel!;
        channel = interaction.guild?.channels.cache.get(channel.id)!;
        const embed: MessageEmbed = new MessageEmbed();
        embed.setAuthor(`Guild Channel ⦁ ${channel.name}`, "https://cdn.discordapp.com/attachments/919173312372965377/919173334535663686/a363fb_379f870b19ce430994caf31616b1dc5e_mv2.gif");
        embed.setThumbnail("https://cdn.discordapp.com/attachments/919173312372965377/919173334535663686/a363fb_379f870b19ce430994caf31616b1dc5e_mv2.gif");
        embed.setColor(primary);
        embed.setDescription(`The channel \`${channel.name}\` (**\`${channel.type}\`**) is currently has a total of **${channel.members.size}** members with **${channel.members.filter((m: any) => m.permissions.has("SEND_MESSAGES")).size}** of them been able to send messages!`);
        if (channel.type === "GUILD_TEXT") {
            await channel.messages.fetch({ limit: 1 }).then((m: { first: () => { (): any; new(): any; createdAt: any; }; }) => {
                last = m.first().createdAt;
            }).catch((e: any) => { });
        }
        embed.addField("Details ─", ` ${multi}**Created:** \`${channel.createdAt.toDateString("en-Us")} (${moment(channel.createdAt).fromNow()})\`\n ${multi}**Position:** \`${channel.rawPosition}/${interaction.guild?.channels.cache.size}\`\n ${multi}**Category:** \`${channel.parent?.name === undefined ? "No parent channel" : channel.parent?.name}\`\n ${multi}**Topic:** \`${channel.topic === null || channel.topic === undefined ? "No channel topic" : channel.topic}\`\n ${multi}**Latest activity:** \`${channel.type === "GUILD_TEXT" ? `${last !== undefined ? `${last.toDateString("en-Us")} (${moment(last).fromNow()})` : "No last message cached"}` : `No data (${channel.type} Channel)`}\`\n ${single}**Identifier:** \`${channel.id}\``);
        embed.setFooter(Customize["embed-footer"]);
        return void interaction.followUp({ content: null, embeds: [embed] });



    }
}