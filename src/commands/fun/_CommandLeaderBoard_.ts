import { SlashCommandBuilder } from "@discordjs/builders";
import { BufferResolvable, Client, CommandInteraction, MessageAttachment, MessageEmbed } from "discord.js";
import { PCommand } from "../../interfaces/PCommand";
import { getDatabase, getUsers, primary, userObject } from "../../misc/PUtilities";
import { User } from "discord.js";
import { levelSettings, userData } from "../../events";
import { createCanvas, Canvas, loadImage } from "canvas";
import { Rank } from "canvacord";
import chalk from "chalk";

export const _CommandLeaderboard_: PCommand = {
    category: "Fun",
    aliases: [],
    deletedPostExecution: false,
    cooldown: 0,
    defaults: [],
    usage: "/leaderboard",
    examples: [],
    details: "",
    premium: false,
    data: new SlashCommandBuilder()
        .setName("leaderboard")
        .setDescription("Returns the Leader Boards for"),
    execute: async (client: Client, interaction: CommandInteraction) => {
    }
}