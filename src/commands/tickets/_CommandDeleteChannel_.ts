import { SlashCommandBuilder } from "@discordjs/builders";
import { CacheType, Channel, Client, CommandInteraction } from "discord.js";
import { PCommand } from "../../interfaces/PCommand";
import { errorEmbed, getDatabase, successEmbed } from "../../misc/PUtilities";
//""

export const _CommandDeleteTicketChannel_: PCommand = {
    category: "Tickets",
    aliases: ["/deleteticketchannel"],
    examples: [],
    usage: "deleteticketchannel",
    deletedPostExecution: true,
    cooldown: 0,
    premium: false,
    defaults: ["ADMINISTRATOR"],
    details: "",
    data: new SlashCommandBuilder()
        .setName("deleteticketchannel")
        .addChannelOption((opt) => opt.setName("channel").setDescription("Channel to be deleted").setRequired(true))
        .setDescription("Attempts to remove a ticket channel if it exists on guild database!"),
    execute: async (client: Client, interaction: CommandInteraction<CacheType>) => {
        let object: Object | any = await (await getDatabase(interaction.guild!)).getObject(`/${interaction.guild?.id}`);
        if (!object.ticketService?.enabled!)
            return void interaction.followUp({ embeds: [errorEmbed(`You cannot use \`commands\` related to the \`Ticket Service\` as it is currently \`disabled\`!`)] });
        const channel: Channel | any = interaction.options.getChannel("channel");
        if (!object.ticketService.channels.includes(interaction.channel?.id))
            return void interaction.followUp({ embeds: [errorEmbed(`This channel is not a \`ticket-embed\` channel! (You can add it by executing the command \`/ticketsetup\`)`)] });
        let current_channels: Array<string> = object.ticketService.channels;
        current_channels = await remove(current_channels, channel.id);
        (await getDatabase(interaction.guild!)).push(`/${interaction.guild?.id}/ticketService/channels`, current_channels, true);
        return void interaction.followUp({ embeds: [successEmbed(`You have successfully remove <#${channel.id}> from the guild database!`)]});
    }    
}


async function remove(arr: Array<string>, target: string) {
    var i = 0;
    while (i < arr.length) {
      if (arr[i] === target) {
        arr.splice(i, 1);
      } else {
        ++i;
      }
    }
    return arr;
}