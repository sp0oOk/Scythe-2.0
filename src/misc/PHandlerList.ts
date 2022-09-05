/**
 * Holds An Array Of Loaded Handlers (Remove from the array to disable easily or disable manually in handler file)
 */

import { MinecraftHandler } from "../handlers/PMinecraftHandler";
import { _PrefixCommandHandler_ } from "../handlers/PPrefixCommand";
import { _SlashCommandHandler_ } from "../handlers/PSlashCommand";
import { PHandler } from "../interfaces/PHandler";

export const PHandlerList: PHandler[] = [
    _SlashCommandHandler_,
    _PrefixCommandHandler_,
    MinecraftHandler
]