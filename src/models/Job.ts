import { CreationOptional, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from "../core/Sequelize";
import { DataType } from "sequelize-typescript";

export class Job extends Model<InferAttributes<Job>, InferCreationAttributes<Job>> {
    // Attributes
    declare uuid: string;
    declare attemps: number;
    declare status: "queued |running | completed";
    // Optional Attributes
    declare id: CreationOptional<number>;
    declare payload: CreationOptional<JSON> | null;
    declare available_at: CreationOptional<Date> | null;
    declare job_type: CreationOptional<"email"> | null;
    declare last_executed: CreationOptional<Date> | null;
    declare createdAt: CreationOptional<Date> | null;
    declare updatedAt: CreationOptional<Date> | null;
}

Job.init(
    {
        id: {
            type: DataType.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        uuid: {
            type: DataType.UUID,
            allowNull: false,
        },
        job_type: {
            type: DataType.ENUM("email"),
        },
        payload: {
            type: DataType.JSON,
            comment: "Payload for the job, includes JSON data for the job to execute",
        },
        attemps: {
            type: DataType.TINYINT({unsigned: true}),
            allowNull: false,
        },
        available_at: {
            type: DataType.DATE,
        },
        last_executed: {
            type: DataType.DATE,
        },
        status: {
            type: DataType.ENUM("queued", "running", "completed"),
            allowNull: false,
        },
        createdAt: DataType.DATE,
        updatedAt: DataType.DATE,
    },
    {
        tableName: "jobs",
        sequelize: sequelize,
    }
);