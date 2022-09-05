import { SlashCommandBuilder } from "@discordjs/builders";
import { CacheType, CategoryChannel, Client, CommandInteraction, Emoji, GuildBasedChannel, TextBasedChannel } from "discord.js";
import { PCommand } from "../../interfaces/PCommand";
import { i } from "../../main";
import { category, errorEmbed, getDatabase, successEmbed } from "../../misc/PUtilities";

export const _CommandAddTicketCategory_: PCommand = {
    category: "Tickets",
    aliases: [],
    examples: ["/addcatergory factions ✅"],
    usage: "/addticketcategory <Catergory ID> <Emoji ID | \"default\">",
    deletedPostExecution: true,
    cooldown: 0,
    premium: false,
    defaults: ["ADMINISTRATOR"],
    details: "",
    data: new SlashCommandBuilder()
        .setName("addticketcategory")
        .addStringOption((opt) => opt.setName("categoryid").setDescription("ID of the Category").setRequired(true))
        .addStringOption((opt) => opt.setName("emojiid").setDescription("ID of the Emoji").setRequired(true))
        .setDescription("Add Ticket Catergory"),
    execute: async (client: Client, interaction: CommandInteraction<CacheType>) => {
        let guild: Object | any = await (await getDatabase(interaction.guild!)).getObject(`/${interaction.guild?.id}`);
        if (!guild.ticketService?.enabled!)
            return void interaction.followUp({ embeds: [errorEmbed(`You cannot use \`commands\` related to the \`Ticket Service\` as it is currently \`disabled\`!`)] });
        let categoryid: any = interaction.options?.getString("categoryid");
        let emojiID: string | null = interaction.options?.getString("emojiid");

        const emoji: Emoji | null = interaction.guild?.emojis?.cache?.get(emojiID!)!;
        const category: any = interaction.guild?.channels?.cache?.get(categoryid!);
        
        if(!category)
            return void interaction.followUp({ embeds: [errorEmbed("Unable to find the speficied category.")]})

        if (!guild.ticketService?.data[category.name!]!) {
            if (Object.keys(guild.ticketService?.data!)?.length! >= 5)
                return void interaction.followUp({ embeds: [errorEmbed("`You have reached the \`maximum\` ticket categories for this guild!`")] });
            let object: Object = { enabled: true, name: category.name, category: category.id,emoji: emojiID?.toLowerCase() === "default" ? i : emoji != null ? `<:${emoji.name}:${emoji.id}>` : i };
            await (await getDatabase(interaction.guild!)).push(`/${interaction.guild?.id}/ticketService/data/${category}`, object, true);
            return void interaction.followUp({ embeds: [successEmbed(`Successfully added the category "\`${category.name}\`" to the guild database!`)] });
        }

        return void interaction.followUp({ embeds: [errorEmbed(`Unable to add a ticket category with the name "\`${category.name}}\`" as it already exists!`)] });            
    }
}