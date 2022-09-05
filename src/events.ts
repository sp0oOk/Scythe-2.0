import { Channel, ChannelResolvable, Client, CommandInteraction, GuildBasedChannel, GuildMember, Message, MessageEmbed, Options, PartialGuildMember, PartialMessage, Role, TextBasedChannel } from "discord.js";
import { PCommand } from "./interfaces/PCommand";
import { REST } from "@discordjs/rest";
import { Auth, Customize } from "./config.json";
import { Routes } from "discord-api-types/v9";
import { PCommandList } from "./misc/PCommandList";
import { log, s, success } from "./main";
import { errorEmbed, getDatabase, getUsers, guildSnipes, permissible, premium, primary, searchString, updateUsers } from "./misc/PUtilities";

import chalk from "chalk";
import { PHandlerList } from "./misc/PHandlerList";
import { Guild } from "discord.js";
import { database } from "./handlers/PMinecraftHandler";
import { FieldInfo, MysqlError } from "mysql";

export let validPermCmd: Map<String, PCommand> = new Map();
const formatted: Map<String, Array<String>> = new Map();
export let getHelpEmbed: MessageEmbed = new MessageEmbed();
const is_log_server: Map<Guild, Object | any> = new Map();
export const blacklisted_channels: Map<Guild, Array<string>> = new Map();
export const levelSettings: Map<string, Object | any> = new Map();
export const userData: Map<string, Object | any> = new Map();
export const suggestions: Map<string, Object | any> = new Map();
export const tickets: Map<string | any, any> = new Map();

export async function _DeletedMessage_(client: Client, message: Message | PartialMessage): Promise<void> {
    guildSnipes.set(message.guild!, message);
    if (message.author !== null && message.channel.type !== "GUILD_TEXT") return;
    if (is_log_server.get(message.guild!) === null || is_log_server.get(message.guild!) === undefined) {
        const guild: Object | any = await (await getDatabase(message.guild!)).getObject(`/${message.guild?.id!}/logs`);
        if (guild.enabled && guild.channel === "" || message.guild?.channels.cache.get(guild.channel) === undefined) return;
        is_log_server.set(message.guild!, guild);
    }
    let channel: string | undefined | ChannelResolvable | GuildBasedChannel | any = is_log_server.get(message.guild!)!.channel;
    if (channel === undefined) return;
    if (message.channel.id === channel) return;
    channel = message.guild?.channels.cache.get(channel);
    if (is_log_server.get(message.guild!).options.deleted) {
        if (message.author === null) return; // Ensure author isn't null cause in the deleted-message event it could not have a author object
        const embed: MessageEmbed = new MessageEmbed();
        embed.setAuthor({ name: `Message Deleted ► ${message.author!.tag}`, iconURL: message.author!.avatarURL()!, url: undefined });
        // @ts-ignore
        embed.setDescription(`User <@${message.author.id}> [\`${message.author.id}\`] deleted a message at **\`${message.createdAt.toDateString("en-US")}\`** in the channel <#${message.channel.id}> [\`${message.channel.id}\`] (**\`${message.channel.type}\`**)`);
        embed.addField(`Message Content ─`, `\`\`\`${message.cleanContent}\`\`\``, true);
        if (message.attachments.size >= 1)
            embed.addField(`Message Attachments ─`, message.attachments.size < 1 ? `\`No message attachments\`` : message.attachments.map(m => `[${m.name}](${m.url})`).join(", "));
        embed.setColor(primary);
        embed.setFooter({ iconURL: undefined, text: Customize["embed-footer"] });
        embed.setThumbnail(message.guild?.iconURL()!);
        // @ts-ignore
        return channel.send({ content: null, embeds: [embed] });
    }
}

export async function _OnGuildMemberUpdate(oldMember: GuildMember | PartialGuildMember, newMember: GuildMember | PartialGuildMember): Promise<void> {
    if (oldMember.premiumSinceTimestamp === null && newMember.premiumSinceTimestamp !== null) {
        database.query("SELECT * FROM users WHERE discordID = " + newMember.id, async (error: MysqlError, result?: any, fields?: FieldInfo[]) => {
            if (error) {
                console.log("if you see this a bad error has happened: " + error);
                return;
            }
            if (result.length < 1) return;
            database.query("UPDATE users SET boosting = true WHERE discordID = " + newMember.id, async (error: MysqlError, affected?: any) => {
                if (error) {
                    console.log("bad error happened when inserting boost stuff" + error);
                    return;
                }
                console.log("updated booster for " + newMember.user.username + " [" + newMember.id + "]");
            });
        });
    }
}

