import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction, MessageEmbed, version } from "discord.js";
import { PCommand } from "../../interfaces/PCommand";
import { multi, primary, single } from "../../misc/PUtilities";
import { Customize } from "../../config.json";
import { validPermCmd } from "../../events";
import moment from "moment";

export const _CommandBotInfo_: PCommand = {
    category: "Information",
    aliases: [],
    deletedPostExecution: false,
    cooldown: 0,
    defaults: [],
    usage: "/botinfo",
    examples: [],
    details: "",
    premium: false,
    data: new SlashCommandBuilder()
        .setName("botinfo")
        .setDescription("Returns some information regarding Scythe"),
    execute: async (client: Client, interaction: CommandInteraction) => {
        const embed: MessageEmbed = new MessageEmbed();
        embed.setAuthor(`PvPLabs v1.0 ⦁ Bot Information`, client.user?.avatarURL()!);
        embed.setDescription(`**__PvPLabs__** is a universal discord bot created to make your life easier on discord by providing a range of \`moderation\` commands and more!`);
        embed.addField("Information", ` ${multi}Ping: \`🏓 ${client.ws.ping.toFixed(0)}ms\`\n ${multi}Commands Loaded: \`${validPermCmd.size}\`\n ${multi}RAM Usage: \`${((process.memoryUsage().rss / 1024) / 1024).toFixed(2)}mb\`\n ${multi}System Uptime: \`${moment.duration(client.uptime).humanize()}\`\n ${multi}Library <:discord:919295838910545951>: \`Discord JS v${version}\`\n ${multi}Language <:typescript:919295838017163284>: \`TypeScript\`\n ${multi}Node.js <:nodejs:919295837845209098>: \`${process.version}\`\n ${multi}Developers: spook * yousef`, false);
        embed.addField("Stats ─", ` ${multi}Total Guilds: \`${interaction.client.guilds.cache.size}\`\n ${multi}Total Channels: \`${client.channels.cache.size}\` (**\`${interaction.guild?.channels.cache.size}\`** in this guild)\n ${multi}Total Users: \`${client.users.cache.size}\` (**\`${interaction.guild?.members.cache.size}\`** in this guild)`, false);
        embed.addField("API ─", ` ${multi}Database: \`Operational\`\n ${single}Discord API: \`Operational\``, true);
        embed.setColor(primary);
        embed.setFooter(Customize["embed-footer"]);
        return void interaction.followUp({ content: null, embeds: [embed] });
    }
}