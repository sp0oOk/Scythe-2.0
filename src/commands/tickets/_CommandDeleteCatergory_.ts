import { SlashCommandBuilder } from "@discordjs/builders";
import { CacheType, Client, CommandInteraction } from "discord.js";
import { PCommand } from "../../interfaces/PCommand";
import { errorEmbed, getDatabase, successEmbed } from "../../misc/PUtilities";

export const _CommandRemoveTicketCategory_: PCommand = {
    category: "Tickets",
    aliases: [],
    examples: ["/removecatergory factions"],
    usage: "removeticketcategory <name>",
    deletedPostExecution: true,
    cooldown: 0,
    premium: false,
    defaults: ["ADMINISTRATOR"],
    details: "",
    data: new SlashCommandBuilder()
        .setName("removeticketcategory")
        .addStringOption((opt) => opt.setName("name").setDescription("Name of the new catergory").setRequired(true))
        .setDescription("Removes Ticket Catergory"),
    execute: async (client: Client, interaction: CommandInteraction<CacheType>) => {
        let guild: Object | any = await (await getDatabase(interaction.guild!)).getObject(`/${interaction.guild?.id}`);
        if (!guild.ticketService?.enabled!)
            return void interaction.followUp({ embeds: [errorEmbed(`You cannot use \`commands\` related to the \`Ticket Service\` as it is currently \`disabled\`!`)] });
        let name: string | null = interaction.options.getString("name");
        
        if (guild.ticketService?.data[name!])
            return void interaction.followUp({ embeds: [errorEmbed(`Unable to add a ticket category with the name "\`${name}\`" as doesn't exists!`)] });
        await (await getDatabase(interaction.guild!)).delete(`/${interaction.guild?.id}/ticketService/data/${name}`);
        return void interaction.followUp({ embeds: [successEmbed(`Successfully removed the category "\`${name}\`" from the guild database!`)] });
    }
}