import { Permission } from '$lib/auth/permissions';
import type { WithoutID } from '$lib/types/basicTypes';
import { error, json, type RequestEvent } from '@sveltejs/kit';
import type { Model } from 'mongoose';
import { array, ValidationError, type ObjectSchema } from 'yup';
import { idArrayValidator, idValidator } from '$lib/validation/objectId';

// The type of data/models that can be used with the endpoints
type ListType = 'listValue' | 'orderedListValue' | 'singleValue';

// The is a type that represents the function signature for the endpoint groups
type EndpointsType<RouteParams extends Record<string, string>> = <
	TRequestEvent extends RequestEvent<RouteParams, any> = RequestEvent<RouteParams, any>,
	TModelType extends object = any,
>(
	type: ListType,
	model: Model<TModelType>,
	validator: ObjectSchema<WithoutID<TModelType>>
) => Record<string, (event: TRequestEvent) => Response | Promise<Response>>;

/**
 * Common endpoints for listing and creating page data, at the root level of the api for editing (e.g. in /api/v2/page_data/clubs/edit/+server.ts)
 *
 * @param type - The type of data being edited, can be "listValue", "orderedListValue", or "singleValue"
 * @param model - The Mongoose model for the data type being edited
 * @param validator - The Yup validator for the data type being edited
 * @returns A list of endpoints to be exported from a +server.ts file, example usage:
 * ```ts
 * export { GET, POST } from editRootEndpoints("listValue", ClubModel, clubValidator);
 * ```
 */
export const editRootEndpoints: EndpointsType<{}> = (type, model, validator) => ({
	// Fetching all documents
	GET: async ({ locals }) => {
		if (!locals.permissions.has(Permission.VIEW))
			error(403, 'You do not have permission to view this resource.');

		// Return all docs
		return _getAllDocs(model, type);
	},

	// Creating a new document
	POST: async ({ locals, request }) => {
		if (!locals.permissions.has(Permission.EDIT))
			error(403, 'You do not have permission to edit this resource.');
		try {
			const req = await validator.validate(await request.json(), { stripUnknown: true });

			// If it's a single value doc, we delete the existing one(s) to be replaced
			if (type === 'singleValue') await model.deleteMany({});

			// Create doc
			const doc = new model(req);

			// If it can be reordered, find the highest order value and set the new doc's order to one higher
			if (type === 'orderedListValue') {
				const highestOrderDoc = await model
					.find()
					.sort({ order: 'desc' })
					.select('order')
					.limit(1)
					.exec();
				doc.set('order', highestOrderDoc.length > 0 ? highestOrderDoc[0].get('order') || 0 + 1 : 0);
			}

			await doc.save();

			return json({
				result: doc.toObject(),
			});
		} catch (e) {
			if (e instanceof ValidationError) error(400, e.message);
			else throw e;
		}
	},
});

/**
 * Common endpoints for listing and updating entire list of page data, at the under the "all" level of the api for editing (e.g. in /api/v2/page_data/clubs/edit/all/+server.ts)
 *
 * @param type - The type of data being edited, can be "listValue", "orderedListValue", or "singleValue"
 * @param model - The Mongoose model for the data type being edited
 * @param validator - The Yup validator for the data type being edited
 * @returns A list of endpoints to be exported from a +server.ts file, example usage:
 * ```ts
 * export { GET, POST } from editAllEndpoints("listValue", ClubModel, clubValidator);
 * ```
 */
export const editAllEndpoints: EndpointsType<{}> = (type, model, validator) => ({
	// Fetching all documents
	GET: async ({ locals }) => {
		if (!locals.permissions.has(Permission.VIEW))
			error(403, 'You do not have permission to view this resource.');

		// Return all docs
		return _getAllDocs(model, type);
	},

	// Update the entire list of documents
	POST: async ({ locals, request }) => {
		if (!locals.permissions.has(Permission.EDIT))
			error(403, 'You do not have permission to edit this resource.');
		// Single value items cannot be updated as a list, because there can only be one
		if (type === 'singleValue') return error(405, { message: 'Method not allowed' });
		try {
			const arrayValidator = array().of(validator).min(0).max(1000);
			let req = await arrayValidator.validate(await request.json(), { stripUnknown: true });

			// Delete all existing docs
			await model.deleteMany().exec();
			// Add order field if it's an ordered list value
			if (type === 'orderedListValue') req = req!.map((doc, i) => ({ ...doc, order: i }));
			// Insert new docs
			await model.insertMany(req);

			// Return all docs
			return _getAllDocs(model, type);
		} catch (e) {
			if (e instanceof ValidationError) error(400, e.message);
			else throw e;
		}
	},
});

/**
 * Common endpoints for getting, patching, and deleting individual items by id, should have an "id" path param in the api route (e.g. in /api/v2/page_data/clubs/edit/[id]/+server.ts)
 *
 * @param type - The type of data being edited, can be "listValue", "orderedListValue", or "singleValue"
 * @param model - The Mongoose model for the data type being edited
 * @param validator - The Yup validator for the data type being edited
 * @returns A list of endpoints to be exported from a +server.ts file, example usage:
 * ```ts
 * export { GET, PATCH, DELETE } from editIndividualItemEndpoints("listValue", ClubModel, clubValidator);
 * ```
 */
