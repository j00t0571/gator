import { CommandHandler, UserCommandHandler } from "./commands/commands";
import { readConfig } from "./config";
import { getUser } from "./lib/db/queries/users";

export function middlewareLoggedIn(handler: UserCommandHandler): CommandHandler {
    return async (cmdName: string, ...args: string[]): Promise<void> => {
        const config = readConfig();
        const currentUserName = config.currentUserName;
        
        if (!currentUserName) {
            throw new Error("User not logged in");
        }

        const currentUser = await getUser(currentUserName);

        if (!currentUser) {
            throw new Error(`User ${currentUserName} not found`);
        }

        await handler(cmdName, currentUser, ...args);
    }
}