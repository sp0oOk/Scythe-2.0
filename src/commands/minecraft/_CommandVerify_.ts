import { SlashCommandBuilder, SlashCommandStringOption } from "@discordjs/builders";
import { CacheType, Client, CommandInteraction } from "discord.js";
import { FieldInfo, MysqlError } from "mysql";
import { database } from "../../handlers/PMinecraftHandler";
import { PCommand } from "../../interfaces/PCommand";
import { errorEmbed, successEmbed } from "../../misc/PUtilities";
import { db } from "../../config.json";
import minecraftPlayer from "minecraft-player";

export const _CommandVerify_: PCommand = {
    category: "Minecraft",
    aliases: [],
    deletedPostExecution: false,
    cooldown: 10,
    defaults: [],
    usage: "/verify <code>",
    examples: [],
    details: "Link your minecraft account to discord and receive exclusive in-game benefits!",
    premium: false,
    data: new SlashCommandBuilder()
        .setName("verify")
        .addStringOption((opt: SlashCommandStringOption) => opt.setName("code").setDescription("Your verification card (starts with VV-)").setRequired(true))
        .setDescription("Attempts to link your discord account to your minecraft account"),
    execute: async function (_client: Client<boolean>, interaction: CommandInteraction<CacheType>): Promise<void> {
        const code: string = interaction.options.getString("code", true);
        database.query(`SELECT * FROM users WHERE verifiedWith = \"${code}\"`, async (err: MysqlError, results?: any, _fields?: FieldInfo[]) => {
            if(err) { 
                console.log("[SQL-ERR] Minecraft module verification failed:\n" + err);
                return void interaction.followUp({ content: null, embeds: [errorEmbed("Verification failed, contact an admin immediately")], ephemeral: true })
            }
            if(results.length < 1) return void interaction.followUp({ content: null, embeds: [errorEmbed("Verification failed, contact an admin immediately")], ephemeral: true });
            if(results[0].discordID !== -1) return void interaction.followUp({ content: null, embeds: [errorEmbed(`You are already linked as **${results[0].name}**!`)] });
            const uuid: string = results[0].uuid;
            database.query(`UPDATE users SET discordID = \"${interaction.user.id}\", boosting = ${interaction.guild?.members.cache.get(interaction.user.id)?.roles.cache.has(db["boost-role"])} WHERE uuid = \"${uuid}\"`, async (err: MysqlError, _results?: any) => {
                if(err) { 
                    console.log("[SQL-ERR] Minecraft module, update query failed:\n" + err);
                    return void interaction.followUp({ content: null, embeds: [errorEmbed("Verification failed, contact an admin immediately", "SQL_OR_OTHER")], ephemeral: true })
                }
                console.log(`[MC] ${interaction.user.id} has been linked to the user ${(await minecraftPlayer(uuid)).username}`);
                return void interaction.followUp({ content: null, embeds: [successEmbed("You have been successfully verified :ok_hand:")], ephemeral: true });
            });
        });
    }
}