export const editIndividualItemEndpoints: EndpointsType<{ id: string }> = (
	type,
	model,
	validator
) => ({
	GET: async ({ locals, params }) => {
		if (!locals.permissions.has(Permission.VIEW))
			error(403, 'You do not have permission to view this resource.');
		// Single value items cannot be fetched individually, because there can only be one
		if (type === 'singleValue') return error(405, { message: 'Method not allowed' });
		try {
			// Get and validate the id param
			const id = idValidator.validateSync(params.id);

			// Find doc
			const doc = await model.findById(id).exec();
			if (doc === null) return error(404, { message: 'Not found' });

			return json({
				result: doc.toObject(),
			});
		} catch (e) {
			if (e instanceof ValidationError) error(400, e.message);
			else throw e;
		}
	},

	PATCH: async ({ locals, params, request }) => {
		if (!locals.permissions.has(Permission.EDIT))
			error(403, 'You do not have permission to edit this resource.');
		// Single value items cannot be edited individually, because there can only be one
		if (type === 'singleValue') return error(405, { message: 'Method not allowed' });
		try {
			// Get and validate the id param
			const id = idValidator.validateSync(params.id);

			// Get and validate body
			const req = await validator.validate(await request.json(), { stripUnknown: true });

			// Find doc in db
			const doc = await model.findById(id).exec();
			if (doc === null) return error(404, { message: 'Not found' });

			// Update doc
			doc.set(req);
			await doc.save();

			// Return all docs
			return json({
				result: doc.toObject(),
			});
		} catch (e) {
			if (e instanceof ValidationError) return error(400, { message: e.message });
			else throw e;
		}
	},

	DELETE: async ({ locals, params }) => {
		if (!locals.permissions.has(Permission.EDIT))
			error(403, 'You do not have permission to edit this resource.');
		// Single value items cannot be deleted individually, because there can only be one
		if (type === 'singleValue') return error(405, { message: 'Method not allowed' });
		try {
			// Get and validate the id param
			const id = idValidator.validateSync(params.id);

			// Find doc
			const doc = await model.findByIdAndDelete(id).exec();
			if (doc === null) return error(404, { message: 'Not found' });

			// Return all docs
			return json({});
		} catch (e) {
			if (e instanceof ValidationError) return error(400, { message: e.message });
			else throw e;
		}
	},
});

/**
 * Common endpoints for listing and updating the order of page data, at the under the "order" level of the api for editing (e.g. in /api/v2/page_data/clubs/edit/order/+server.ts)
 *
 * @param type - The type of data being edited, can be "listValue", "orderedListValue", or "singleValue"
 * @param model - The Mongoose model for the data type being edited
 * @param validator - The Yup validator for the data type being edited
 * @returns A list of endpoints to be exported from a +server.ts file, example usage:
 * ```ts
 * export { GET, POST } from editOrderEndpoints("listValue", ClubModel, clubValidator);
 * ```
 */
export const editOrderEndpoints: EndpointsType<{}> = (type, model) => ({
	// Fetching all documents
	GET: async ({ locals }) => {
		if (!locals.permissions.has(Permission.VIEW))
			error(403, 'You do not have permission to view this resource.');
		// Single value items cannot be reordered, because there can only be one
		if (type === 'singleValue') return error(405, { message: 'Method not allowed' });

		const docs = await model.find().sort({ order: 'asc' }).select('_id').exec();
		return json({
			order: docs.map((doc) => doc.id),
		});
	},

	// Update the entire list of documents
	POST: async ({ locals, request }) => {
		if (!locals.permissions.has(Permission.EDIT))
			error(403, 'You do not have permission to edit this resource.');
		// Single value items cannot be reordered, because there can only be one
		if (type === 'singleValue') return error(405, { message: 'Method not allowed' });
		try {
			let order = await idArrayValidator.validate(await request.json(), { stripUnknown: true });

			// Get all IDs for order checking
			const allIds = (await model.find().select('_id').exec()).map((doc) => doc.id);
			order = order.filter((id) => allIds.includes(id));
			if (order.length !== allIds.length || !allIds.every((id) => order.includes(id)))
				return error(400, { message: 'Invalid IDs' });

			// Update order
			const promises = [];
			for (let i = 0; i < order.length; i++) {
				promises.push(model.findByIdAndUpdate(order[i], { order: i }).exec());
			}
			await Promise.all(promises);

			return json({
				order,
			});
		} catch (e) {
			if (e instanceof ValidationError) error(400, e.message);
			else throw e;
		}
	},
});

async function _getAllDocs(model: Model<any>, order: boolean | ListType = false) {
	const query = model.find();
	if (typeof order === 'boolean' ? order : order === 'orderedListValue')
		query.sort({ order: 'asc' }); // Sort by order if it's an ordered list value
	const docs = await query.exec();
	return json({
		results: docs.map((doc) => doc.toObject()),
	});
}
