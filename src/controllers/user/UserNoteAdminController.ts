import { Request, Response } from "express";
import ValidationHelper, { ValidationOptions } from "../../utility/helper/ValidationHelper";
import { UserNote } from "../../models/UserNote";
import { User } from "../../models/User";
import { generateUUID } from "../../utility/UUID";

/**
 * Gets the specified user's notes that are not linked to a course, i.e. all those, that all mentors can see
 * @param request
 * @param response
 */
async function getGeneralUserNotes(request: Request, response: Response) {
    const user_id = request.query.user_id?.toString();

    const validation = ValidationHelper.validate([
        {
            name: "user_id",
            validationObject: user_id,
            toValidate: [{ val: ValidationOptions.NON_NULL }],
        },
    ]);

    if (validation.invalid) {
        response.status(400).send({ validation: validation.message, validation_failed: validation.invalid });
        return;
    }

    const notes: UserNote[] = await UserNote.findAll({
        where: {
            user_id: user_id,
            course_id: null,
        },
        include: {
            association: UserNote.associations.author,
            attributes: ["id", "first_name", "last_name"],
        },
    });

    response.send(notes);
}

/**
 * Gets all the notes of the requested user by the specified course_id
 */
async function getNotesByCourseID(request: Request, response: Response) {
    const courseID = request.query.courseID;
    const userID = request.query.userID;

    const notes: UserNote[] = await UserNote.findAll({
        where: {
            user_id: userID?.toString(),
            course_id: courseID?.toString(),
        },
        include: {
            association: UserNote.associations.author,
            attributes: ["id", "first_name", "last_name"],
        },
    });

    response.send(notes);
}

async function createUserNote(request: Request, response: Response) {
    const reqUser: User = request.body.user;

    const validation = ValidationHelper.validate([
        {
            name: "user_id",
            validationObject: request.body.user_id,
            toValidate: [{ val: ValidationOptions.NON_NULL }],
        },
        {
            name: "content",
            validationObject: request.body.content,
            toValidate: [{ val: ValidationOptions.NON_NULL }],
        },
    ]);

    if (validation.invalid) {
        response.status(400).send({ validation: validation.message, validation_failed: validation.invalid });
        return;
    }

    const note: UserNote = await UserNote.create({
        uuid: generateUUID(),
        user_id: request.body.user_id,
        course_id: request.body.course_id == "-1" ? null : request.body.course_id,
        content: request.body.content.toString(),
        author_id: reqUser.id,
    });

    const noteWithAuthor: UserNote | null = await note.getAuthor();

    response.send(noteWithAuthor);
}

export default {
    getGeneralUserNotes,
    createUserNote,
    getNotesByCourseID,
};