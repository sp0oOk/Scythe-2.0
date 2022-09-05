import { Client } from "discord.js";
import { PHandler } from "../interfaces/PHandler";

export const _PrefixCommandHandler_: PHandler = {
    name: "prefixCommandHandler",
    enabled: false,
    onEnable: (client: Client) => {
        throw new Error("Function not implemented.");
    }
}