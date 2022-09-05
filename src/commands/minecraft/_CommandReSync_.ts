import { SlashCommandBuilder } from "@discordjs/builders";
import { CacheType, Client, CommandInteraction } from "discord.js";
import { database } from "../../handlers/PMinecraftHandler";
import { PCommand } from "../../interfaces/PCommand";
import { db } from "../../config.json";
import { errorEmbed, successEmbed } from "../../misc/PUtilities";
import { FieldInfo, MysqlError } from "mysql";

export const _CommandReSync: PCommand = {
    category: "Minecraft",
    aliases: [],
    deletedPostExecution: false,
    cooldown: 30,
    defaults: [],
    usage: "/resync",
    examples: [],
    details: "Can be used to fix where the bot has missed updating your data server-side e.g. if in-game says you are not boosting when you are!",
    premium: false,
    data: new SlashCommandBuilder()
        .setName("resync")
        .setDescription("Resynchronizes your data"),
    execute: async function (_client: Client<boolean>, interaction: CommandInteraction<CacheType>): Promise<void> {
        database.query("SELECT * FROM users WHERE discordID = " + interaction.user.id, async (error: MysqlError, result?: any, fields?: FieldInfo[]) => {
            if(error) return void interaction.followUp({ content: null, embeds: [errorEmbed(`Failed to query the database: \`` + error + "\`")] });
            if(result.length < 1) return void interaction.followUp({ content: null, embeds: [errorEmbed(`You are not currently synced, type /sync in-game!`)] });
            database.query(`UPDATE users SET boosting = ${interaction.guild?.members.cache.get(interaction.user.id)?.roles.cache.has(db["boost-role"])} WHERE discordID = ` + interaction.user.id, async (error: MysqlError, affected?: any) => {
                if(error) return void interaction.followUp({ content: null, embeds: [errorEmbed(`Failed to update the database: \`` + error + "\`")] });
                return void interaction.followUp({ content: null, embeds: [successEmbed(`Successfully resynchronized **ALL** your stored data!`)] });
            });
        });
    }
}