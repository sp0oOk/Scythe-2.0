import { Client, Collection, ColorResolvable, CommandInteraction, Guild, GuildManager, Interaction, Message, MessageEmbed, PartialMessage, PermissionString, TextBasedChannel, User } from "discord.js";
import { PCommand } from "../interfaces/PCommand";
import { f, i } from "../main";
import { PCommandList } from "./PCommandList";
import { Customize, Auth } from "../config.json";
import { JsonDB } from "node-json-db";
import { Config } from "node-json-db/dist/lib/JsonDBConfig";
import { existsSync, mkdir, writeFileSync } from "fs";
import { userData } from "../events";

export const primary = "#3BC2DF";
export const secondary = "#008CA8";
export const single = "<:pSingle:926282768609067098>";
export const multi = "<:pDouble:926282768470663249>";
export const eFailed = "<:warning:919698419885408267>";
export const eSuccess = "<:success:919698419696681041>";
export const premium = "<a:premium:918873212299931648>";
export const hashtag = "<a:hashtag:919173142851776512>";
export const text = "<:text:919199375148847175>";
export const voice = "<:voice:919199375400501308>";
export const category = "<:categories:919199375488585749>";
export const online = "<:online:919698420149678120>";
export const idle = "<:idle:919698419671502908>";
export const dnd = "<:dnd:919698419797332059>";
export const offline = "<:offline:919698419780583495>";
export const minecraft = "https://cdn.discordapp.com/attachments/919173312372965377/920793096382464020/kindpng_1578088.png";

export const userObject: Object = { xp: 0, requiredXP: 500, level: 0, messages: 0 }

/**
 * Sorts Channel/Position/Priority
 * @param c Object A (Param type: str, Param position: number)
 * @param cc Object B (Param type: any, Param position: number)
 * @returns Channel Position Sorted (number)
 */
export const sortChannel = (c: { type: string; position: number; }, cc: { type: any; position: number; }) => { if (c.type !== cc.type) { if (c.type === "GUILD_VOICE") return 1; else return -1; } else return c.position - cc.position; }

/**
 * Quickly Construct Error Embeds
 * @param m Message ... Any
 * @returns new MessageEmbed();
 */
export const errorEmbed = (...m: any[]) => { return new MessageEmbed().setDescription(`${eFailed} ${m}`).setColor(primary); }

/**
 * Quickly Construct Success Embeds
 * @param m Message ... Any
 * @returns new MessageEmbed();
 */
export const successEmbed = (...m: any[]) => { return new MessageEmbed().setDescription(`${eSuccess} ${m}`).setColor(primary); }

/**
 * Stores Recent Snipe in GUILD in memory
 */
export const guildSnipes: Map<Guild, Message | PartialMessage> = new Map();

/**
 * Obtains new Instance of JsonDB to easily add changes and or create DB automatically per guild (For Guild Data)
 * @param guild Guild Object
 * @returns New JsonDB Instance
 */

export async function getDatabase(guild: Guild): Promise<JsonDB> {
    let database: JsonDB;
    if (!existsSync(`./data/${guild.id}`)) {
        mkdir(`./data/${guild.id}/`, { recursive: true }, async (error) => {
            if (error) return console.log(error);
            writeFileSync(`./data/${guild.id}/${guild.id}.json`, "{}");
        });
    }
    database = new JsonDB(new Config(`./data/${guild.id}/${guild.id}.json`, true, true, '/'));
    if (!database.exists(`/${guild.id}/`))
        database.push(`./${guild.id}/`, {  levelSystem: { enabled: true, maxXP: 25,  cooldown: 3000, links: [] }, suggestions: { enabled: false, count: 0, suggestions: new Map()}, blacklistChannels: [], logs: { enabled: true, channel: "", options: { generalMessages: false, accountChanges: false, cases: false, deleted: false, edited: false } }, nameFilter: { enabled: false, disableWelcome: false, flags: { ignoreCase: true, unicode: false }, filtered: [] }, autoRole: { enabled: false, roles: []}, ticketService: { enabled: false, data: {}, channels: [], stats: {} } });
    return database;
}

