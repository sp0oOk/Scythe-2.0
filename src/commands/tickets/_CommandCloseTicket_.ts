import { SlashCommandBuilder } from "@discordjs/builders";
import { CacheType, Client, Collection, CommandInteraction, GuildMember, Message, MessageAttachment, MessageEmbed, TextBasedChannel, User } from "discord.js";
import moment from "moment";
import { PCommand } from "../../interfaces/PCommand";
import { i } from "../../main";
import { errorEmbed, fetchAllMessages, getDatabase, primary, successEmbed } from "../../misc/PUtilities";
import fs from "fs";
import { Customize } from "../../config.json";
import { userData } from "../../events";

export const _CommandCloseTicket_: PCommand = {
    category: "Tickets",
    aliases: [],
    examples: [],
    usage: "/closeticket <reason>",
    deletedPostExecution: true,
    cooldown: 0,
    premium: false,
    defaults: ["ADMINISTRATOR"],
    details: "",
    data: new SlashCommandBuilder()
        .setName("closeticket")
        .addStringOption((opt) => opt.setName("reason").setDescription("Reason of ticket closure").setRequired(true))
        .setDescription("Attempts to close ticket"),
    execute: async (client: Client, interaction: CommandInteraction<CacheType>) => {
        let guild: Object | any = await (await getDatabase(interaction.guild!)).getObject(`/${interaction.guild?.id}`);
        if (!guild.ticketService?.enabled!)
            return void interaction.followUp({ embeds: [errorEmbed(`You cannot use \`commands\` related to the \`Ticket Service\` as it is currently \`disabled\`!`)] });
        if(!fs.existsSync(`./transcripts`)) await fs.mkdirSync(`./transcripts/`);
        if(!fs.existsSync(`./transcripts/${interaction.guild?.id}`)) await fs.mkdirSync(`./transcripts/${interaction.guild?.id}`);
        
            let reason: string | null = interaction.options.getString("reason");
        //@ts-ignore
        if (!guild.ticketService.data[interaction.channel?.parent!])
            return void interaction.followUp({ embeds: [errorEmbed(`You cannot use \`commands\` related to the \`Ticket Service\` as this is not a ticket channel.`)] });
        
        let messages: Collection<string, Message> = await (await fetchAllMessages(interaction.channel!));

        const content = messages.map(m => `${moment(m.createdAt).format('MMMM Do YYYY, h:mm:ss a')} GMT, ${m.author.tag} - ${m.content || m.attachments.first()?.proxyURL || `Message has No Content or Attachments.`}`);
        
        

        fs.writeFileSync(`./transcripts/${interaction.guild?.id!}/Ticket-${guild.ticketService.activeTickets[interaction.channel?.id!].tnumber}.txt`, content.join('\n'));
        //@ts-ignore
        interaction.channel?.delete({ reason: `Ticket ${guild.ticketService.activeTickets[interaction.channel?.id!].tnumber} Closed By ${interaction.user.tag}`});

        const logChannel: TextBasedChannel | any = interaction.guild?.channels.cache.get(guild.ticketService?.logChannel!);
        //@ts-ignore
        const logEmbed: MessageEmbed = new MessageEmbed()
            .setAuthor({ name: `Ticket ${guild.ticketService.activeTickets[interaction.channel?.id!].tnumber} has been closed.`})
            .setColor(primary)
            .addFields(
				{ name: 'Ticket ID', value: `\`${guild.ticketService.activeTickets[interaction.channel?.id!].tnumber}\``, inline: true },
				{ name: 'Closed By', value: `\`${interaction.user.tag}\``, inline:true },
				{ name: 'Reason for Close', value: `\`${reason}\`` || '\`No Reason Provided\`', inline: true },
			)
            .setFooter({ text: Customize["embed-footer"], iconURL: interaction.guild?.iconURL({ size: 512, dynamic: true }) });
        if(logChannel) await logChannel.send({ embeds: [logEmbed] });
        let ticketinfo = guild.ticketService.activeTickets[interaction.channelId];
        //@ts-ignore
        const user: User | undefined = client.users.cache.get(ticketinfo.author);
        const attachment: MessageAttachment = new MessageAttachment(`./transcripts/${interaction.guild?.id!}/Ticket-${ticketinfo.tnumber}.txt`, `Ticket-${interaction.guild?.id!}/Ticket-${ticketinfo.tnumber}.txt`);
        if(user) user?.send({ embeds: [ logEmbed ],  files: [attachment]}).catch(err => console.log(`DM Error - ${err}`));
        if(!userData.get(interaction.guild?.id!)[interaction.user?.id!]) {
            userData.get(interaction.guild?.id!)[interaction.user?.id!] = {
                xp: 0,
                level: 1,
                totalxp: 0,
                messages: 0,
                opened: 0,
                closed: 0
            }
        }
        (await getDatabase(interaction.guild!)).delete(`/${interaction.guild?.id}/ticketService/activeTickets/${interaction.channel?.id!}`);
        userData.get(interaction.guildId!)[interaction.user?.id!].closed = userData.get(interaction.guildId!)[interaction.user?.id!].closed + 1;
        return;
    }
}