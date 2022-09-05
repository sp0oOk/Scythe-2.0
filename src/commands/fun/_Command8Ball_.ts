import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction, MessageEmbed } from "discord.js";
import { PCommand } from "../../interfaces/PCommand";
import { primary } from "../../misc/PUtilities";

export const _Command8Ball_: PCommand = {
    category: "Fun",
    aliases: [],
    deletedPostExecution: false,
    cooldown: 0,
    defaults: [],
    usage: "/8ball <question>",
    examples: [],
    details: "",
    premium: false,
    data: new SlashCommandBuilder()
        .setName("8ball")
        .addStringOption((opt) => opt.setName("question").setDescription("Question to ask the gods.").setRequired(true))
        .setDescription("Yes? No? Maybe? Find out."),
    execute: async (client: Client, interaction: CommandInteraction) => {
        const outcomes: Array<string> =
            ["Hmm... simon says, no!",
                "Of course not, you idiot.",
                "Without a doubt.",
                "Argh!",
                "Probably.",
                "No. It is definite.",
                "It is undeniably so.",
                "Does life have a real purpose?",
                "Potential for such a high",
                "I am certain",
                "Interesting... I don't know",
                "That's unfortunate.",
                "Yes. Definitely.",
                "Negative, sergeant",
                "Hmm. Interesting."
            ];
        const embed: MessageEmbed = new MessageEmbed();
            embed.setColor(primary);
            embed.setDescription(`🎱 The gods have spoken: \`${outcomes[Math.floor(Math.random() * outcomes.length)]}\``);
        interaction.followUp({ content: null, embeds: [embed] });
    }
}