/**
 * Obtains a new Instance of JsonDB to easily add changes or create DB automatically per guild (For User Data)
 * @param guild Guild Object
 * @returns new JsonDB Instance
 */

export async function getUsers(guild: Guild): Promise<JsonDB> {
    if (!existsSync(`./data/${guild.id}`)) {
        mkdir(`./data/${guild.id}/`, { recursive: true }, async (error) => {
            if (error) return console.log(error);
            writeFileSync(`./data/${guild.id}/${guild.id}-users.json`, "{}");
        });
    }
    return new JsonDB(new Config(`./data/${guild.id}/${guild.id}-users.json`, true, true, '/'));
}

/**
 * Creates Regex for Each String for quick regex tests (Used for filters)
 * @param array Array of strings
 * @returns RegExp
 */

export async function searchString(array: Array<string>): Promise<RegExp> {
    return new RegExp(array.map(function (str) {return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');}).join('{1,}|') + '{1,}');
}

/**
 * Permission Check (Roles & Users & Defaults)
 * @param {PCommand} command 
 * @param {Interaction} Interaction 
 * @returns 
 */

export async function permissible(command: PCommand, interaction: Interaction): Promise<boolean> {
    if (!(await getDatabase(interaction.guild!)).exists(`/${interaction.guild?.id}/commands/${command.data.name}`)) {
        let allowedPermissions: Array<PermissionString> = command.defaults;
        if (allowedPermissions.length < 1) return true;
        if (interaction.guild?.members.cache.get(interaction.user.id)?.permissions.toArray().some(s => allowedPermissions.indexOf(s) >= 0)) return true;
        return false;
    }
    let allowedRoles: Array<string> = (await getDatabase(interaction.guild!)).getData(`/${interaction.guild?.id}/commands/${command.data.name}/permissions/roles`);
    if (interaction.guild?.members.cache.get(interaction.user.id)?.roles.cache.hasAny(...allowedRoles)) return true;
    let allowedPermissions: Array<PermissionString> = (await getDatabase(interaction.guild!)).getData(`/${interaction.guild?.id}/commands/${command.data.name}/permissions/permissions`);
    if (allowedPermissions.length < 1) return true;
    if (interaction.guild?.members.cache.get(interaction.user.id)?.permissions.toArray().some(s => allowedPermissions.indexOf(s) >= 0)) return true;
    return false;
}

/**
 * Resolves a PCommand Object from string
 * @param {string} command 
 * @returns 
 */

export async function getCommand(command: string): Promise<PCommand | null> {
    for (const cmd of PCommandList)
        if (cmd.data.name === command)
            return cmd;
    return null;
}

/**
 * Reduces Specified array into chunks
 * @param input Array to be reduced
 * @param size in chunks of ? e.g. ["hi", "hi2", "hi3", "hi4"] in size (2) => [["hi", "hi2"] ["hi3", "hi4"]]
 * @returns 
 */

export async function reduce(input: Array<any>, size: number): Promise<Array<any>> {
    return input.reduce((a, _, i) => (i % size) ? a : [...a, input.slice(i, i + size)], []);
}

/**
 * Handle Page Embeds With Ease
 * @param data Data In (Array ANY)
 * @param split Chunk size
 * @param pageNumber Position in Chunked Array to display
 * @param joined Should Data be joined? if so what delimiter
 * @param footer Embed Footer?
 * @param author Embed Author?
 * @param isField Should A Embed Field Be Used?
 * @param fieldName Embed Field Name?
 * @param inLine Embed Field Inline?
 * @param embedColor Embed Colour? (defaults to primary)
 * @param Interaction Interaction to handle paging on
 * @returns 
 */

export async function page_Embed(data: Array<any> | any, split: number, pageNumber: number | undefined, joined: string | undefined, footer: string | undefined, author: string | undefined, description: string | undefined, isField: boolean, fieldName: string | undefined | any, inLine: boolean, embedColor: string | ColorResolvable | any | undefined, interaction: CommandInteraction) {
    let grouped: Array<any> = await reduce(data, split);
    let pageCount: number = grouped[0].length;
    for (let pages = 0; pages < grouped[0].length; ++pages)
        ++pageCount;
    if (pageCount > 1 && pageNumber === undefined) {
        let embed: MessageEmbed = new MessageEmbed();
        if (author !== undefined)
            embed.setAuthor(author, interaction.user.displayAvatarURL())
        embed.setColor(embedColor !== undefined ? embedColor : Customize["embed-color"]);
        if (joined !== undefined)
            grouped[0] = grouped[0].join(joined);
        if (description !== undefined)
            embed.setDescription(description);
        if (isField)
            embed.addField(isField === true && fieldName === undefined ? "Not Defined" : fieldName, grouped[0], inLine ? true : false);
        else
            embed.setDescription(grouped[0]);
        if (footer !== undefined)
            embed.setFooter(footer.includes("{pageMin}") ? footer.replace("{pageMin}", "1").replace("{pageMax}", `${grouped.length}`) : footer);
        return void interaction.followUp({ embeds: [embed] });
    }
    if (pageCount > 1 && pageNumber !== undefined) {
        let saveCount: number = pageNumber;
        pageNumber--;
        if (!grouped[pageNumber]) return void interaction.followUp({ content: i + `The page specified was unresolvable in the array passed, does it exist? \`Valid Pages: 1-${grouped.length}\`` });
        let embed: MessageEmbed = new MessageEmbed();
        if (author !== undefined)
            embed.setAuthor(author, interaction.user.displayAvatarURL())
        embed.setColor(embedColor !== undefined ? embedColor : Customize["embed-color"]);
        if (joined !== undefined)
            grouped[pageNumber] = grouped[pageNumber].join(joined);
        if (description !== undefined)
            embed.setDescription(description);
        if (isField)
            embed.addField(isField === true && fieldName === undefined ? "Not Defined" : fieldName, grouped[pageNumber], inLine ? true : false);
        else
            embed.setDescription(grouped[pageNumber]);
        if (footer !== undefined)
            embed.setFooter(footer.includes("{pageMin}") ? footer.replace("{pageMin}", `${saveCount}`).replace("{pageMax}", `${grouped.length}`) : footer);
        return void interaction.followUp({ embeds: [embed] });
    }
    return void interaction.followUp({ content: f + `Unable to complete operation with the data passed.` });
}


export async function fetchAllMessages(channel: TextBasedChannel, limit = 500): Promise<Collection<string, Message>> {
    if (!channel) {
      throw new Error(`Expected channel, got ${typeof channel}.`);
    }
    if (limit <= 100) {
      return channel.messages.fetch({ limit });
    }
  
    let collection: Collection<string, Message> = new Collection();
    let lastId: string | any = null;
    let options = {};
    let remaining: Number | any = limit;
  
    while (remaining > 0) {
        //@ts-ignore
        options.limit = remaining > 100 ? 100 : remaining;
        remaining = remaining > 100 ? remaining - 100 : 0;
        
        //@ts-ignore
        if (lastId) options.before = lastId;
  
        let messages = await channel.messages.fetch(options);
  
        if (!messages.last()) {
            break;
        }
  
        collection = collection.concat(messages);
        lastId = messages.last()?.id;
    }
  
    return collection;
  }

  export async function updateUsers(client: Client) {
    client.guilds.cache.forEach(async ( guild ) => {
        let data: object = userData.get(guild.id);
        Object.keys(data).forEach(async ( key ) => {
            if(data) (await getUsers(guild!)).push(`/${key}`, data[key], true);
        })
    })
  }

  export async function validURLCheck(str: string) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
  }