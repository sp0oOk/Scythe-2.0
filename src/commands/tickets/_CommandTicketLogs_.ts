import { SlashCommandBuilder } from "@discordjs/builders";
import { CacheType, Client, CommandInteraction, MessageAttachment } from "discord.js";
import { existsSync } from "fs";
import { PCommand } from "../../interfaces/PCommand";
import { errorEmbed, getDatabase, successEmbed } from "../../misc/PUtilities";
//""

export const _CommandTicketLog_: PCommand = {
    category: "Tickets",
    aliases: [],
    examples: [],
    usage: "/ticketlog <id>",
    deletedPostExecution: true,
    cooldown: 0,
    premium: false,
    defaults: ["ADMINISTRATOR"],
    details: "",
    data: new SlashCommandBuilder()
        .setName("ticketlog")
        .addStringOption((opt) => opt.setName("identifier").setDescription("Ticket ID to get log of.").setRequired(true))
        .setDescription("Attempts to get the log file of a ticket!"),
    execute: async (client: Client, interaction: CommandInteraction<CacheType>) => {
        let object: Object | any = await (await getDatabase(interaction.guild!)).getObject(`/${interaction.guild?.id}`);
        if (!object.ticketService?.enabled!)
            return void interaction.followUp({ embeds: [errorEmbed(`You cannot use \`commands\` related to the \`Ticket Service\` as it is currently \`disabled\`!`)] });
        const ticketID: string | null = interaction.options.getString("identifier");
        if(!ticketID) return void interaction.followUp({ embeds: [errorEmbed("No Ticket ID Provided!")] });
        if(existsSync(`./transcripts/${interaction.guild?.id!}/Ticket-${ticketID}.txt`) == false ) return void interaction.followUp({ embeds: [errorEmbed("The provided ticket id does not exist.")] });
        const attachment: MessageAttachment = new MessageAttachment(`./transcripts/${interaction.guild?.id!}/Ticket-${ticketID}.txt`, `Ticket-${ticketID}.txt`);
        interaction.user.send({ content: `**Here is the log for **\`Ticket-${ticketID}\``, files: [attachment] });
        return void interaction.followUp({ embeds: [ successEmbed("I have sent the ticket in dms.")]})
    }    
}