import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction, MessageEmbed } from "discord.js";
import { PCommand } from "../../interfaces/PCommand";
import { primary } from "../../misc/PUtilities";

export const _CommandCoinflip_: PCommand = {
    category: "Fun",
    aliases: [],
    deletedPostExecution: false,
    cooldown: 0,
    defaults: [],
    usage: "/coinflip",
    examples: [],
    details: "",
    premium: false,
    data: new SlashCommandBuilder()
        .setName("coinflip")
        .setDescription("Flips a coin (heads or tails)"),
    execute: async (client: Client, interaction: CommandInteraction) => {
        const outcomes: Array<string> =
            ["Tails",
                "Heads"
            ];
        const embed: MessageEmbed = new MessageEmbed();
            embed.setColor(primary);
            embed.setDescription(`🪙 A coin was flipped and landed on: \`${outcomes[Math.floor(Math.random() * outcomes.length)]}\``);
        interaction.followUp({ content: null, embeds: [embed] });
    }
}