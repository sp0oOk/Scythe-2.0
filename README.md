# Scythe 2.0

WARNING THIS CODE WAS WORKED ON BY MULTIPLE PEOPLE AND IS HIGHLY OUTDATED, BEING ONE OF MY FIRST THINGS WRITTEN IN TS
(expect no support)

Scythe 2.0 is a discord bot coded in Typescript utilising Discord.JS>13.0 and Node.js>17.0 created to make moderation amongst other things easier whilst using discord!

## Installation

Simply run `npm i` in a terminal in the parent directory of the plugin to ensure all dependencies that are required for the bot to function correctly are installed:

```bash
npm i
```
## Command Registration

```js
// Commands are handled with TypeScript interfaces as illustrated here: 
// https://www.typescriptlang.org/docs/handbook/interfaces.html

import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction, MessageEmbed } from "discord.js";
import { PCommand } from "../../interfaces/PCommand";
import { primary } from "../../misc/PUtilities";

export const _CommandExample_: PCommand = {
    category: "Fun", // Category for command
    aliases: [], // Not implemented as we don't utilise message event currently
    deletedPostExecution: false, // Delete after command execution?
    cooldown: 0, // Cooldown for command
    defaults: [], // Permission defaults typedef Array<PermissionString>
    usage: "/example", // Command usage e.g. example <user> [reason] formatting handled automatically
    examples: [], // Examples of command usage (USE `` highlighting with escape characters)
    details: "", // Additional details for the command
    premium: false, // Should the command be a premium only?
    data: new SlashCommandBuilder()
        .setName("example") // Name of command
        // Add extra interfaction options here 
        // (https://discordjs.guide/popular-topics/builders.html#formatters_)
        .setDescription("Example command description"), // Description of command
    execute: async (client: Client, interaction: CommandInteraction) => {
     // Rest of command execution here
    }
}

```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[Scythe Development Team](https://github.com/ScytheDev)
