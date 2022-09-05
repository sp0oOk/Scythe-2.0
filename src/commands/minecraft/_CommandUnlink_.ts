import { SlashCommandBuilder, SlashCommandUserOption } from "@discordjs/builders";
import { CacheType, Client, CommandInteraction, User } from "discord.js";
import { FieldInfo, MysqlError } from "mysql";
import { database } from "../../handlers/PMinecraftHandler";
import { PCommand } from "../../interfaces/PCommand";
import { errorEmbed, successEmbed } from "../../misc/PUtilities";

export const _CommandUnlink_: PCommand = {
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
        .setName("unlink")
        .addUserOption((opt: SlashCommandUserOption) => opt.setName("user").setDescription("User to remover verification from").setRequired(true))
        .setDescription("Administrative unlink command to force removal of verification"),
    execute: async function (client: Client<boolean>, interaction: CommandInteraction<CacheType>): Promise<void> {
        const user: User = interaction.options.getUser("user", true);
        database.query("SELECT * FROM users WHERE discordID = \"" + user.id + "\"", async (error: MysqlError, results?: any, _fields?: FieldInfo[]) => {
            if(error) {
                console.log("An internal SQL error occurred: " + error);
                return void interaction.followUp({ content: null, embeds: [errorEmbed("An internal error occurred whilst removing minecraft link: `" + error + "`")] });
            }
            if(results.length < 1) return void interaction.followUp({ content: null, embeds: [errorEmbed(`This user is not currently synchronized, cannot unlink!`)] });
            database.query("DELETE FROM users WHERE discordID = " + user.id, async (error: MysqlError, _result: any) => {
                if(error) return void interaction.followUp({ content: null, embeds: [errorEmbed(`An internal error occurred whilst deleting the user column: \`${error}\``)] });
                return void interaction.followUp({ content: null, embeds: [successEmbed(`Successfully unlinked <@${user.id}>, they can now re-verify!`)], allowedMentions: { users: [] } });
            });

        });
    }
}