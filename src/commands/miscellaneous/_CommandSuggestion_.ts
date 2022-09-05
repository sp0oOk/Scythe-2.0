import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction, GuildChannel, Message, MessageEmbed } from "discord.js";
import { PCommand } from "../../interfaces/PCommand";
import { errorEmbed, getDatabase, primary } from "../../misc/PUtilities";
import { Customize } from "../../config.json";

export const _CommandSuggestion_: PCommand = {
    category: "Fun",
    aliases: [],
    deletedPostExecution: false,
    cooldown: 0,
    defaults: [],
    usage: "/suggestion <suggestion>",
    examples: [],
    details: "",
    premium: false,
    data: new SlashCommandBuilder()
        .setName("suggest")
        .addStringOption((opt) => opt.setName("suggestion").setDescription("Suggestion to be sent.").setRequired(true))
        .setDescription("Allows User to Send a Suggestion for the server."),
    execute: async (client: Client, interaction: CommandInteraction) => {
        const suggestion: string | null = interaction.options.getString("suggestion");
        if(!suggestion) return void interaction.followUp({ embeds: [errorEmbed(`For some reason the \`suggestion\` argument was null! please try again.. If the error persists contact an administrator.`)] })

        const channel : GuildChannel | any = interaction.guild?.channels.cache.find(channel => channel.name?.toLowerCase()! == "pending-suggestions");
        const settings: Object | any = await (await getDatabase(interaction.guild!)).getObject(`/${interaction.guild?.id!}/suggestions`);

        const embed: MessageEmbed = new MessageEmbed()
            .setAuthor({name: `Suggestion By ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ size: 512, dynamic: true })})
            .setColor(primary)
            .setDescription(`\`${suggestion}\``)
            .setFooter({ text: `Suggestion ID: ${settings.count + 1} | ${Customize["embed-footer-short"]}`});
        
        try { const msg: Message = await channel.send({ embeds: [embed] }); settings.suggestions[settings.count + 1] = { id: settings.count + 1, messageID: msg.id, channelID: msg.channelId }; settings.count = settings.count + 1; await (await getDatabase(interaction.guild!)).push(`/${interaction.guildId}/suggestions`, settings, true); return void interaction.followUp({ content: "**Suggestion Successfully Sent.**" })}
        catch(nigga) { console.log(nigga); return void interaction.followUp({ embeds: [errorEmbed(`For some reason the \`suggestion message\` was unable to send! please try again.. If the error persists contact an administrator.`)]}) }
    }
}