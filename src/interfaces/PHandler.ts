import { Client } from "discord.js";

export interface PHandler {
    name: string,
    enabled: boolean
    onEnable: (client: Client) => Promise<void>
}