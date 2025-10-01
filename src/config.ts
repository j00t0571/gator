import fs from "fs";
import os from "os";
import path from "path";

export type Config = {
    dbUrl: string;
    currentUserName: string;
}

export function setUser(userName: string) {
    const config = readConfig();

    config.currentUserName = userName;
    
    writeConfig(config);
}

export function readConfig(): Config {
    const configPath = getConfigFilePath();
    const data = fs.readFileSync(configPath, { encoding: 'utf-8'});
    const jsonData = JSON.parse(data);

    return validateConfig(jsonData);
}

function getConfigFilePath(): string {
    return path.join(os.homedir(), ".gatorconfig.json");
}

function writeConfig(config: Config) {
    const rawConfig = {
        db_url: config.dbUrl,
        current_user_name: config.currentUserName
    };

    const jsonConfig = JSON.stringify(rawConfig, null, 2);
    const configPath = getConfigFilePath();

    fs.writeFileSync(configPath, jsonConfig, { encoding: 'utf-8' });
}

function validateConfig(rawConfig: any): Config {
    // First check if it's an object
    if (!rawConfig || typeof rawConfig !== 'object') {
        throw new Error('Invalid config: not an object');
    }

    // Then check for required properties
    if (!('db_url' in rawConfig)) {
        throw new Error('Invalid config: missing db_url');
    }

    if (typeof rawConfig.db_url !== 'string') {
        throw new Error ('Invalid config: db_url property not a string');
    }

    const config: Config = {
        dbUrl: rawConfig.db_url,
        currentUserName: rawConfig.current_user_name ?? undefined,
    };

    return config;
}