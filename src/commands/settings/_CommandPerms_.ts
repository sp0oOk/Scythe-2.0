import { Client, CommandInteraction, PermissionString } from "discord.js";
import { PCommand } from "../../interfaces/PCommand";
import { SlashCommandBuilder } from "@discordjs/builders";
import { validPermCmd } from "../../events";
import { errorEmbed, getDatabase, successEmbed } from "../../misc/PUtilities";
import stringSimilarity from "string-similarity";

export const _CommandPerms_: PCommand = {
    category: "Settings",
    aliases: [],
    deletedPostExecution: false,
    cooldown: 5,
    defaults: ["ADMINISTRATOR"],
    usage: "/perms <command> [role | discord permission | \"default\"]",
    examples: [`\`/perms ban ban_members\``, `\`/perms kick Admin\``],
    details: "The \"Permissions\" key refers to the list of permissions [here](https://discord.com/developers/docs/topics/permissions)\nYou can use **`everyone`** or **`@everyone`** to make **any** command available to everyone.\nAdditionally, you can use **`default`** or **`defaults`** to reset a command to its default permissions!",
    premium: false,
    data: new SlashCommandBuilder()
        .setName("perms")
        .addStringOption((opt) => opt.setName("command").setDescription("The command to adjust permissions for").setRequired(true))
        .addStringOption((opt) => opt.setName("operation").setDescription("The operation or argument to apply/redact to/from the command").setRequired(true))
        .setDescription("Set permissions for whom can access certain commands."),
    execute: async (client: Client, interaction: CommandInteraction | any) => {
    
        let command: string = interaction.options.getString("command")!;
        const operation: string = interaction.options.getString("operation")!;
        if (!validPermCmd.has(command)) return void interaction.followUp({ content: null, embeds: [errorEmbed(`The argument provided (\`${command}\`) **is not** a valid **\`command\`**`)] });
        let valid_permissions: Array<PermissionString> | any = ['CREATE_INSTANT_INVITE', 'KICK_MEMBERS', 'BAN_MEMBERS', 'ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_GUILD', 'ADD_REACTIONS', 'VIEW_AUDIT_LOG', 'PRIORITY_SPEAKER', 'STREAM', 'VIEW_CHANNEL', 'SEND_MESSAGES', 'SEND_TTS_MESSAGES', 'MANAGE_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES', 'READ_MESSAGE_HISTORY', 'MENTION_EVERYONE', 'USE_EXTERNAL_EMOJIS', 'VIEW_GUILD_INSIGHTS', 'CONNECT', 'SPEAK', 'MUTE_MEMBERS', 'DEAFEN_MEMBERS', 'MOVE_MEMBERS', 'USE_VAD', 'CHANGE_NICKNAME', 'MANAGE_NICKNAMES', 'MANAGE_ROLES', 'MANAGE_WEBHOOKS', 'MANAGE_EMOJIS_AND_STICKERS', 'USE_APPLICATION_COMMANDS', 'REQUEST_TO_SPEAK', 'MANAGE_THREADS', 'USE_PUBLIC_THREADS', 'USE_PRIVATE_THREADS', 'USE_EXTERNAL_STICKERS'];
        if (!(await getDatabase(interaction.guild!)).exists(`/${interaction.guild?.id}/commands/${command.toLowerCase()}`))
            (await getDatabase(interaction.guild!)).push(`/${interaction.guild?.id}/commands/${command.toLowerCase()}`, { name: command.toLowerCase(), permissions: { roles: [], permissions: validPermCmd.get(command.toLowerCase())?.defaults } });
        let existing_permissions: Array<PermissionString | string | any> | any = (await getDatabase(interaction.guild!)).getData(`/${interaction.guild?.id}/commands/${command.toLowerCase()}/permissions/`);

        if(operation === "everyone" || operation === "@everyone") {
            if(existing_permissions.length < 1 && existing_permissions.roles.length < 1) return void interaction.followUp({ content: null, embeds: [errorEmbed(`The command \`/${command}\` (\`${validPermCmd.get(command.toLowerCase())?.category}:${command.toLowerCase()}\`) is already open to **\`EVERYONE\`**`)] });
            existing_permissions.roles = [];
            existing_permissions.permissions = [];
            (await getDatabase(interaction.guild!)).push(`/${interaction.guild?.id}/commands/${command.toLowerCase()}/permissions/`, existing_permissions, true);
            return void interaction.followUp({ content: null, embeds: [successEmbed(`Successfully removed **\`ALL\`** permissions for the command \`/${command.toLowerCase()}\` (\`${validPermCmd.get(command.toLowerCase())?.category.toLowerCase()}:${command.toLowerCase()}\`)`)] })
        }

        if(operation === "default" || operation === "defaults") {
            if(existing_permissions.permissions === existing_permissions.roles.length < 1 || validPermCmd.get(command.toLowerCase())?.defaults === []) return void interaction.followUp({ content: null, embeds: [errorEmbed(`The command \`/${command.toLowerCase()}\` (\`${validPermCmd.get(command.toLowerCase())?.category.toLowerCase()}:${command.toLowerCase()}\`) already has the **\`DEFAULT\`** permissions!`)] });
            existing_permissions.roles = [];
            existing_permissions.permissions = validPermCmd.get(command.toLowerCase())?.defaults;
            (await getDatabase(interaction.guild!)).push(`/${interaction.guild?.id}/commands/${command.toLowerCase()}/permissions/`, existing_permissions, true);
            return void interaction.followUp({ content: null, embeds: [successEmbed(`Successfully set **\`ALL\`** permissions for the command \`/${command.toLowerCase()}\` (\`${validPermCmd.get(command.toLowerCase())?.category.toLowerCase()}:${command.toLowerCase()}\`) to the \`DEFAULT\` permissions!`)] });
        }

        if(!valid_permissions.includes(operation.toUpperCase())) {
            let _best: string | any = stringSimilarity.findBestMatch(operation, interaction.guild?.roles.cache.map((e: { name: string | undefined; }) => e.name));
            _best = interaction.guild?.roles.cache.find((r: { name: string; }) => r.name === _best.bestMatch.target); 
            if(_best.name === "@everyone") return void interaction.followUp({ content: null, embeds: [errorEmbed(`The role **\`@everyone\`** is restricted to changes to prevent permissible errors!`)] });
            if(existing_permissions.roles.includes(_best.id)) {
                existing_permissions.roles = existing_permissions.roles.filter((r: any) => r !== _best.id);
                (await getDatabase(interaction.guild!)).push(`/${interaction.guild?.id}/commands/${command.toLowerCase()}/permissions/roles`, existing_permissions.roles, true);
                return void interaction.followUp({ content: null, embeds: [successEmbed(`Successfully removed the role <@&${_best.id}> from the command \`/${command}\` (\`${validPermCmd.get(command)?.category.toLowerCase()}:${command}\`)`)] });
            }
            if(existing_permissions.roles.length >= 5) return void interaction.followUp({ content: null, embeds: [errorEmbed(`Unable to add the role <@&${_best.id}> to the command \`/${command}\` (\`${validPermCmd.get(command)?.category.toLowerCase()}:${command}\`) [Limit Reached]`)] });
            existing_permissions.roles.push(_best.id);
            (await getDatabase(interaction.guild!)).push(`/${interaction.guild?.id}/commands/${command.toLowerCase()}/permissions/roles`, existing_permissions.roles, true);
            return void interaction.followUp({ content: null, embeds: [successEmbed(`Successfully added the role <@&${_best.id}> to the command \`/${command}\` (\`${validPermCmd.get(command)?.category.toLowerCase()}:${command}\`)`)] });
        } 

        if (!valid_permissions.includes(operation.toUpperCase())) return void interaction.followUp({ content: null, embeds: [errorEmbed(`The argument provided (\`${operation}\`) **is not** a valid **\`permission\`**! - Refer to this list [here](https://discord.com/developers/docs/topics/permissions)`)] });
        if (existing_permissions.permissions.includes(operation.toUpperCase())) {
            existing_permissions.permissions = existing_permissions.permissions.filter((i: string) => i !== operation.toUpperCase());
            (await getDatabase(interaction.guild!)).push(`/${interaction.guild?.id}/commands/${command.toLowerCase()}/permissions/permissions`, existing_permissions.permissions, true);
            return void interaction.followUp({ content: null, embeds: [successEmbed(`Successfully removed the permission \`${operation.toUpperCase()}\` from the command \`/${command}\` (\`${validPermCmd.get(command)?.category.toLowerCase()}:${command}\`)`)] });
        }
        if(existing_permissions.permissions.length >= 5) return void interaction.followUp({ content: null, embeds: [errorEmbed(`Unable to add the permission \`${operation.toUpperCase()}\` to the command \`/${command}\` (\`${validPermCmd.get(command)?.category.toLowerCase()}:${command}\`) [Limit Reached]`)] });
        existing_permissions.permissions.push(operation.toUpperCase());
        (await getDatabase(interaction.guild!)).push(`/${interaction.guild?.id}/commands/${command.toLowerCase()}/permissions/permissions`, existing_permissions.permissions, true);
        return void interaction.followUp({ content: null, embeds: [successEmbed(`Successfully added the permission \`${operation.toUpperCase()}\` to the command \`/${command}\` (\`${validPermCmd.get(command)?.category.toLowerCase()}:${command}\`)`)] });
    }
}