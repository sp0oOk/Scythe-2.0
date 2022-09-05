import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction, PermissionString } from "discord.js";

export interface PCommand {
    category: string
    aliases: Array<string>,
    deletedPostExecution: boolean,
    cooldown: number,
    defaults: Array<PermissionString>,
    usage: string,
    examples: Array<string>,
    details: string,
    premium: boolean,
    data: SlashCommandBuilder,
    execute: (client: Client, interaction: CommandInteraction) => Promise<void>
}
