import { SlashCommandBuilder } from "@discordjs/builders";
import { CacheType, Client, CommandInteraction, MessageEmbed, User } from "discord.js";
import { PCommand } from "../../interfaces/PCommand";
import { errorEmbed, getDatabase, primary } from "../../misc/PUtilities";
import { Customize } from "../../config.json";
import { userData } from "../../events";

export const _CommandTicketStats_: PCommand = {
    category: "Tickets",
    aliases: [],
    examples: ["/ticketstats"],
    usage: "/ticketstats [User]",
    deletedPostExecution: true,
    cooldown: 0,
    premium: false,
    defaults: ["ADMINISTRATOR"],
    details: "",
    data: new SlashCommandBuilder()
        .setName("ticketstats")
        .addUserOption((opt) => opt.setName("user").setDescription("User to see ticket stats").setRequired(false))
        .setDescription("Get ticket stats for a user"),
    execute: async (client: Client, interaction: CommandInteraction<CacheType>) => {
        let guild: Object | any = await (await getDatabase(interaction.guild!)).getObject(`/${interaction.guild?.id}`);
        if (!guild.ticketService?.enabled!)
            return void interaction.followUp({ embeds: [errorEmbed(`You cannot use \`commands\` related to the \`Ticket Service\` as it is currently \`disabled\`!`)] });
        const user: User = interaction.options.getUser("user") || interaction.user;
        const userStats: Object | any = userData.get(interaction.guildId!)[user.id!];
            //@ts-ignore
        const embed = new MessageEmbed()
            .setAuthor({ name: `Ticket Stats For ${user.tag}`, iconURL: user.displayAvatarURL({ size: 512, dynamic: true })})
            .setColor(primary)
            .addFields([
                { name: "Tickets Opened", value: userStats?.opened ? `${userStats?.opened}` : `\`None\``, inline: true },
                { name: "Tickets Closed", value: userStats?.closed ? `${userStats?.closed}` : `\`None\``, inline: true }
            ])
            .setFooter({ text: Customize["embed-footer"] });
         
        
        return void interaction.followUp({ embeds: [ embed ] });
    }
}