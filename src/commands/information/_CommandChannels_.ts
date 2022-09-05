import { SlashCommandBuilder } from "@discordjs/builders";
import { CategoryChannel, Client, CommandInteraction, GuildChannel, MessageEmbed, ThreadChannel } from "discord.js";
import { PCommand } from "../../interfaces/PCommand";
import { category, page_Embed, primary, text, voice } from "../../misc/PUtilities";
import { Customize } from "../../config.json";

export const _CommandChannels_: PCommand = {
    category: "Information",
    aliases: [],
    deletedPostExecution: false,
    cooldown: 0,
    defaults: [],
    usage: "/channels",
    examples: [],
    details: "",
    premium: false,
    data: new SlashCommandBuilder()
        .setName("channels")
        .addNumberOption((opt) => opt.setName("page").setDescription("Index of channel pages (default: 1)").setRequired(false))
        .setDescription("Returns the first 10 channels in the guild"),
    execute: async (client: Client, interaction: CommandInteraction) => {
        let page: number | null | undefined = interaction.options.getNumber("page");
        if(page === null)
            page = undefined;
        let data: Array<string> = [];
        interaction.guild?.channels.cache.forEach(async (channel: CategoryChannel | GuildChannel | ThreadChannel | any) => {
            if(channel.type === "GUILD_CATEGORY")
                data.push(`${category} \`${channel.name}\` — **ID:** **\`${channel.id}\`** — Contains **${channel.children.size}** channels`);
            if(channel.type === "GUILD_TEXT")
                data.push(`${text} <#${channel.id}> — **ID:** **\`${channel.id}\`** — Can be seen by **${channel.members.filter((m: any) => m.permissions.has("VIEW_CHANNEL")).size}** members`);
            if(channel.type === "GUILD_VOICE")
                data.push(`${voice} <#${channel.id}> — **ID:** **\`${channel.id}\`** — **${channel.members.filter((m: any) => m.permissions.has("CONNECT")).size}** members can join`);
        });
        return void page_Embed(data, 10, page, "\n", Customize["embed-footer"] + " | " + "Page {pageMin} of {pageMax}", `Guild Channel(s) ⦁ ${interaction.guild?.name}`, `There are currently \`${interaction.guild?.channels.cache.size}\` total channels in the guild \`${interaction.guild?.name}\` (**\`${interaction.guild?.id}\`**)`, true, "Channels ─", false, primary, interaction);
    }
}