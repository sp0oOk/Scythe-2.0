import { SlashCommandBuilder } from "@discordjs/builders";
import { CacheType, Client, CommandInteraction, MessageEmbed } from "discord.js";
import { PCommand } from "../../interfaces/PCommand";
import { errorEmbed, getDatabase, successEmbed, validURLCheck } from "../../misc/PUtilities";

export const _CommandRankcard_: PCommand = {
    category: "Settings",
    aliases: [],
    deletedPostExecution: false,
    cooldown: 5,
    defaults: ["MANAGE_GUILD"],
    usage: "/rankcard [\"set\" | \"reset\"] [URL]",
    examples: [],
    details: "",
    premium: false,
    data: new SlashCommandBuilder()
        .setName("setlevelbackground")
        .addStringOption((opt) => opt.setName("operation").setDescription("Add, Remove or List Background URLs").setRequired(true))
        .addStringOption((opt) => opt.setName("link").setDescription("Link to set as background").setRequired(false))
        .setDescription("Set a custom rank-card for the guild levelling system"),
    execute: async function (client: Client<boolean>, interaction: CommandInteraction<CacheType>): Promise<void> {
        const operation: string | null = interaction.options.getString("operation");
        
        const guild: object | any = (await getDatabase(interaction.guild!)).getObject(`/${interaction.guild?.id!}`);
        
        if(operation?.toLowerCase() == "add" ) {
            const link: string | null = interaction.options.getString("link");
            if(!link) return void interaction.followUp({ embeds: [errorEmbed("No Link Provided.")]});
            if(!validURLCheck(link!)) return void interaction.followUp({ embeds: [errorEmbed("The link that was provided is invalid.")]});

            guild.levelSystem?.links?.push(link);

            (await getDatabase(interaction.guild!)).push(`/${interaction.guildId!}/levelSystem/links`, guild.levelSystem?.links, true);
            interaction.followUp({ embeds: [successEmbed("")]})
        }

        if(operation?.toLowerCase() == "remove") {
            const link: string | null = interaction.options.getString("link");
            if(!link) return void interaction.followUp({ embeds: [errorEmbed("No Link Provided.")]});
            if(!validURLCheck(link!)) return void interaction.followUp({ embeds: [errorEmbed("The link that was provided is invalid.")]});

            let updated = remove(guild.levelSystem?.links, link);

            (await getDatabase(interaction.guild!)).push(`/${interaction.guildId!}/levelSystem/links`, updated, true);
        }

        if(operation?.toLowerCase() == "list") {
            return void interaction.followUp({ content: `**The background links for ${interaction.guild?.name!}:**\n\`\`\`\n${guild.levelSystem.links.join("\n")}\n\`\`\``});
        }

    }
}


async function remove(arr: Array<string>, target: string) {
    var i = 0;
    while (i < arr.length) {
      if (arr[i] === target) {
        arr.splice(i, 1);
      } else {
        ++i;
      }
    }
    return arr;
}