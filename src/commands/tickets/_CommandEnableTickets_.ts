import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction, CacheType } from "discord.js";
import { PCommand } from "../../interfaces/PCommand";
import { getDatabase, successEmbed } from "../../misc/PUtilities";

export const _CommandToggleTickets_ : PCommand = {
    category: "Tickets",
    aliases: [],
    examples: [],
    usage: "/toggletickets",
    deletedPostExecution: false,
    cooldown: 0,
    premium: false,
    defaults: ["ADMINISTRATOR"],
    details: "",
    data: new SlashCommandBuilder()
        .setName("toggletickets")
        .setDescription("Enables/Disables"),
    execute: async (client: Client, interaction: CommandInteraction<CacheType>) => {
        let object: Object | any = await (await getDatabase(interaction.guild!)).getObject(`/${interaction.guild?.id}`);
        if (object.ticketService?.enabled!) {
            (await getDatabase(interaction.guild!)).push(`/${interaction.guild?.id}/ticketService/enabled`, false, true);
            return void interaction.followUp({ embeds: [successEmbed(`You have disabled tickets in this guild.`)] });
        }

        if (!object.ticketService?.enabled!) {
            (await getDatabase(interaction.guild!)).push(`/${interaction.guild?.id}/ticketService/enabled`, true, true);
            return void interaction.followUp({ embeds: [successEmbed(`You have enabled tickets in this guild.`)] });
        }
    }    
};
