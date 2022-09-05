import { Client, Collection, Guild, Intents } from "discord.js";
import { Customize } from "./config.json";
import chalk from "chalk";
import { _DeletedMessage_, _GuildMemberAdd_, _InteractionCreate_, _MessageLevel_, _Message_, _OnGuildLeave_, _OnGuildMemberUpdate, _Ready_, _TicketCreate_ } from "./events";
import { Auth } from "./config.json";
import { Player } from "discord-music-player";

export const color: string = Customize["embed-color"], footer: string = Customize["embed-footer"];
export const fail: string = "#F04747", success: string = "#458C01", warning: string = "#F5AD42";
export const s: string = "<:success:902779544707141712> ", f: string = "<:failed:902779544484864072> ", w: string = "<:warning:902779544518426635>", i: string = "<:info:902779544648433665>";

export async function log(...args: any) { console.log(chalk.hex("#DEADED")(args)); };

const intentions: Intents = new Intents(["GUILDS", "GUILD_MEMBERS", "GUILD_MEMBERS", "GUILD_BANS", "DIRECT_MESSAGE_REACTIONS", "GUILD_MESSAGE_REACTIONS", "GUILD_VOICE_STATES", "GUILD_EMOJIS_AND_STICKERS", "GUILD_MESSAGES", "GUILD_PRESENCES"]);
const client: Client = new Client({ intents: intentions, partials: ["GUILD_MEMBER", "REACTION", "MESSAGE"], allowedMentions: { users: [] }, retryLimit: 10 });

export const player = new Player(client, { leaveOnEmpty: false, deafenOnJoin: true, volume: 100 });

// @ts-ignore
client.commands = new Collection();

(async () => {
    await client.login(Auth["discord-token"]).catch(async (error) => { if(error) return console.log(chalk.hex(fail)(error)); });
    client.on("ready", async () => { await _Ready_(client); });
    client.on("messageCreate", async (message) => { await _Message_(client, message); await _MessageLevel_(client, message)});
    client.on("guildMemberAdd", async (member) => { await _GuildMemberAdd_(member); })
    client.on("interactionCreate", async (interaction: any) => { await _InteractionCreate_(client, interaction); await _TicketCreate_(client, interaction); });
    client.on("messageDelete", async (message) => { await _DeletedMessage_(client, message); });
    client.on("guildMemberUpdate", async (oldMember, newMember) => { await _OnGuildMemberUpdate(oldMember, newMember); });
    client.on("guildMemberRemove", async (leftMember) => {  await _OnGuildLeave_(leftMember); });
    client.on("error", async (err: Error) => { console.log("Discord API ERROR: " + err); });
})();