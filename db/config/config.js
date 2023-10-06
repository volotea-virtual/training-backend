import { config } from 'dotenv';

config();

export const development = {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT ?? "mysql",
};

export const test = {
    username: process.env.CI_DB_USERNAME,
    password: process.env.CI_DATABASE_PASSWORD,
    database: process.env.CI_DATABASE_NAME,
    host: "127.0.0.1",
    port: 3306,
    dialect: "mysql"
}

export const production = {
    username: process.env.PROD_DB_USERNAME,
    password: process.env.PROD_DB_PASSWORD,
    database: process.env.PROD_DB_NAME,
    host: process.env.PROD_DB_HOST,
    port: process.env.PROD_DB_PORT,
    dialect: "mysql"
}