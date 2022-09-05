import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction } from "discord.js";
import { PCommand } from "../../interfaces/PCommand";
import { errorEmbed, getDatabase, successEmbed } from "../../misc/PUtilities";
import { blacklisted_channels } from "../../events";

export const _CommandBlacklist_: PCommand = {
    category: "Settings",
    aliases: [],
    deletedPostExecution: false,
    cooldown: 0,
    defaults: ["MANAGE_GUILD"],
    usage: "/blacklist [\"Channel-Resolvable\" | \"*\"]",
    examples: ["\`/blacklist #general\`", "\`/blacklist *\`"],
    details: "The argument \`\"channe-resolvable\"\` refers to a **tagged channel**\nand the \`\"*\"\` argument allows you to blacklist every channel **except** the execution channel (i.e. bot-commands)",
    premium: false,
    data: new SlashCommandBuilder()
        .setName("blacklist")
        .addStringOption((opt) => opt.setName("operation").setDescription("Channel resolvable to blacklist or * representing ALL").setRequired(true))
        .setDescription("Blacklist channels to halt command execution/spam"),
    execute: async (client: Client, interaction: CommandInteraction) => {
        const operation: string | null = interaction.options.getString("operation");
        if(operation === null) return void interaction.followUp({ content: null, embeds: [errorEmbed(`For some reason the \`operation\` argument was null! please try again.. If the error persists contact an administrator.`)] });
        if(operation.match(/(?<=\<#)[0-9]+(?=\>)/gm)) {
            let guild_blacklisted: Array<string> = await (await getDatabase(interaction.guild!)).getData(`/${interaction.guild?.id!}/blacklistChannels`);
            if(guild_blacklisted.includes(operation.match(/(?<=\<#)[0-9]+(?=\>)/gm)![0])) {
                guild_blacklisted = guild_blacklisted.filter(it => it !== operation.match(/(?<=\<#)[0-9]+(?=\>)/gm)![0]);
                (await getDatabase(interaction.guild!)).push(`/${interaction.guild?.id!}/blacklistChannels`, guild_blacklisted, true);
                blacklisted_channels.set(interaction.guild!, guild_blacklisted);
                return void interaction.followUp({ content: null, embeds: [successEmbed(`Successfully removed <#${operation.match(/(?<=\<#)[0-9]+(?=\>)/gm)![0]}> from the blacklisted channel list!`)] });
            }
            guild_blacklisted.push(operation.match(/(?<=\<#)[0-9]+(?=\>)/gm)![0]);
            (await getDatabase(interaction.guild!)).push(`/${interaction.guild?.id!}/blacklistChannels`, guild_blacklisted, true);
            blacklisted_channels.set(interaction.guild!, guild_blacklisted);
            return void interaction.followUp({ content: null, embeds: [successEmbed(`Successfully added <#${operation.match(/(?<=\<#)[0-9]+(?=\>)/gm)![0]}> to the blacklisted channels list!`)] });
        }

        if(operation === "*" || operation === "all") {
            let _blacklisted: Array<string> | any = interaction.guild?.channels.cache.map(chan => chan.id);
            _blacklisted = _blacklisted?.filter((it: string | undefined) => it !== interaction.channel?.id);
            (await getDatabase(interaction.guild!)).push(`/${interaction.guild?.id!}/blacklistChannels`, _blacklisted, true);
            blacklisted_channels.set(interaction.guild!, _blacklisted);
            return void interaction.followUp({ content: null, embeds: [successEmbed(`Successfully set **\`EVERY\`** channel to be blacklisted excluding <#${interaction.channel?.id}>`)] });
        }
        return void interaction.followUp({ content: null, embeds: [errorEmbed(`The operation provided **__was not__** valid, options include \`Channel resolvable; * | all\``)] });
    }
}