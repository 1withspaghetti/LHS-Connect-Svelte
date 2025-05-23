import { ValidationError } from "yup";
import type { RequestHandler, RouteParams } from "./$types";
import { error, json } from "@sveltejs/kit";
import { ShortLink } from "$lib/models/shortLinkModel";
import { Permission } from "$lib/auth/permissions";
import { idValidator } from "$lib/validation/crud/globalCrudValidator";
import { shortLinkAdminUpdateValidator } from "$lib/validation/shortLinkValidator";

export const PATCH: RequestHandler = async ({ locals, params, request }) => {
    if (!locals.permissions.has(Permission.MANAGE_SHORT_LINKS)) error(403, "You do not have permission to manage short links.");

    const id = getId(params);

    try {
        // Get and validate body
        const req = await request.json();
        const validatedReq = await shortLinkAdminUpdateValidator.validate(req, { stripUnknown: true });

        // Find and update doc in db
        const doc = await ShortLink.findById(id).exec();
        if (doc === null) return error(404, { message: "Not found" });
        doc.set(validatedReq);
        await doc.save();

        return json({
            result: doc.toObject()
        })
    } catch (e) {
        if (e instanceof ValidationError) return error(400, { message: e.message });
        else throw e;
    }
};

export const DELETE: RequestHandler = async ({ locals, params }) => {
    if (!locals.permissions.has(Permission.MANAGE_SHORT_LINKS)) error(403, "You do not have permission to manage short links.");

    const id = getId(params);

    // Find and delete doc in db
    const doc = await ShortLink.findById(id).exec();
    if (doc === null) return error(404, { message: "Not found" });
    await doc.deleteOne().exec();

    return json({})
};

function getId(params: RouteParams) {
    try {
        return idValidator.validateSync(params['id']);
    } catch (e) {
        if (e instanceof ValidationError) return error(400, { message: e.message });
        else throw e;
    }
}