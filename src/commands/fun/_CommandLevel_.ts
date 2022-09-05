import { SlashCommandBuilder } from "@discordjs/builders";
import { BufferResolvable, Client, CommandInteraction } from "discord.js";
import { PCommand } from "../../interfaces/PCommand";
import { errorEmbed, getDatabase, getUsers, primary } from "../../misc/PUtilities";
import { User } from "discord.js";
import { levelSettings, userData } from "../../events";
import { Rank } from "canvacord";
import chalk from "chalk";

export const _CommandLevel_: PCommand = {
    category: "Fun",
    aliases: [],
    deletedPostExecution: false,
    cooldown: 0,
    defaults: [],
    usage: "/level [user]",
    examples: [],
    details: "",
    premium: false,
    data: new SlashCommandBuilder()
        .setName("level")
        .addUserOption((opt) => opt.setName("user").setDescription("User to fetch the level of").setRequired(false))
        .setDescription("Returns a rank card containing a users level & progress"),
    execute: async (client: Client, interaction: CommandInteraction) => {
        let user: User | null = interaction.options.getUser("user");
        if(user === null || user === undefined)
            user = interaction.user;

        if(!userData.get(interaction.guildId!))
            userData.set(interaction.guildId!, (await getUsers(interaction.guild!)))

        
        if(!userData.get(interaction.guildId!)[user.id])
            return void interaction.followUp({ content: `**Unable to find \`${user.tag}\` in the database.**`});
            
        let url: string = levelSettings.get(interaction.guildId!)?.links[Math.floor(Math.random() * levelSettings.get(interaction.guildId!).links?.length)] || "https://cdn.discordapp.com/attachments/919173312372965377/919355181639028746/Tm9oS90g.jpg";

        
        const rank: Rank = new Rank();
            rank.setAvatar(user.displayAvatarURL({ dynamic: false, format: "png"}));
            rank.setCurrentXP(userData.get(interaction.guildId!)[user?.id!].xp);
            rank.setRequiredXP(((userData.get(interaction.guildId!)[user?.id!].level + 1) * (userData.get(interaction.guildId!)[user?.id!].level + 1) * 1000));
            rank.setStatus("dnd", true, undefined);
            rank.setProgressBar(primary, "COLOR");
            rank.setBackground("IMAGE", url);
            rank.setUsername(user.username);
            rank.setDiscriminator(user.discriminator);
            rank.build({ fontX: "Manrope", fontY: "Manrope" }).then(async (data) => { 
                const attachment: BufferResolvable = data;
                interaction.followUp({ files: [{ attachment: attachment, name: 'card.png' }] });
            }).catch(error => { console.log(chalk.hex("#F04747")(`[ERROR] ` + chalk.hex("#FFFFFF")(error))); });
    }
}