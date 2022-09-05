import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction, GuildChannel, GuildTextBasedChannel, Message, MessageEmbed } from "discord.js";
import { PCommand } from "../../interfaces/PCommand";
import { errorEmbed, getDatabase, primary } from "../../misc/PUtilities";

export const _CommandSuggestionResponse_: PCommand = {
    category: "Fun",
    aliases: [],
    deletedPostExecution: false,
    cooldown: 0,
    defaults: [],
    usage: "/leaderboard",
    examples: [],
    details: "",
    premium: false,
    data: new SlashCommandBuilder()
        .setName("suggestionresponse")
        .addStringOption((opt) => opt.setName("identifier").setDescription("Suggestion identifier to be responded to.").setRequired(true))
        .addStringOption((opt) => opt.setName("operation").setDescription("Respond with either Accept or Deny to respond to Suggestion.").setRequired(true))
        .addStringOption((opt) => opt.setName("reason").setDescription("Respond with reason of acceptance or denial").setRequired(false))
        .setDescription("Allows Staff to respond to a Suggestion."),
    execute: async (client: Client, interaction: CommandInteraction) => {
        const suggestionID: string | null = interaction.options.getString("identifier");
        if(!suggestionID) return void interaction.followUp({ embeds: [errorEmbed(`For some reason the \`suggestion ID\` argument was null! please try again.. If the error persists contact an administrator.`)] })
        const decision: string | null = interaction.options.getString("operation");
        if(!decision || (decision.toLowerCase() != "accept" && decision.toLowerCase() != "deny")) return void interaction.followUp({ embeds: [errorEmbed(`For some reason the \`Accept or Deny\` argument was null or incorrect! please try again.. If the error persists contact an administrator.`)] })
        
        const settings: Object | any = await (await getDatabase(interaction.guild!)).getObject(`/${interaction.guild?.id!}/suggestions`);
        const suggestion: Object | any = settings.suggestions[suggestionID];
        if(!suggestion) return void interaction.followUp({ embeds: [errorEmbed(`For some reason that Suggestion ID was not found in the database! please try again.. If the error persists contact an administrator.`)] })
        //@ts-ignore
        let pendingChannel: GuildTextBasedChannel | null = await interaction.guild?.channels.cache.get(suggestion.channelID!);
        const message: Message | undefined = await pendingChannel?.messages?.fetch(suggestion.messageID);
        if(!message) return void interaction.followUp({ embeds: [errorEmbed(`For some reason that suggestion message was not found! please try again.. If the error persists contact an administrator.`)] })

        const reason: string | null = interaction.options.getString("reason");
        if(decision.toLowerCase() == "accept")  {
            const channel : GuildChannel | any = interaction.guild?.channels.cache.find(channel => channel.name?.toLowerCase()! == "accepted-suggestions");
            const embed = message?.embeds[0]!;
            embed.addField(`Approved By \`${interaction.user?.tag}\``, `**Reason:** ${`\`${reason}\``|| `\`No Reason Provided\``}`);

            try { const msg: Message = await channel.send({ embeds: [embed] }); message.delete(); await (await getDatabase(interaction.guild!)).delete(`/${interaction.guildId}/suggestions/suggestions/${suggestionID}`); return void interaction.followUp({ content: `**Suggestion \`${suggestionID}\` Successfully Accepted**` })}
            catch(nigga) { console.log(nigga); return void interaction.followUp({ embeds: [errorEmbed(`For some reason the \`suggestion\` was unable to be responded to! please try again.. If the error persists contact an administrator.`)]}) }
        }
        else {
            const channel : GuildChannel | any = interaction.guild?.channels.cache.find(channel => channel.name?.toLowerCase()! == "denied-suggestions");
            const embed = message?.embeds[0]!;
            embed.addField(`Denied By \`${interaction.user?.tag}\``, `**Reason:** ${`\`${reason}\`` || `\`No Reason Provided\``}`);

            try { const msg: Message = await channel.send({ embeds: [embed] }); message.delete(); await (await getDatabase(interaction.guild!)).delete(`/${interaction.guildId}/suggestions/suggestions/${suggestionID}`); return void interaction.followUp({ content: `**Suggestion \`${suggestionID}\` Successfully Denied**` })}
            catch(nigga) { console.log(nigga); return void interaction.followUp({ embeds: [errorEmbed(`For some reason the \`suggestion\` was unable to be responded to! please try again.. If the error persists contact an administrator.`)]}) }
        }
    }
}