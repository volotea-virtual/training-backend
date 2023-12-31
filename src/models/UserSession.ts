import { Model, InferAttributes, CreationOptional, InferCreationAttributes, ForeignKey, NonAttribute, Association } from "sequelize";
import { User } from "./User";
import { DataType } from "sequelize-typescript";
import { sequelize } from "../core/Sequelize";

export class UserSession extends Model<InferAttributes<UserSession>, InferCreationAttributes<UserSession>> {
    //
    // Attributes
    //
    declare uuid: string;
    declare browser_uuid: string;
    declare client: string;
    declare user_id: ForeignKey<User["id"]>;
    declare expires_at: Date;
    declare expires_latest: Date;

    //
    // Optional Attributes
    //
    declare id: CreationOptional<number>;
    declare createdAt: CreationOptional<Date> | null;
    declare updatedAt: CreationOptional<Date> | null;

    declare user?: NonAttribute<User>;

    declare static associations: {
        user: Association<UserSession, User>;
    };
}

UserSession.init(
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
        browser_uuid: {
            type: DataType.UUID,
            allowNull: false,
        },
        client: {
            type: DataType.STRING(100),
            allowNull: true,
        },
        user_id: {
            type: DataType.INTEGER,
            allowNull: false,
            references: {
                model: "users",
                key: "id",
            },
            onUpdate: "cascade",
            onDelete: "cascade",
        },
        expires_at: {
            type: DataType.DATE,
            allowNull: false,
        },
        expires_latest: {
            type: DataType.DATE,
            allowNull: false,
        },
        createdAt: DataType.DATE,
        updatedAt: DataType.DATE,
    },
    {
        tableName: "user_session",
        sequelize: sequelize,
    }
);