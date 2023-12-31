import { Model, InferAttributes, CreationOptional, InferCreationAttributes, NonAttribute, Association } from "sequelize";
import { sequelize } from "../core/Sequelize";
import { UserData } from "./UserData";
import { DataType } from "sequelize-typescript";
import { UserSettings } from "./UserSettings";
import { MentorGroup } from "./MentorGroup";
import { TrainingSession } from "./TrainingSession";
import { EndorsementGroup } from "./EndorsementGroup";
import { Course } from "./Course";
import { FastTrackRequest } from "./FastTrackRequest";
import { Role } from "./Role";
import { TrainingLog } from "./TrainingLog";
import { UsersBelongsToCourses } from "./through/UsersBelongsToCourses";
import { TrainingRequest } from "./TrainingRequest";

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    //
    // Attributes
    //
    declare id: number;
    declare first_name: string;
    declare last_name: string;
    declare email: string;

    //
    // Optional Attributes
    //
    declare access_token: CreationOptional<string> | null;
    declare refresh_token: CreationOptional<string> | null;
    declare createdAt: CreationOptional<Date> | null;
    declare updatedAt: CreationOptional<Date> | null;

    //
    // Association placeholders
    //
    declare user_data?: NonAttribute<UserData>;
    declare user_settings?: NonAttribute<UserSettings>;
    declare mentor_groups?: NonAttribute<MentorGroup[]>;
    declare mentor_sessions?: NonAttribute<TrainingSession[]>;
    declare cpt_examiner_sessions?: NonAttribute<TrainingSession[]>;
    declare endorsement_groups?: NonAttribute<EndorsementGroup[]>;
    declare training_sessions?: NonAttribute<TrainingSession[]>;
    declare training_requests?: NonAttribute<TrainingRequest[]>;
    declare training_logs?: NonAttribute<TrainingLog[]>;
    declare courses?: NonAttribute<Course[]>;
    declare fast_track_requests?: NonAttribute<FastTrackRequest[]>;
    declare roles?: NonAttribute<Role[]>;

    declare static associations: {
        user_data: Association<User, UserData>;
        user_settings: Association<User, UserSettings>;
        mentor_groups: Association<User, MentorGroup>;
        mentor_sessions: Association<User, TrainingSession>;
        cpt_examiner_sessions: Association<User, TrainingSession>;
        endorsement_groups: Association<User, EndorsementGroup>;
        training_sessions: Association<User, TrainingSession>;
        training_requests: Association<User, TrainingRequest>;
        training_logs: Association<User, TrainingLog>;
        courses: Association<User, Course>;
        fast_track_requests: Association<User, FastTrackRequest>;
        roles: Association<User, Role>;
    };

    /**
     * Checks if the user has a specific role
     */
    hasRole(role: string): boolean {
        let roles: string[] = [];
        this.roles?.forEach(role => {
            roles.push(role.name);
        });

        return roles.includes(role);
    }

    /**
     * Checks if the user has a specific permission
     */
    hasPermission(permission: string): boolean {
        let permissions: string[] = [];
        this.roles?.forEach(role => {
            role.permissions?.forEach(perm => {
                permissions.push(perm.name.toLowerCase());
            });
        });

        return permissions.includes(permission.toLowerCase());
    }

    async getCourses(): Promise<Course[]> {
        const user: User | null = await User.findOne({
            where: {
                id: this.id,
            },
            include: [User.associations.courses],
        });

        return user?.courses ?? [];
    }

    async isMemberOfCourse(uuid: string): Promise<boolean> {
        const course = await Course.findOne({
            where: {
                uuid: uuid,
            },
        });

        const data = await UsersBelongsToCourses.findOne({
            where: {
                course_id: course?.id ?? -1,
                user_id: this.id,
            },
        });

        return data != null;
    }

    async getTrainingSessions(): Promise<TrainingSession[]> {
        const user = await User.findOne({
            where: {
                id: this.id,
            },
            include: [
                {
                    association: User.associations.training_sessions,
                    as: "training_sessions",
                    through: {
                        as: "through",
                    },
                },
            ],
        });

        return user?.training_sessions ?? [];
    }

    async getMentorGroups(): Promise<MentorGroup[]> {
        const user = await User.findOne({
            where: {
                id: this.id,
            },
            include: {
                association: User.associations.mentor_groups,
            },
        });

        return user?.mentor_groups ?? [];
    }

    async getMentorGroupsAndCourses(): Promise<MentorGroup[]> {
        const user = await User.findOne({
            where: {
                id: this.id,
            },
            // User --> Mentor Groups
            include: {
                association: User.associations.mentor_groups,
                attributes: ["id", "name"],
                through: {
                    attributes: [],
                },

                // MentorGroup --> Courses
                include: [
                    {
                        association: MentorGroup.associations.courses,
                        attributes: ["id", "uuid"],

                        through: {
                            attributes: [],
                        },
                    },
                ],
            },
        });

        return user?.mentor_groups ?? [];
    }
}

User.init(
    {
        id: {
            type: DataType.INTEGER,
            primaryKey: true,
        },
        first_name: {
            type: DataType.STRING(40),
            allowNull: false,
        },
        last_name: {
            type: DataType.STRING(40),
            allowNull: false,
        },
        email: {
            type: DataType.STRING,
            allowNull: false,
        },
        access_token: {
            type: DataType.TEXT,
        },
        refresh_token: {
            type: DataType.TEXT,
        },

        createdAt: DataType.DATE,
        updatedAt: DataType.DATE,
    },
    {
        tableName: "users",
        sequelize: sequelize,

        defaultScope: {
            attributes: {
                exclude: ["access_token", "refresh_token", "email"],
            },
        },
        scopes: {
            sensitive: {
                attributes: {
                    exclude: ["access_token", "refresh_token"],
                },
            },
        },
    }
);