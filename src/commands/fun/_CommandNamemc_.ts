import { SlashCommandBuilder } from "@discordjs/builders";
import { CacheType, Client, CommandInteraction, MessageEmbed } from "discord.js";
import { PCommand } from "../../interfaces/PCommand";
import { errorEmbed, minecraft, multi, primary, single } from "../../misc/PUtilities";
import { nameHistoryForUuid, NameHistoryResponseModel, uuidForName } from "minecraft-api";
import { Customize } from "../../config.json";

export const _CommandNamemc_: PCommand = {
    category: "Fun",
    aliases: [],
    deletedPostExecution: false,
    cooldown: 5,
    defaults: [],
    usage: "/namemc <\"ign\">",
    examples: [],
    details: "",
    premium: false,
    data: new SlashCommandBuilder()
        .setName("namemc")
        .addStringOption((opt) => opt.setName("ign").setDescription("\"IGN\" references the users in-game-name (profile to search for)").setRequired(true))
        .setDescription("Fetches a NameMC profile from a given string"),
    execute: async function (client: Client<boolean>, interaction: CommandInteraction<CacheType>): Promise<void> {
        const name: string | null = interaction.options.getString("ign");
        if(name === null) return void interaction.followUp({ content: null, embeds: [errorEmbed(`The 'IGN' argument was not **specified** or was \`null\`!`)] });
        let result: string = await uuidForName(name!).catch(e => result = "");
        if(result === "") return void interaction.followUp({ content: null, embeds: [errorEmbed(`The 'IGN' argument provided is either **__invalid__** or an API error occurred!`)] });
        const name_history: NameHistoryResponseModel[] = await nameHistoryForUuid(result);
        const embed: MessageEmbed = new MessageEmbed();
        embed.setAuthor(`Minecraft User ⦁ ${name.toUpperCase()}`, minecraft);
        embed.setDescription(`Name minecraft user \`${name.toUpperCase()}\` has a total of **\`${name_history.length}\`** usernames with the latest entry being \`${name_history[name_history.length -1].name}\``);
        embed.addField(`First 10 Usernames ─`, Array.from(name_history.map((value, index) => `${index === 9 ? single : multi}**${index + 1}.** ${value.name}`)).slice(0, 10).join("\n"));
        embed.setColor(primary);
        embed.setFooter(Customize["embed-footer"]);
        embed.setThumbnail(`https://crafatar.com/renders/body/${result}?scale=7&overlay`);
        return void interaction.followUp({ content: null, embeds: [embed] });
    }
}