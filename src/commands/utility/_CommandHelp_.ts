import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction, MessageEmbed } from "discord.js";
import { getHelpEmbed } from "../../events";
import { PCommand } from "../../interfaces/PCommand";
import { footer, w } from "../../main";
import { getCommand, getDatabase, multi, primary, single } from "../../misc/PUtilities";

export const _CommandHelp_: PCommand = {
    category: "Utilities",
    aliases: [],
    deletedPostExecution: false,
    cooldown: 0,
    defaults: [],
    usage: "/help [command]",
    examples: [],
    details: "",
    premium: false,
    data: new SlashCommandBuilder()
        .setName("help")
        .addStringOption((opt) => opt.setName("command").setDescription("Specific command to search for help on.").setRequired(false))
        .setDescription("Simply a help command :)"),
    execute: async (client: Client, interaction: CommandInteraction) => {
        const str: string = interaction.options.getString("command")!;
        if (str !== null) {
            const command: PCommand | null = await getCommand(str);
            if (command === null) return void interaction.followUp({ content: w + "The **command** specified does not exist, try again." });
            const embed: MessageEmbed = new MessageEmbed();
            embed.setAuthor(`Command ➠ ${command.data.name} [Guild-Only]`);
            embed.setDescription(command.data.description);
            let permissions: Array<string> = [];
            let roles: Array<string> = [];
            let d: boolean = false;
            if(!(await getDatabase(interaction.guild!)).exists(`/${interaction.guild?.id}/commands/${command.data.name}`)) {
                command.defaults.map((entry: any) => { permissions.push(`\`${entry}\``); });
                d = true;
            } else {
                let r = (await getDatabase(interaction.guild!)).getData(`/${interaction.guild?.id}/commands/${command.data.name}/permissions/roles`);
                let p = (await getDatabase(interaction.guild!)).getData(`/${interaction.guild?.id}/commands/${command.data.name}/permissions/permissions`);
                if(p.length >= 1)
                    p.map((entry: any) => { permissions.push(`\`${entry}\``); });
                if(r.length >= 1)
                    r.map((entry: any) => { roles.push(`<@&${entry}>`); });  
            }
            embed.setAuthor(`/${command.data.name} [Guild-only]`, client.user?.avatarURL()!);
            embed.setDescription(command.data.description);
            embed.addField(`Command ─`, ` ${multi}Usage: \`${command.usage}\`\n ${multi}Examples: ${command.examples.length >= 1 ? command.examples.join(", ") : "\`No examples provided\`"}\n ${multi}Group: \`${command.category}\` (\`${command.category.toLowerCase()}:${command.data.name.toLowerCase()}\`)\n ${multi}Aliases: \`${command.aliases.length < 1 ? "No aliases Provided" : command.aliases.join(", ")}\`\n ${multi}Cooldown: \`${command.cooldown}s\`\n ${multi}Permissions(**${permissions.length}**): ${permissions.length < 1 ? "`open to everyone`" : permissions.join(", ")}${d === true ? " (default)" : ""}\n ${single}Roles(**${roles.length}**): ${roles.length >= 1 ? roles.join(", ") : "\`No roles currently set.\`"}`, false);
            if(command.details.length >= 1)
                embed.addField(`Details ─`, command.details, false);
            embed.setColor(primary);
            embed.setFooter(footer);
            return void interaction.followUp({ content: null, embeds: [embed] });
        }

        

        if (str === null) {
            return void interaction.followUp({ content: null, embeds: [getHelpEmbed] });
        }
    }
}