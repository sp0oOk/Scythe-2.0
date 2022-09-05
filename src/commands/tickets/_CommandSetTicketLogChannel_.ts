import { SlashCommandBuilder } from "@discordjs/builders";
import { CacheType, Client, CommandInteraction, GuildTextBasedChannel } from "discord.js";
import { PCommand } from "../../interfaces/PCommand";
import { errorEmbed, getDatabase, successEmbed } from "../../misc/PUtilities";
//""

export const _CommandSetTicketLogChannel_: PCommand = {
    category: "Tickets",
    aliases: [],
    examples: [],
    usage: "/setticketlogchannel <channel>",
    deletedPostExecution: true,
    cooldown: 0,
    premium: false,
    defaults: ["ADMINISTRATOR"],
    details: "",
    data: new SlashCommandBuilder()
        .setName("setticketlogchannel")
        .addChannelOption((opt) => opt.setName("channel").setDescription("Channel for ticket logs").setRequired(true))
        .setDescription("Sets the guild ticket log channel"),
    execute: async (client: Client, interaction: CommandInteraction<CacheType>) => {
        let object: Object | any = await (await getDatabase(interaction.guild!)).getObject(`/${interaction.guild?.id}`);
        if (!object.ticketService?.enabled!)
            return void interaction.followUp({ embeds: [errorEmbed(`You cannot use \`commands\` related to the \`Ticket Service\` as it is currently \`disabled\`!`)] });
        const logChannel: GuildTextBasedChannel | any = interaction.options.getChannel("channel");
        (await getDatabase(interaction.guild!)).push(`/${interaction?.guildId!}/ticketService/logChannel`, logChannel.id, true);
        return void interaction.followUp({ embeds: [ successEmbed(`I have succesfully set the log channel to \`${logChannel.name}\``)]})
    }    
}