export async function _OnGuildLeave_(oldMember: GuildMember | PartialGuildMember): Promise<void> {
    database.query("SELECT * FROM users WHERE discordID = " + oldMember.id, async (error: MysqlError, result?: any, _fields?: FieldInfo[]) => {
        if (error) {
            console.log("if you see this a bad error has happened when removing: " + error);
            return;
        }
        if (result.length < 1) return;
        if (result[0]["boosting"] === true) {
            database.query("INSERT INTO users SET boosting = false WHERE discordID = " + oldMember.id, async (error: MysqlError, _affected?: any) => {
                if (error) {
                    console.log("bad error happened when inserting boost stuff" + error);
                    return;
                }
                console.log("updated booster to false (left discord) for " + oldMember.user.username + " [" + oldMember.id + "]");
            });
        }
    });
}

/**
 * Message Event Handle
 * @param {Client} client 
 * @param {Message} message 
 */

export async function _Message_(client: Client, message: Message): Promise<void> {
    if (message.channel.type !== "GUILD_TEXT" || message.author.bot) return;
    if (is_log_server.get(message.guild!) === null || is_log_server.get(message.guild!) === undefined) {
        const guild: Object | any = await (await getDatabase(message.guild!)).getObject(`/${message.guild?.id!}/logs`);
        if (guild.enabled && guild.channel === "" || message.guild?.channels.cache.get(guild.channel) === undefined) return;
        is_log_server.set(message.guild!, guild);
    }
    let channel: string | undefined | ChannelResolvable | GuildBasedChannel | any = is_log_server.get(message.guild!)!.channel;
    if (channel === undefined) return;
    if (message.channel.id === channel) return;
    channel = message.guild?.channels.cache.get(channel);
    if (is_log_server.get(message.guild!).options.generalMessages) {
        const embed: MessageEmbed = new MessageEmbed();
        embed.setAuthor({ name: `Message Received ► ${message.author.tag}`, iconURL: message.author.avatarURL()!, url: undefined });
        // @ts-ignore
        embed.setDescription(`User <@${message.author.id}> [\`${message.author.id}\`] sent a message at **\`${message.createdAt.toDateString("en-US")}\`** in the channel <#${message.channel.id}> [\`${message.channel.id}\`] (**\`${message.channel.type}\`**)`);
        embed.addField(`Message Content ─`, `\`\`\`${message.cleanContent}\`\`\``, true);
        if (message.attachments.size >= 1)
            embed.addField(`Message Attachments`, message.attachments.size < 1 ? `\`No message attachments\`` : message.attachments.map(m => `[${m.name}](${m.url})`).join(", "));
        embed.setColor(primary);
        embed.setFooter({ iconURL: undefined, text: Customize["embed-footer"] });
        embed.setThumbnail(message.guild?.iconURL()!);
        // @ts-ignore
        return channel.send({ content: null, embeds: [embed] });
    }
}

export async function _MessageLevel_(client: Client, message: Message | PartialMessage): Promise<void> {
    if (message.channel.type !== "GUILD_TEXT" || message.author?.bot) return;

    if (!levelSettings.get(message.guildId!)) levelSettings.set(message.guildId!, await (await getDatabase(message.guild!)).getObject(`/${message.guildId!}/levelSystem`));
    if (!levelSettings.get(message.guildId!).enabled) return;

    if (!userData.get(message.guildId!)) userData.set(message.guildId!, (await (await getUsers(message.guild!)).getObject(`/${message.guild?.id}`)));
    if (!userData.get(message.guildId!)[message.author?.id!]) {
        userData.get(message.guildId!)[message.author?.id!] = {
            xp: 0,
            level: 0,
            totalxp: 0,
            messages: 0,
            opened: 0,
            closed: 0
        }
    }
    userData.get(message.guildId!)[message.author?.id!].xp = userData.get(message.guildId!)[message.author?.id!].xp + Math.floor(Math.random() * (levelSettings.get(message.guildId!).maxXP - 1)) + 1;
    userData.get(message.guildId!)[message.author?.id!].totalxp = userData.get(message.guildId!)[message.author?.id!].totalxp + Math.floor(Math.random() * (levelSettings.get(message.guildId!).maxXP - 1)) + 1;
    userData.get(message.guildId!)[message.author?.id!].messages = userData.get(message.guildId!)[message.author?.id!].messages + 1
    if (userData.get(message.guildId!)[message.author?.id!].xp > (userData.get(message.guildId!)[message.author?.id!].level * userData.get(message.guildId!)[message.author?.id!].level * 1000)) {
        userData.get(message.guildId!)[message.author?.id!].level = userData.get(message.guildId!)[message.author?.id!].level + 1;
        userData.get(message.guildId!)[message.author?.id!].xp = 0;
        await message.channel.send({ content: `**<@${message.member?.id!}> has leveled up to ${userData.get(message.guildId!)[message.author?.id!].level}.**` }).then(msg => {
            setTimeout(() => { msg.delete(); }, 15000);
        });
    }
}


