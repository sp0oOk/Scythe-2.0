import { Connection, createConnection } from "mysql2";
import { PHandler } from "../interfaces/PHandler";
import { db } from "../config.json";
export let database: Connection;

export const MinecraftHandler: PHandler = {
    name: "MinecraftHandler",
    enabled: true,
    onEnable: async () => {
        database = createConnection({
            host: db["host"],
            port: db["port"],
            user: db.username,
            password: db["password"],
            database: db["database"],
        });

        database.connect((sqlError: string | any) => {
            if(sqlError) return console.log("[SQL-ERR] An unexpected error occurred: " + sqlError);
            console.log("[SQL] Authenticated with database on host " + db["host"] + " successfully!");
        });
    }
}