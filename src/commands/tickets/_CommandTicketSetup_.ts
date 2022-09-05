import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed, MessageActionRow, MessageSelectMenu, Client, CommandInteraction, CacheType } from "discord.js";
import { PCommand } from "../../interfaces/PCommand";
import { errorEmbed, getDatabase, primary } from "../../misc/PUtilities";
import { Customize } from "../../config.json";

export const _CommandSetupTickets_ : PCommand = {
    category: "Tickets",
    aliases: [],
    examples: [],
    usage: "/setuptickets",
    deletedPostExecution: false,
    cooldown: 0,
    premium: false,
    defaults: ["ADMINISTRATOR"],
    details: "",
    data: new SlashCommandBuilder()
        .setName("setuptickets")
        .setDescription("Sets up embed for tickets."),
    execute: async (client: Client, interaction: CommandInteraction<CacheType>) => {
        let object: Object | any = await (await getDatabase(interaction.guild!)).getObject(`/${interaction.guild?.id}`);
        if (!object.ticketService?.enabled!)
            return void interaction.followUp({ embeds: [errorEmbed(`You cannot use \`commands\` related to the \`Ticket Service\` as it is currently \`disabled\`!`)] });
        if (object.ticketService?.channels?.includes(interaction.channel?.id)!)
            return void interaction.followUp({ embeds: [ errorEmbed(`This channel is already a \`ticket-embed\` channel! (If you deleted the embed, you can \`/deleteticketchannel\` to remove it from the database!)`)]});
        if (object.ticketService?.data?.length < 1)
            return void interaction.followUp({ embeds: [ errorEmbed(`There is currently no saved data for this guild, please add a associated emoji/category first! \`/addcategory\``) ] });
        let data: Object = object.ticketService?.data!;
        let valid_categories: Array<string> = [];
        let current_channels: Array<string> = object.ticketService?.channels!;
        let embed: MessageEmbed = new MessageEmbed();
        embed.setDescription(object.ticketService?.description?.length! >= 1 ? object.ticketService?.description : "Utilise the `selection-menu` to open a guild ticket related\nto your topic of **interest**.\n\n**NOTE:** Spam-creating tickets will get you \`Blacklisted\`\nfrom using any ticket-related commands in the future!");
        embed.setColor(primary);
        embed.setFooter(Customize["embed-footer"])
        const mommy = new MessageActionRow();
        let menu = new MessageSelectMenu();
        menu.setCustomId(`tickets-${interaction.guild?.id}`);
        menu.setPlaceholder("Select category");
        Object.keys(data).forEach(async (key) => {
            menu.addOptions({ label: data[key].name, description: `Click to open a ${data[key].name} ticket`, value: key });
            if (typeof data[key] === 'object')
                valid_categories.push(` ⁎ ${data[key].emoji} **${data[key].name}**`);
        });
        embed.addField(`Ticket ${valid_categories.length === 1 ? "Category" : "Categories"}`, `${valid_categories.length >= 1 ? valid_categories.join("\n") : "Unable to fetch data!"}`, true);
        mommy.addComponents(menu);
        current_channels.push(interaction.channel?.id!);
        (await getDatabase(interaction.guild!)).push(`/${interaction.guild?.id}/ticketService/channels`, current_channels, true);
        return void interaction.followUp({ content: null, embeds: [embed], components: [mommy] });
         
    }    
};