/**
 * Ready Event Handle
 * @param {Client} client 
 */

export async function _Ready_(client: Client): Promise<void> {
    console.clear();
    client.user?.setPresence({ activities: [{ name: `${client.users.cache.size} users | /help`, type: "WATCHING" }], status: "dnd" });
    let commands: Array<Object> = [];
    for (const c of PCommandList) {
        commands.push(c.data.toJSON());
        validPermCmd.set(c.data.name, c);
        if (!formatted.get(c.category))
            formatted.set(c.category, [`\`/${c.data.name}\``]);
        else
            formatted.get(c.category)?.push(`\`/${c.data.name}\``);
    }
    let f: Array<Object> | any = Array.from(formatted, ([category, value]) => ({ category, value }));
    getHelpEmbed.setColor(primary);
    getHelpEmbed.setFooter(Customize["embed-footer"]);
    getHelpEmbed.setAuthor(`List of Commands`, client.user?.displayAvatarURL());
    getHelpEmbed.setDescription(`There are currently **\`${validPermCmd.size}\`** commands loaded! Furthermore, commands will only be \`executed\` if the command is executed in a channel that is **ALLOWED** or the executer bypasses the \`restriction\``);
    f.forEach((obj: { category: string; value: any[]; }) => { getHelpEmbed.addField(obj.category === "NSFW" ? obj.category + " (Disabled)" : obj.category, `\n${obj.value.join(", ")}`, false); });
    let duration = performance.now();
    for (const handler of PHandlerList) {
        if (handler.enabled) {
            await handler.onEnable(client);
            console.log(chalk.hex("#DEADED")(`[!] `) + chalk.hex("#FFFFFF")(handler.name) + chalk.hex("#DEADED")(` has been loaded successfully (` + chalk.hex("#FFFFFF")(`took ${Math.round(performance.now() - duration + Number.EPSILON) * 100 / 100}ms` + chalk.hex("#DEADED")(`)`))));
        }
    }
    const rest = new REST({
        version: '9'
    }).setToken(Auth["discord-token"]);
    try {
        if (!Auth["guild-id"]) {
            await rest.put(Routes.applicationCommands(Auth["client-id"]), { body: commands },); log(`[!] Successfully Loaded a total of ` + chalk.hex("#FFFFFF")(commands.length) + chalk.hex(primary)(` slash-commands [` + chalk.hex("#FFFFFF")(`Method; globally`) + chalk.hex(primary)(`]`)));
        } else {
            await rest.put(Routes.applicationGuildCommands(Auth["client-id"], Auth["guild-id"]), { body: commands },);
            log(`[!] Successfully Loaded a total of ` + chalk.hex("#FFFFFF")(commands.length) + chalk.hex("#DEADED")(` slash-commands [` + chalk.hex("#FFFFFF")(`Method; private`) + chalk.hex("#DEADED")(`]`)));
        }
    } catch (error) {
        if (error) return console.log(error);
    }

    client.guilds.cache.forEach(async (guild) => {
        userData.set(guild.id, (await getUsers(guild!)).getObject(`/`));
    })

    setInterval(() => {
        updateUsers(client);

    }, 300000);
}

