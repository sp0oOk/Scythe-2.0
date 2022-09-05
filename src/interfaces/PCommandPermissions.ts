import { PermissionString } from "discord.js";

export interface PCommandPermissions {
    name: string,
    aliases: Array<string>,
    permissions: {
        roles: Array<string>,
        permissions: Array<PermissionString>
    }
}