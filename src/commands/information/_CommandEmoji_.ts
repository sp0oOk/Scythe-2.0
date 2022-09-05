import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction, Emoji, MessageEmbed } from "discord.js";
import { PCommand } from "../../interfaces/PCommand";
import { errorEmbed, multi, primary, single } from "../../misc/PUtilities";
import { Customize } from "../../config.json";
import moment from "moment";

export const _CommandEmoji_: PCommand = {
    category: "Information",
    aliases: [],
    deletedPostExecution: false,
    cooldown: 0,
    defaults: [],
    usage: "/emoji <emoji>",
    examples: [],
    details: "",
    premium: false,
    data: new SlashCommandBuilder()
        .setName("emoji")
        .addStringOption((opt) => opt.setName("emoji").setDescription("Valid EmojiResolvable instance").setRequired(false))
        .setDescription("Returns some basic information about a emoji"),
    execute: async (client: Client, interaction: CommandInteraction) => {
        const emoji: string | null = interaction.options.getString("emoji");
        if(emoji === null || !emoji.match(/(<a?)?:\w+:(\d{18}>)?/g)) return void interaction.followUp({ content: null, embeds: [errorEmbed(`The emoji argument provided is \`invalid\` please try again!`)] });
        const _emoji: Emoji | undefined = client.emojis.cache.get(emoji.match(/(<a?)?:\w+:(\d{18}>)?/g)![0].match(/\d+/g)![0]);
        if(_emoji === undefined) return void interaction.followUp({ content: null, embeds: [errorEmbed(`The emoji passed is either \`invalid\` or not cached by the client!`)] });
        const embed: MessageEmbed = new MessageEmbed();
        embed.setAuthor(`Client Emoji ⦁ ${_emoji.name}`, _emoji.url!);
        embed.setDescription(`The emoji \`${_emoji.name}\` is a \`${_emoji.animated ? "Animated" : "Picture"}\` emoji — see more information about emojis and how to create your own [here](https://support.discord.com/hc/en-us/articles/360036479811-Custom-Emojis)`);
        embed.addField(`Emoji —`, ` ${multi}**Created:** \`${_emoji.createdAt?.toDateString()}\` (**\`${moment(_emoji.createdAt).fromNow()}\`**)\n ${multi}**ID:** \`${_emoji.id}\`\n ${single}**API Format:** \`<${_emoji.name}:${_emoji.id}>\` [click here](${_emoji.url})`);
        embed.addField(`Details —`, ` ${multi}This is how emojis are **processed** in discord's chat system\n ${multi}before it is formatted to a proper emoji. Furthermore, this can\n ${multi}be used for many things such as putting emojis in \n ${single}**channel topics**.`);
        embed.setFooter(Customize["embed-footer"]);
        embed.setColor(primary);
        embed.setThumbnail(_emoji.url!);
        return void interaction.followUp({ content: null, embeds: [embed] });
    }
}