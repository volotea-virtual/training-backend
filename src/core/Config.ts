import dotenv from "dotenv";
import { Dialect, Options } from "sequelize";
import Logger, { LogLevels } from "../utility/Logger";

dotenv.config();
console.log(`Loading .env...`);

// Validate required environment variables before continuing
const required_env: Array<string> = [
    "DB_DIALECT",
    "DB_USERNAME",
    "DB_PASSWORD",
    "DB_DATABASE_NAME",
    "DB_HOST",
    "DB_PORT",
    "APP_PORT",
    "APP_KEY",
    "APP_HOST",
    "SESSION_COOKIE_NAME",
    "VATSIM_API_BASE",
    "MOODLE_API_BASE",
    "CONNECT_BASE",
    "CONNECT_CLIENT_ID",
    "CONNECT_REDIRECT_URI",
    "CONNECT_SECRET",
];

let env_missing: boolean = false;

required_env.forEach(key => {
    if (process.env[key] == null) {
        Logger.log(LogLevels.LOG_ERROR, `Missing the following .env key [${key}].`);
        env_missing = true;
    }
});

if (env_missing) process.exit(-1);

Logger.log(LogLevels.LOG_SUCCESS, `.env contains all required keys. \n`);

// If all the variables are present, we can continue creating the config!
export const Config = {
    // read from package.json
    APP_VERSION: process.env.APP_VERSION ?? "N/A",
    // read from .env
    APP_DEBUG: process.env.APP_DEBUG?.toLowerCase() == "true",
    APP_LOG_SQL: process.env.APP_LOG_SQL?.toLowerCase() == "true",
    APP_KEY: process.env.APP_KEY,
    APP_PORT: Number(process.env.APP_PORT),
    APP_HOST: process.env.APP_HOST,
    SESSION_COOKIE_NAME: process.env.SESSION_COOKIE_NAME ?? "vvoe_tc_session",
    FILE_STORAGE_APPLICATION: process.env.FILE_STORAGE_LOCATION ?? "./storage/uploads",
    FILE_TMP_LOCATION: process.env.FILE_TMP_LOCATION ?? "./storage/tmp/",
    URI_CONFIG: {
        VATSIM_API_BASE: process.env.VATSIM_API_BASE,
        MOODLE_API_BASE: process.env.MOODLE_API_BASE
    },
    CONNECT_CONFIG: {
        BASE_URL: process.env.CONNECT_BASE,
        CLIENT_ID: process.env.CONNECT_CLIENT_ID,
        REDIRECT_URI: process.env.CONNECT_REDIRECT_URI,
        SCOPE: process.env.CONNECT_SCOPE ?? "full_name vatsim_details email country",
        SECRET: process.env.CONNECT_SECRET,

    },
    DATABASE_CONFIG: {
        DIALECT: process.env.DB_DIALECT as Dialect,
        USERNAME: process.env.DB_USERNAME,
        PASSWORD: process.env.DB_PASSWORD,
        DATABASE_NAME: process.env.DATABASE_NAME,
        HOST: process.env.DB_HOST,
        PORT: Number(process.env.DB_PORT)
    },
};

export const SequelizeConfig: Options = {
    dialect: Config.DATABASE_CONFIG.DIALECT,
    username: Config.DATABASE_CONFIG.USERNAME,
    password: Config.DATABASE_CONFIG.PASSWORD,
    database: Config.DATABASE_CONFIG.DATABASE_NAME,
    host: Config.DATABASE_CONFIG.HOST,
    port: Config.DATABASE_CONFIG.PORT,

    // define custom logging functions for SQL Entries
    logging: message => {
        if (!Config.APP_LOG_SQL) return;
        Logger.log(LogLevels.LOG_INFO, message + "\n", false, "SQL")
    },
};
