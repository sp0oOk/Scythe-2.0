import { Client } from "discord.js";
import { readdirSync } from "fs";
import { PCommand } from "../interfaces/PCommand";
import { PHandler } from "../interfaces/PHandler";

export const _SlashCommandHandler_: PHandler = {
    name: "slashCommandHandler",
    enabled: true,
    onEnable: async (client: Client) => {
        readdirSync("./build/commands").forEach(async (directory: any) => {
            const commands: any = readdirSync(`./build/commands/${directory}/`).filter(async (file) => file.endsWith(".js"));
            for(let command of commands) {
                const _command: PCommand = require(`../commands/${directory}/${command}`);
                // @ts-ignore
                client.commands.set(Object.values(_command)[0].data.name, Object.values(_command)[0]);
            }
            return;
        });
    }
}