export async function _InteractionCreate_(client: Client, interaction: CommandInteraction): Promise<void> {

    if (interaction.isSelectMenu() && interaction.customId === "") {

    }

    if (!interaction.isCommand()) return;
    if (blacklisted_channels.get(interaction.guild!) === undefined)
        blacklisted_channels.set(interaction.guild!, await (await getDatabase(interaction.guild!)).getData(`/${interaction.guild?.id!}/blacklistChannels`));
    if (blacklisted_channels.get(interaction.guild!)?.includes(interaction.channel?.id!)) return void interaction.reply({ content: null, embeds: [errorEmbed(`You are **__not__** allowed to execute commands in this channel!`)], ephemeral: true });
    await interaction.deferReply().catch(async (error) => { });
    const { commandName } = interaction;
    // @ts-ignore
    const command: PCommand = client.commands.get(commandName) as PCommand;
    if (!command) return void interaction.followUp(`Incorrect command`);
    if (!await permissible(command, interaction)) return void interaction.followUp({ content: "You do not have permission to execute this command!" });
    try {
        if (command && command.category === "NSFW") return void interaction.followUp({ content: null, embeds: [errorEmbed(`All **\`NSFW\`** commands are internally disabled by the bot administrator!`)] });
        if (command) await command.execute(client, interaction);
    } catch (error: any) {
        if (error) console.log(error);
        return void interaction.followUp("An internal error occurred");
    }
}

export async function _TicketCreate_(client: Client, interaction: CommandInteraction) {
    if (!interaction.isSelectMenu()) return;
    let guild: Object | any = await (await getDatabase(interaction.guild!)).getObject(`/${interaction.guild?.id}`);
    if (!guild.ticketService.channels.includes(interaction.channel?.id) || !guild.ticketService.enabled) return;

    Object.keys(guild.ticketService.data).every(async (key: Object | any) => {
        if (interaction.values == key) {
            await interaction.deferUpdate();
            let tnumber: Number = Math.floor(1000 + Math.random() * 9000);
            let identifier: string = `${guild.ticketService?.data[key]?.name.toLowerCase()}-${tnumber}`;
            let role: Role | undefined = interaction.guild?.roles.cache.get(`${guild.ticketService.supportRole}`);
            let parent: Channel | undefined | any = interaction.guild?.channels.cache.get(guild.ticketService.data[key].category);
            if (parent === undefined) return void interaction.followUp({ embeds: [errorEmbed(`Failed to create ticket, there is no ticket parent category!`)] });
            let chan: Channel | undefined = await interaction.guild?.channels.create(identifier, {
                type: "GUILD_TEXT", parent: parent, permissionOverwrites:
                    [{ id: interaction.user.id, allow: ['SEND_MESSAGES', 'VIEW_CHANNEL'], },
                    { id: interaction.guild.roles.everyone, deny: ['VIEW_CHANNEL'], },
                    {
                        id: role === undefined ? interaction.message.author.id : role, allow: ['VIEW_CHANNEL'],
                    }]
            });
            tickets.set(chan?.id, { tnumber: tnumber, author: interaction.user?.id });
            (await getDatabase(interaction.guild!)).push(`/${interaction.guild?.id}/ticketService/activeTickets/${chan?.id}`, { tnumber: tnumber, author: interaction.user.id }, true);

            if (!userData.get(interaction.guildId!)[interaction.user?.id!]) {
                userData.get(interaction.guildId!)[interaction.user?.id!] = {
                    xp: 0,
                    totalxp: 0,
                    level: 1,
                    messages: 0,
                    opened: 0,
                    closed: 0,
                }
            }

            userData.get(interaction.guildId!)[interaction.user?.id!].opened = +1;
            await interaction.channel?.send({ content: `${success} <@${interaction.user.id}>, You have opened a **${key}** ticket! (<#${chan?.id}>)`, allowedMentions: { users: [] } }).then(msg => {
                setTimeout(() => { msg.delete() }, 10000);
            });
            return true;
        }
        return false;
    });
}

export async function _GuildMemberAdd_(member: GuildMember): Promise<void> {
    if (await (await getDatabase(member.guild)).getData(`/${member.guild.id}/nameFilter/enabled`) === true) {
        let filtered: Array<string> = await (await getDatabase(member.guild)).getData(`/${member.guild.id}/nameFilter/filtered`);
        if ((await searchString(filtered)).test(member.user.username)) {
            await member.ban({ reason: `User ${member.user.username} has been banned for violating the name filter!` });
        }
    }

    if (await (await getDatabase(member.guild)).getData(`/${member.guild.id}/autoRole/enabled`) === true) {
        let roles: Array<string> = await (await getDatabase(member.guild)).getData(`/${member.guild.id}/autoRole/roles`);
        if (!roles) return;
        roles.forEach(async roleID => {
            let role: Role | any = member.guild.roles.cache.get(roleID);
            await member.roles.add(role);
        });
    }
}