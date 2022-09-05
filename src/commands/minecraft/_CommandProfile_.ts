import { SlashCommandBuilder, SlashCommandUserOption } from "@discordjs/builders";
import { CacheType, Client, CommandInteraction, MessageEmbed, User } from "discord.js";
import minecraftPlayer from "minecraft-player";
import { FieldInfo, MysqlError } from "mysql";
import { database } from "../../handlers/PMinecraftHandler";
import { PCommand } from "../../interfaces/PCommand";
import { errorEmbed, multi, primary, single } from "../../misc/PUtilities";
import { Customize } from "../../config.json";

export const _CommandProfile_: PCommand = {
    category: "Minecraft",
    aliases: [],
    deletedPostExecution: false,
    cooldown: 0,
    defaults: ["ADMINISTRATOR"],
    usage: "",
    examples: [],
    details: "",
    premium: false,
    data: new SlashCommandBuilder()
        .setName("profile")
        .addUserOption((opt: SlashCommandUserOption) => opt.setName("user").setDescription("User to retrieve information about").setRequired(true))
        .setDescription("Find out whose linked to what minecraft account as-well as some extra details"),
    execute: async function (client: Client<boolean>, interaction: CommandInteraction<CacheType>): Promise<void> {
        const user: User = interaction.options.getUser("user", true);
        let object: any;
        database.query("SELECT * FROM users WHERE discordID = " + user.id, async (error: MysqlError, results?: any, fields?: FieldInfo[]) => {
            if(error) return void interaction.followUp({ content: null, embeds: [errorEmbed(`An internal error occurred whilst selecting column: \`${error}\``)] });
            if(results.length < 1) return void interaction.followUp({ content: null, embeds: [errorEmbed(`This user is not currently synchronized, cannot retrieve details!`)] });
            object = results[0];
            const embed: MessageEmbed = new MessageEmbed();
        const player: minecraftPlayer.ReturnValue = await minecraftPlayer(object["uuid"]);
        const users: Array<string> = player.usernameHistory.map(m => m.username).splice(player.usernameHistory.length - 5, 5);
        embed.setAuthor({ iconURL: "https://cdn.discordapp.com/attachments/919173312372965377/973571803844870205/default-spinner.gif", name: `${user.username}'s Profile (${player.username})` });
        embed.setThumbnail(`https://crafatar.com/renders/body/${object["uuid"]}`);
        embed.setDescription("Listed below is some detail about the player and their verification status!");
        embed.addField("Status:", `${multi}Username: \`${player.username}\`\n${multi}Boosting: \`${object["boosting"] ? "Active" : "Inactive"}\`\n${multi}Stored UUID: \`${object["uuid"]}\`\n${single}Discord ID: <@${user.id}> [\`${user.id}\`]`, true);
        embed.addField("Last 5 Usernames:", users.map(m => users.indexOf(m) === users.length - 1 ? `${single}${m}` : `${multi}${m}`).join("\n"), false);
        embed.setFooter({ text: Customize["embed-footer"] });
        embed.setColor(primary);
        return void interaction.followUp({ content: null, embeds: [embed] });
        });
    }
}